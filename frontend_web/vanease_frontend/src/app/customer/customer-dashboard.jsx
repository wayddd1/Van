import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
  Rating
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Footer from '../../components/Footer';
import Banner from '../../components/Banner';

const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/vehicles/available");
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleBook = (vehicle) => {
    if (!isLoggedIn) {
      navigate("/register");
    } else {
      navigate('/customer/booking', {
        state: {
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.brand} ${vehicle.model}`,
          imageUrl: vehicle.imageUrl || `/api/vehicles/${vehicle.id}/image`,
          ratePerDay: vehicle.ratePerDay
        }
      });
    }
  };

  // Hardcoded customer feedback
  const customerFeedback = [
    {
      id: 1,
      name: "Maria S.",
      text: "Booking was so easy and the van was spotless. Highly recommended!",
      rating: 5,
      date: "May 2, 2025"
    },
    {
      id: 2,
      name: "John D.",
      text: "VanEase made our family trip comfortable and stress-free.",
      rating: 4,
      date: "April 15, 2025"
    },
    {
      id: 3,
      name: "Grace L.",
      text: "Fast booking and friendly service. Will book again!",
      rating: 5,
      date: "May 8, 2025"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f3fbf6',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Banner Section */}
      <Banner />
      
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Vehicle List Section */}
        <Paper 
          elevation={2}
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: 3,
            mb: 4
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#1f2b23',
              mb: 3,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '40%',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: '#34c759',
                opacity: 0.7
              }
            }}
          >
            Available Vehicles
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: '#34c759' }} />
            </Box>
          ) : vehicles.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6" color="#5a6d61">
                No vehicles available at the moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {vehicles.map((vehicle) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
                  <Card 
                    elevation={2} 
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(52, 199, 89, 0.15)'
                      },
                      border: '1px solid rgba(52, 199, 89, 0.1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      {vehicle.imageUrl || vehicle.imageSize ? (
                        <CardMedia
                          component="img"
                          height="160"
                          image={vehicle.imageUrl || `/api/vehicles/${vehicle.id}/image`}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            height: 160, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: '#f3fbf6'
                          }}
                        >
                          <DirectionsCarIcon sx={{ fontSize: 60, color: '#34c759', opacity: 0.8 }} />
                        </Box>
                      )}
                      <Chip 
                        label={vehicle.status} 
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: vehicle.status === 'AVAILABLE' ? '#34c759' : '#e5e5e5',
                          color: vehicle.status === 'AVAILABLE' ? '#fff' : '#5a6d61',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1f2b23',
                          mb: 1
                        }}
                      >
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </Typography>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoneyIcon sx={{ color: '#66d19e', fontSize: 20 }} />
                            <Typography variant="body2" color="#1f2b23" fontWeight={500}>
                              ₱{vehicle.ratePerDay}/day
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PeopleIcon sx={{ color: '#66d19e', fontSize: 20 }} />
                            <Typography variant="body2" color="#1f2b23" fontWeight={500}>
                              {vehicle.capacity} persons
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>

                    <CardActions sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleBook(vehicle)}
                        disabled={vehicle.status !== "AVAILABLE"}
                        sx={{
                          bgcolor: '#34c759',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: '#2fb350'
                          },
                          '&.Mui-disabled': {
                            bgcolor: '#e5e5e5',
                            color: '#5a6d61'
                          }
                        }}
                        endIcon={<ArrowForwardIcon />}
                      >
                        {vehicle.status === "AVAILABLE" ? "Book Now" : "Not Available"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Customer Feedback Section */}
        <Paper 
          elevation={2}
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            p: 3,
            mb: 4
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#1f2b23',
              mb: 3,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: '40%',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: '#34c759',
                opacity: 0.7
              }
            }}
          >
            Customer Feedback
          </Typography>

          <Grid container spacing={3}>
            {customerFeedback.map((feedback) => (
              <Grid item xs={12} sm={6} md={4} key={feedback.id}>
                <Card 
                  elevation={1} 
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(52, 199, 89, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#34c759',
                        mr: 2
                      }}
                    >
                      {feedback.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={700}
                        color="#1f2b23"
                      >
                        {feedback.name}
                      </Typography>
                      <Typography variant="caption" color="#5a6d61">
                        {feedback.date}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Rating value={feedback.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography 
                    variant="body2" 
                    color="#1f2b23" 
                    sx={{ 
                      fontStyle: 'italic',
                      flexGrow: 1
                    }}
                  >
                    "{feedback.text}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default CustomerDashboard;
