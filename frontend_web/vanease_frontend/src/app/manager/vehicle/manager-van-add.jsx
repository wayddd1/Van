import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, MenuItem, Grid, Paper, CircularProgress
} from '@mui/material';
import axios from 'axios';

const fuelTypes = ['GASOLINE', 'DIESEL', 'ELECTRIC'];
const transmissions = ['AUTOMATIC', 'MANUAL'];
const statuses = ['AVAILABLE', 'MAINTENANCE', 'UNAVAILABLE'];


const ManagerVanAdd = () => {
  const [form, setForm] = useState({
    plateNumber: '',
    brand: '',
    model: '',
    year: '',
    ratePerDay: '',
    capacity: '',
    fuelType: '',
    transmission: '',
    availability: true,
    status: '',
    description: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Basic form validation
    if (!form.plateNumber || !form.brand || !form.model || !form.year || !form.ratePerDay || !form.capacity || !form.fuelType || !form.transmission || !form.status || !form.description) {
      setMessage('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append text fields
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // Append file if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Send POST request to add a new vehicle
      const response = await axios.post('/api/vehicles', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Vehicle added successfully!');
      setForm({
        plateNumber: '', brand: '', model: '', year: '', ratePerDay: '', capacity: '',
        fuelType: '', transmission: '', availability: true, status: '', description: ''
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setMessage('Failed to add vehicle.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Vehicle
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            {/* Plate Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Plate Number"
                name="plateNumber"
                value={form.plateNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Brand */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Model */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model"
                name="model"
                value={form.model}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Year"
                name="year"
                value={form.year}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>

            {/* Rate Per Day */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rate Per Day"
                name="ratePerDay"
                value={form.ratePerDay}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>

            {/* Capacity */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Capacity"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>

            {/* Fuel Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fuel Type"
                name="fuelType"
                select
                value={form.fuelType}
                onChange={handleChange}
                fullWidth
                required
              >
                {fuelTypes.map((fuel, index) => (
                  <MenuItem key={index} value={fuel}>
                    {fuel}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Transmission */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Transmission"
                name="transmission"
                select
                value={form.transmission}
                onChange={handleChange}
                fullWidth
                required
              >
                {transmissions.map((trans, index) => (
                  <MenuItem key={index} value={trans}>
                    {trans}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                name="status"
                select
                value={form.status}
                onChange={handleChange}
                fullWidth
                required
              >
                {statuses.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <input type="file" onChange={handleFileChange} />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Vehicle'}
          </Button>
        </form>

        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Container>
  );
};

export default ManagerVanAdd;
