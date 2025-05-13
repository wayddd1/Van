import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Link,
  InputAdornment
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';


const ManagerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',       
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/auth/register/manager',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.status >= 200 && response.status < 300) {
        navigate('/login');
      } else {
        throw new Error(response.data?.error || 'Registration failed');
      }
    } catch (err) {
      const serverError = err.response?.data;
      let errorMessage = 'Registration failed. Please try again.';

      if (serverError?.error) {
        errorMessage = serverError.error;
      } else if (serverError?.message) {
        errorMessage = serverError.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error('Manager registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(145deg, #f3fbf6 0%, #e5f5eb 100%)',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2334c759\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
  py: 4
}}>
  <Box sx={{
    width: '100%',
    maxWidth: 360,
    p: { xs: 3, sm: 4 },
    borderRadius: 2,
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
    bgcolor: '#fff',
    mx: 'auto',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '5px',
      background: 'linear-gradient(90deg, #34c759, #2fb350, #34c759)',
      backgroundSize: '200% 100%',
      animation: 'gradient 3s ease infinite',
    },
    '@keyframes gradient': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    }
  }}>
    {/* Decorative elements */}
    <Box sx={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {/* Top right decorative circle */}
      <Box sx={{ 
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(52, 199, 89, 0.2))',
      }} />
      
      {/* Bottom left decorative shape */}
      <Box sx={{ 
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.05), rgba(52, 199, 89, 0.15))',
      }} />
    </Box>
    
    {/* Logo/Brand element at top */}
    <Box sx={{ 
      position: 'relative',
      zIndex: 1,
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      mb: 2
    }}>
      {/* Van illustration */}
      <Box sx={{ 
        width: 80,
        height: 80,
        mb: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8.5V16H4.5C4.5 16.663 4.76339 17.2989 5.23223 17.7678C5.70107 18.2366 6.33696 18.5 7 18.5C7.66304 18.5 8.29893 18.2366 8.76777 17.7678C9.23661 17.2989 9.5 16.663 9.5 16H14.5C14.5 16.663 14.7634 17.2989 15.2322 17.7678C15.7011 18.2366 16.337 18.5 17 18.5C17.663 18.5 18.2989 18.2366 18.7678 17.7678C19.2366 17.2989 19.5 16.663 19.5 16H21V12L19 8.5H3Z" stroke="#34c759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 17C7.55228 17 8 16.5523 8 16C8 15.4477 7.55228 15 7 15C6.44772 15 6 15.4477 6 16C6 16.5523 6.44772 17 7 17Z" fill="#34c759"/>
          <path d="M17 17C17.5523 17 18 16.5523 18 16C18 15.4477 17.5523 15 17 15C16.4477 15 16 15.4477 16 16C16 16.5523 16.4477 17 17 17Z" fill="#34c759"/>
          <path d="M3 11.5H19" stroke="#34c759" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M15 8.5V11.5" stroke="#34c759" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </Box>
      
      {/* Brand name */}
      <Typography variant="h6" sx={{ 
        fontWeight: 700, 
        color: '#5a6d61',
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontSize: '1rem'
      }}>
        VanEase
      </Typography>
    </Box>
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ 
        fontWeight: 700, 
        color: '#1f2b23', 
        textAlign: 'center',
        position: 'relative',
        display: 'inline-block',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%',
          height: '3px',
          borderRadius: '2px',
          backgroundColor: '#5a6d61',
          opacity: 0.7
        }
      }}>
        Manager Registration
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#6c757d' }}>
        Create a manager account
      </Typography>
    </Box>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', '& .MuiTextField-root': { mb: 2 } }}
    >
      <TextField
        fullWidth
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        autoComplete="name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ color: '#4361ee' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 13.5c-2.67 0-8 1.34-8 4V20h16v-2.5c0-2.66-5.33-4-8-4Zm0-1.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg>
              </span>
            </InputAdornment>
          )
        }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ color: '#4361ee' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 2v.01L12 13 4 6.01V6h16ZM4 20v-9.99l8 7.99 8-7.99V20H4Z"/></svg>
              </span>
            </InputAdornment>
          )
        }}
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ color: '#4361ee' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.91.76a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.38.27 2.7.76 3.91a1 1 0 0 1-.21 1.11l-2.2 2.2Z"/></svg>
              </span>
            </InputAdornment>
          )
        }}
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        autoComplete="new-password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ color: '#4361ee' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 0 1-2-2h2a2 2 0 0 1 2 2Zm6-2V9a6 6 0 1 0-12 0v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2Z"/></svg>
              </span>
            </InputAdornment>
          )
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          py: 1.2,
          mt: 2,
          mb: 1,
          fontWeight: 600,
          background: 'linear-gradient(90deg, #34c759, #2fb350)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(90deg, #2fb350, #27a045)',
          },
          boxShadow: '0 4px 12px rgba(52, 199, 89, 0.2)',
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '0.95rem',
          letterSpacing: 0.5,
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register as Manager'}
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 3, color: '#060c08' }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: '#4361ee', '&:hover': { color: '#3a56d4' } }}>
          Sign in
        </Link>
      </Typography>
    </Box>
  </Box>
</Box>
  );
};

export default ManagerRegister;
