import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        Manager Registration
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create a manager account
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
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
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
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
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
            py: 1.5,
            mt: 1,
            fontWeight: 'bold'
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register as Manager'}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            sx={{ fontWeight: 'bold' }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default ManagerRegister;
