// src/app/manager-vans.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import "../styles/manager-vans.css";

export default function ManagerVans() {
  const { token } = useAuth();
  const [vans, setVans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingVan, setEditingVan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    plateNumber: '',
    brand: '',
    model: '',
    year: '',
    ratePerDay: '',
    capacity: '',
    fuelType: '',
    transmission: '',
    availability: true,
    status: 'AVAILABLE',
    description: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Create an axios instance with the auth token
  const axiosWithAuth = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const fetchVans = async () => {
    try {
      setLoading(true);
      // Use the axios instance with auth token
      const response = await axiosWithAuth.get('/vehicles');
      setVans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vans:', error);
      setError('Failed to load vans. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVans();
  }, []);

  const handleOpen = (van = null) => {
    if (van) {
      // When editing, populate the form with van data
      setEditingVan(van);
      setFormData({
        plateNumber: van.plateNumber || '',
        brand: van.brand || '',
        model: van.model || '',
        year: van.year || '',
        ratePerDay: van.ratePerDay || '',
        capacity: van.capacity || '',
        fuelType: van.fuelType || '',
        transmission: van.transmission || '',
        availability: van.availability !== undefined ? van.availability : true,
        status: van.status || 'AVAILABLE',
        description: van.description || '',
        imageUrl: van.imageUrl || ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
    } else {
      // Reset form for adding new van
      setEditingVan(null);
      setFormData({
        plateNumber: '',
        brand: '',
        model: '',
        year: '',
        ratePerDay: '',
        capacity: '',
        fuelType: '',
        transmission: '',
        availability: true,
        status: 'AVAILABLE',
        description: '',
        imageUrl: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setEditingVan(null);
    setError("");
    setSelectedFile(null);
    setPreviewUrl('');
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      // Convert numeric fields
      const formattedData = {
        ...formData,
        year: parseInt(formData.year, 10),
        capacity: parseInt(formData.capacity, 10),
        ratePerDay: parseFloat(formData.ratePerDay)
      };

      console.log('Submitting van data:', formattedData);
      console.log('Token being used:', token);

      // Create FormData object for multipart/form-data
      const formDataObj = new FormData();
      
      // Add the vehicle data as a JSON string in a part named 'vehicleRequest'
      // This matches the @RequestPart VehicleRequestDTO vehicleRequest parameter in the controller
      formDataObj.append('vehicleRequest', new Blob([JSON.stringify(formattedData)], {
        type: 'application/json'
      }));
      
      // Add the image file if one was selected
      if (selectedFile) {
        formDataObj.append('image', selectedFile);
      }

      // Set the correct headers for multipart/form-data
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do not set Content-Type here, it will be set automatically with the boundary
        }
      };

      if (editingVan) {
        // Update existing van
        console.log(`Updating van with ID: ${editingVan.id}`);
        const response = await axios.put(`http://localhost:8080/api/vehicles/${editingVan.id}`, formDataObj, config);
        console.log('Update response:', response.data);
      } else {
        // Create new van
        console.log('Creating new van');
        const response = await axios.post('http://localhost:8080/api/vehicles', formDataObj, config);
        console.log('Create response:', response.data);
      }
      
      fetchVans();
      handleClose();
    } catch (error) {
      console.error('Error saving van:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        setError(error.response?.data?.message || `Failed to save van: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('Network error: Could not connect to the server');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this van?')) {
      try {
        setLoading(true);
        await axiosWithAuth.delete(`/vehicles/${id}`);
        fetchVans();
      } catch (error) {
        console.error('Error deleting van:', error);
        alert('Failed to delete van. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="manager-vans-container">
      <div className="vans-header">
        <Typography variant="h4" className="vans-title">Manage Vans</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add New Van
        </Button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading && !open ? (
        <div className="loading">Loading vans...</div>
      ) : vans.length === 0 ? (
        <div className="no-vans">No vans available. Add your first van!</div>
      ) : (
        <div className="vans-grid">
          {vans.map((van) => (
            <motion.div key={van.id} className="van-card-container" whileHover={{ scale: 1.02 }}>
              <Card className="van-card">
                <div className="van-image-container">
                  {van.id ? (
                    <img 
                      src={`http://localhost:8080/api/vehicles/${van.id}/image`} 
                      alt={`${van.brand} ${van.model}`} 
                      className="van-image" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="van-image-placeholder">No Image</div>
                  )}
                </div>
                <CardContent className="van-content">
                  <Typography variant="h6" className="van-title">{van.brand} {van.model} ({van.year})</Typography>
                  <div className="van-details">
                    <Typography><strong>Plate:</strong> {van.plateNumber}</Typography>
                    <Typography><strong>Capacity:</strong> {van.capacity} persons</Typography>
                    <Typography><strong>Rate:</strong> ${van.ratePerDay}/day</Typography>
                    <Typography><strong>Transmission:</strong> {van.transmission}</Typography>
                    <Typography><strong>Fuel Type:</strong> {van.fuelType}</Typography>
                    <Typography><strong>Status:</strong> <span className={`status-${van.status?.toLowerCase()}`}>{van.status}</span></Typography>
                    {van.description && (
                      <Typography className="van-description"><strong>Description:</strong> {van.description}</Typography>
                    )}
                  </div>
                  <div className="van-actions">
                    <Button variant="outlined" color="primary" onClick={() => handleOpen(van)} disabled={loading}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(van.id)} disabled={loading}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog for Add/Edit Van */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editingVan ? "Edit Van" : "Add New Van"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <div className="error-message dialog-error">{error}</div>}
            
            <div className="form-grid">
              <TextField 
                label="Plate Number" 
                name="plateNumber" 
                value={formData.plateNumber} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                required
              />
              
              <TextField 
                label="Brand" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                required
              />
              
              <TextField 
                label="Model" 
                name="model" 
                value={formData.model} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                required
              />
              
              <TextField 
                label="Year" 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                required
                type="number"
                inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
              />
              
              <TextField 
                label="Rate Per Day ($)" 
                name="ratePerDay" 
                value={formData.ratePerDay} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                required
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
              />
              
              <TextField 
                label="Capacity" 
                name="capacity" 
                value={formData.capacity} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                required
                type="number"
                inputProps={{ min: 1 }}
              />
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  label="Fuel Type"
                >
                  <MenuItem value="Gasoline">Gasoline</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Transmission</InputLabel>
                <Select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  label="Transmission"
                >
                  <MenuItem value="Automatic">Automatic</MenuItem>
                  <MenuItem value="Manual">Manual</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="AVAILABLE">Available</MenuItem>
                  <MenuItem value="MAINTENANCE">Under Maintenance</MenuItem>
                  <MenuItem value="RESERVED">Reserved</MenuItem>
                  <MenuItem value="RENTED">Rented</MenuItem>
                </Select>
              </FormControl>
              
              <div className="availability-container">
                <FormControl component="fieldset" margin="normal">
                  <label className="availability-label">
                    <input
                      type="checkbox"
                      name="availability"
                      checked={formData.availability}
                      onChange={handleChange}
                    />
                    Available for Booking
                  </label>
                  <FormHelperText>Check if this van is available for booking</FormHelperText>
                </FormControl>
              </div>
              
              <div className="file-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  id="van-image-upload"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="van-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                  >
                    {selectedFile ? 'Change Image' : 'Upload Image'}
                  </Button>
                </label>
                {previewUrl && (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                  </div>
                )}
                <FormHelperText>Upload an image of the van (optional)</FormHelperText>
              </div>
              
              <TextField 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                multiline
                rows={4}
                className="description-field"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingVan ? 'Update Van' : 'Add Van')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
