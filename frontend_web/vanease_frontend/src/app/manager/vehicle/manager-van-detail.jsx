import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { Container, Typography } from '@mui/material';

export default function VanDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [van, setVan] = useState(null);

  useEffect(() => {
    const fetchVan = async () => {
      const response = await axios.get(`/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVan(response.data);
    };
    fetchVan();
  }, [id, token]);

  if (!van) return <div>Loading...</div>;

  return (
    <Container>
      <Typography variant="h4">{van.brand} {van.model}</Typography>
      <Typography>Plate Number: {van.plateNumber}</Typography>
      <Typography>Status: {van.status}</Typography>
      <Typography>Fuel Type: {van.fuelType}</Typography>
      <Typography>Daily Rate: ${van.ratePerDay}</Typography>
    </Container>
  );
}