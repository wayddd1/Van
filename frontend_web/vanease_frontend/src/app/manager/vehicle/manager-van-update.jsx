import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';

export default function UpdateVan() {
  const { id } = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchVan = async () => {
      const response = await axios.get(`/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data);
    };
    fetchVan();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/vehicles/update/${id}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    // Redirect or show success message
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Edit Van</Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Brand"
          fullWidth
          value={formData.brand || ''}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
        />

        <Button type="submit" variant="contained" color="primary">
          Update Van
        </Button>
      </form>
    </Container>
  );
}