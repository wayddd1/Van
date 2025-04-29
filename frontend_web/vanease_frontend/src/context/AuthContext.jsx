import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios response interceptor for 401
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    setRole(null);
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

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/login', 
        { email: email.toLowerCase(), password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const responseData = response.data;
      const accessToken = responseData.accessToken;

      if (!accessToken) throw new Error('Authentication failed - no token received');

      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      if (responseData.user?.role) {
        const userRole = responseData.user.role.toUpperCase();
        localStorage.setItem('userRole', userRole);
        setRole(userRole);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setUser(responseData.user);
      }

      if (responseData.refreshToken) {
        localStorage.setItem('refreshToken', responseData.refreshToken);
      }

      await fetchUserProfile();
      return accessToken;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await axiosInstance.post('/auth/refresh', { refreshToken });
      const newAccessToken = response.data?.accessToken;

      if (newAccessToken) {
        localStorage.setItem('token', newAccessToken);
        setToken(newAccessToken);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

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
export { axiosInstance }; // Optional: reuse in other components
