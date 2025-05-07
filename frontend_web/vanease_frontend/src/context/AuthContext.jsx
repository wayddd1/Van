import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create an axios instance with interceptors for token handling
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for cookies if used
});

// Debug log all requests
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request:', request.method, request.url);
  // Add token to every request if available
  const token = localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
    console.log('Token added to request');
  }
  return request;
});

// Add a response interceptor to handle 401/403 responses
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If the error is 401/403 and we haven't tried to refresh the token yet
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      console.log('Token expired, attempting to refresh...');
      
      try {
        // Try to refresh the token
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }
        
        console.log('Attempting to refresh token with:', storedRefreshToken.substring(0, 15) + '...');
        
        // Use fetch directly to avoid circular dependencies with axiosInstance
        const response = await fetch('http://localhost:8080/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${storedRefreshToken}`
          },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
          credentials: 'include',
          mode: 'cors'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Token refresh error response:', errorText);
          throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Token refresh response:', data);
        
        if (data && (data.token || data.accessToken)) {
          const newToken = data.token || data.accessToken;
          localStorage.setItem('token', newToken);
          // Update axiosInstance default headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          // Update the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } else {
          throw new Error('Invalid token response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear auth data on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
    }
    
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('userRole'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout request failed:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
      setRole(null);
    }
  };  

  const fetchUserProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data;
      const userRole = userData.role?.toUpperCase();

      setUser(userData);
      setRole(userRole);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userRole);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login for:', formData);
      
      // Try both endpoints with a fallback mechanism
      let response;
      try {
        // First try the /auth/login endpoint (without /api prefix)
        response = await axios.post('http://localhost:8080/auth/login', {
          email: formData.email,
          password: formData.password
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
      } catch (firstError) {
        console.log('First login attempt failed, trying alternate endpoint:', firstError.message);
        // If that fails, try the /api/auth/login endpoint
        response = await axios.post('http://localhost:8080/api/auth/login', {
          email: formData.email,
          password: formData.password
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
      }
      
      console.log('Login response:', response);
      
      const data = response.data;
      const token = data.token || data.accessToken;
      const refreshToken = data.refreshToken;
      const userData = data.user || {};
      
      if (token) {
        // Store auth data in localStorage
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update auth context state
        setUser(userData);
        setRole(userData.role || 'CUSTOMER');
        setIsAuthenticated(true);
        
        // Set token in axios default headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('Login successful, user role:', userData.role || 'CUSTOMER');
        return data;
      } else {
        throw new Error('Invalid login response - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      
      console.log('Attempting to refresh token with:', storedRefreshToken.substring(0, 15) + '...');
      
      // Use fetch directly to avoid circular dependencies with axiosInstance
      const response = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${storedRefreshToken}`
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token refresh error response:', errorText);
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Token refresh response:', data);
      
      if (data && (data.token || data.accessToken)) {
        const newToken = data.token || data.accessToken;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // Update axiosInstance default headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return newToken;
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout(); // Force logout on refresh failure
      throw error;
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        refreshToken();
      }
    }, 15 * 60 * 1000); // every 15 mins

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        login,
        logout,
        loading,
        error,
        isAuthenticated: !!token,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
