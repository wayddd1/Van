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
      
      // Store the original headers before any modifications
      const originalHeaders = { ...originalRequest.headers };
      
      // Get the stored tokens
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      try {
        // Validate tokens
        if (!storedRefreshToken) {
          console.warn('No refresh token available, using stored token as fallback');
          // If we don't have a refresh token but have a token, try using that
          if (storedToken) {
            console.log('Using existing token as fallback');
            // Create a new axios instance to avoid interceptor loops
            const plainAxios = axios.create();
            originalRequest.headers['Authorization'] = `Bearer ${storedToken}`;
            return plainAxios(originalRequest);
          }
          throw new Error('No authentication tokens available');
        }
        
        console.log('Attempting to refresh token with:', storedRefreshToken.substring(0, 15) + '...');
        
        // Use a direct fetch call to avoid circular dependencies with axios interceptors
        const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${storedToken}` // Use the access token, not refresh token
          },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
          credentials: 'include'
        });
        
        console.log('Token refresh status:', refreshResponse.status);
        
        if (!refreshResponse.ok) {
          console.warn(`Refresh failed with status: ${refreshResponse.status}`);
          // Try with existing token instead of throwing
          if (storedToken) {
            console.log('Refresh failed, using existing token as fallback');
            // Create a new axios instance to avoid interceptor loops
            const plainAxios = axios.create();
            originalRequest.headers['Authorization'] = `Bearer ${storedToken}`;
            return plainAxios(originalRequest);
          }
          throw new Error(`Refresh failed with status: ${refreshResponse.status}`);
        }
        
        // If we get here, the request was successful
        const data = await refreshResponse.json();
        console.log('Token refresh response:', data);
        
        if (data && (data.token || data.accessToken)) {
          const newToken = data.token || data.accessToken;
          localStorage.setItem('token', newToken);
          
          // Update axiosInstance default headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          
          // Restore original headers first, then update with new token
          originalRequest.headers = { ...originalHeaders };
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Make sure to create a new axios instance to avoid circular interceptors
          const plainAxios = axios.create();
          return plainAxios(originalRequest);
        } else {
          console.warn('Invalid token response, using existing token as fallback');
          // Try with existing token instead of throwing
          if (storedToken) {
            // Create a new axios instance to avoid interceptor loops
            const plainAxios = axios.create();
            originalRequest.headers['Authorization'] = `Bearer ${storedToken}`;
            return plainAxios(originalRequest);
          }
          throw new Error('Invalid token response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Try to use the existing token as a fallback
        if (storedToken && !originalRequest._tokenFallbackAttempted) {
          console.log('Trying existing token as fallback...');
          originalRequest._tokenFallbackAttempted = true;
          
          // Restore original headers first, then update with existing token
          originalRequest.headers = { ...originalHeaders };
          originalRequest.headers['Authorization'] = `Bearer ${storedToken}`;
          
          // Use a new axios instance without interceptors to avoid infinite loop
          const plainAxios = axios.create();
          try {
            return await plainAxios(originalRequest);
          } catch (fallbackError) {
            console.error('Fallback request also failed:', fallbackError);
          }
        }
        
        // If we have user data in localStorage, use it as a fallback
        // This allows the UI to still show user info even if API calls fail
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log('Using stored user data as fallback');
          // Don't clear tokens - let the user stay logged in with cached data
          return Promise.reject(error);
        }
        
        // If all attempts fail, don't clear auth data here
        // Let the user stay logged in with invalid tokens until they manually log out
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
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        // Try to call the logout endpoint, but don't wait for it to complete
        axiosInstance.post('/api/auth/logout', null, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        }).catch(error => {
          console.error('Logout request failed:', error.response?.data || error.message);
          // Ignore errors during logout
        });
      }
    } finally {
      // Always clear local storage and state, even if the request fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentBooking');
      
      // Clear state
      setToken(null);
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      
      // Clear axios default headers
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };  

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token before making the request
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        throw new Error('No token available');
      }
      
      // Try to get user profile with a direct axios call to avoid interceptor loops
      const plainAxios = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        withCredentials: true
      });
      
      const response = await plainAxios.get('/api/users/profile');
      const userData = response.data;
      
      // Update user state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set role based on user data
      const userRole = userData.role || 'CUSTOMER';
      setRole(userRole);
      localStorage.setItem('userRole', userRole);
      
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If API call fails, try to use data from localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Set role based on stored user data
          const userRole = userData.role || 'CUSTOMER';
          setRole(userRole);
          localStorage.setItem('userRole', userRole);
          
          return userData;
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
        }
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      try {
        // First try the /login endpoint
        response = await axiosInstance.post('/login', formData);
      } catch (initialError) {
        console.log('Initial login attempt failed, trying /api/auth/login endpoint');
        
        // If that fails, try the /api/auth/login endpoint with a direct axios call
        // to avoid interceptors during login
        const plainAxios = axios.create({
          baseURL: 'http://localhost:8080',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        response = await plainAxios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
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
      const storedToken = localStorage.getItem('token');
      
      if (!storedRefreshToken) {
        console.warn('No refresh token available, skipping refresh');
        return null;
      }
      
      console.log('Attempting to refresh token with:', storedRefreshToken.substring(0, 15) + '...');
      
      // Use fetch instead of axios to avoid interceptor loops
      const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${storedToken}` // Use the access token, not refresh token
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
        credentials: 'include'
      });
      
      if (!refreshResponse.ok) {
        throw new Error(`Refresh failed with status: ${refreshResponse.status}`);
      }
      
      // If we get here, the request was successful
      const data = await refreshResponse.json();
      console.log('Token refresh response:', data);
      
      if (data && (data.token || data.accessToken)) {
        const newToken = data.token || data.accessToken;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // Update axiosInstance default headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return newToken;
      } else {
        console.warn('Invalid token response, but not forcing logout');
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // Don't force logout on refresh failure, let the user continue with existing token
      return null;
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
