import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Auth context to access the token
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

const ManagerVanList = () => {
  const { token } = useAuth(); // Access token from AuthContext
  const [vans, setVans] = useState([]);
  const [filteredVans, setFilteredVans] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    fuelType: '',
    transmission: '',
    keyword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch vans on component mount and re-run when token changes
  useEffect(() => {
    const fetchVans = async () => {
      if (!token) {
        console.error('No token found');
        return;
      }

      setLoading(true); // Start loading

      try {
        const response = await axios.get('/api/vehicles/manager', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token as part of the request headers
          },
        });
        setVans(response.data);
        setFilteredVans(response.data); // Initially show all vans
      } catch (error) {
        console.error('Failed to fetch vans:', error);
        // Handle 403 Forbidden here
        if (error.response && error.response.status === 403) {
          setMessage('Authorization failed: You do not have permission to view these vans.');
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchVans();
  }, [token]);

  // Apply filters
  useEffect(() => {
    let result = vans;

    if (filters.status) {
      result = result.filter(van => van.status === filters.status);
    }

    if (filters.fuelType) {
      result = result.filter(van => van.fuelType === filters.fuelType);
    }

    if (filters.transmission) {
      result = result.filter(van => van.transmission === filters.transmission);
    }

    if (filters.keyword) {
      result = result.filter(van =>
        van.brand.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        van.model.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        van.plateNumber.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    setFilteredVans(result);
  }, [filters, vans]);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      fuelType: '',
      transmission: '',
      keyword: ''
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Vans
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={filters.status} onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Fuel Type</InputLabel>
            <Select name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="GASOLINE">Gasoline</MenuItem>
              <MenuItem value="DIESEL">Diesel</MenuItem>
              <MenuItem value="ELECTRIC">Electric</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Transmission</InputLabel>
            <Select name="transmission" value={filters.transmission} onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="AUTOMATIC">Automatic</MenuItem>
              <MenuItem value="MANUAL">Manual</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Search"
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      {/* Message */}
      {message && <Typography variant="body1" color="error">{message}</Typography>}

      {/* Loading Spinner */}
      {loading && <CircularProgress />}

      {/* Van Cards */}
      <Grid container spacing={3}>
        {filteredVans.map((van) => (
          <Grid item xs={12} sm={6} md={4} key={van.id}>
            <Card>
              {van.imageUrl && (
                <CardMedia
                  component="img"
                  height="160"
                  image={van.imageUrl}
                  alt={`${van.brand} ${van.model}`}
                />
              )}
              <CardContent>
                <Typography variant="h6">{van.brand} {van.model}</Typography>
                <Typography variant="body2">Plate: {van.plateNumber}</Typography>
                <Typography variant="body2">Rate: ${van.ratePerDay}/day</Typography>
                <Typography variant="body2">Capacity: {van.capacity}</Typography>
                <Typography variant="body2">Fuel: {van.fuelType}</Typography>
                <Typography variant="body2">Transmission: {van.transmission}</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: van.status === 'AVAILABLE' ? 'green' : 'red' }}>
                  Status: {van.status}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                  href={`/manager/vans/${van.id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filteredVans.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1">No vans match the filter criteria.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ManagerVanList;
