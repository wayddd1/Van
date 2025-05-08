import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  const bookingData = location.state?.bookingData;

  const {
    login,
    error: authError,
    isAuthenticated,
    loading: authLoading,
    role
  } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated) {
      // Get role from context or localStorage as fallback
      const userRole = role || localStorage.getItem('userRole');
      console.log('Authentication state changed - User is authenticated with role:', userRole);
      
      // If there's a return path, navigate there instead of the dashboard
      if (returnTo) {
        console.log('Redirecting to return path:', returnTo);
        navigate(returnTo, { state: { bookingData } });
        return;
      }
      
      // Default navigation based on role
      if (userRole === 'CUSTOMER' || userRole === 'ROLE_CUSTOMER') {
        console.log('Redirecting to customer dashboard');
        navigate('/customer/dashboard');
      } else if (userRole === 'MANAGER' || userRole === 'ROLE_MANAGER') {
        console.log('Redirecting to manager dashboard');
        navigate('/manager/manager-dashboard');
      } else {
        console.log('Unknown role:', userRole);
        // Default to customer dashboard if role is unknown
        navigate('/customer/dashboard');
      }
    }
  }, [isAuthenticated, role, navigate, returnTo, bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError(null);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      console.log('Submitting login with data:', formData);
      const result = await login(formData);
      
      // If we get here, login was successful
      console.log('Login successful with result:', result);
      toast.success('Login successful!');
      
      // Force navigation if useEffect doesn't trigger
      setTimeout(() => {
        if (returnTo) {
          console.log('Manually navigating to return path:', returnTo);
          navigate(returnTo, { state: { bookingData } });
          return;
        }
        
        // Get user role from multiple possible sources
        const userRole = result?.user?.role || 
                        localStorage.getItem('userRole') || 
                        'CUSTOMER';
                        
        console.log('Manually navigating based on role:', userRole);
        
        // Handle different role formats (with or without ROLE_ prefix)
        if (userRole === 'CUSTOMER' || userRole === 'ROLE_CUSTOMER') {
          navigate('/customer/dashboard');
        } else if (userRole === 'MANAGER' || userRole === 'ROLE_MANAGER') {
          // Force direct navigation to manager dashboard
          window.location.href = '/manager/manager-dashboard';
        } else {
          // Default fallback
          navigate('/customer/dashboard');
        }
      }, 1000); // Longer delay to ensure state is updated
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.message || 'Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        maxWidth: 400,
        mx: 'auto',
        p: 3
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome Back
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Please enter your login credentials
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          '& .MuiTextField-root': { mb: 2 }
        }}
      >
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          autoFocus
          error={Boolean(authError || localError)}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          error={Boolean(authError || localError)}
        />

        {(authError || localError) && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {authError || localError}
          </Alert>
        )}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={authLoading}
          sx={{
            py: 1.5,
            mt: 1,
            fontWeight: 'bold'
          }}
        >
          {authLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>

        <Box sx={{ textAlign: 'right', mt: 1 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{ fontWeight: 'bold' }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
