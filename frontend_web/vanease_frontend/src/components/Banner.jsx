import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Banner = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        background: 'linear-gradient(135deg, #34c759 0%, #2fb350 30%, #2fe88e 100%)',
        borderRadius: { xs: 0, md: '0 0 16px 16px' },
        p: { xs: 3, md: 5 },
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(52, 199, 89, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03))',
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800, 
            mb: 2,
            textShadow: '0 2px 10px rgba(0,0,0,0.15)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            letterSpacing: '0.5px',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#fff',
              opacity: 0.7
            }
          }}
        >
          Welcome to VanEase
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 400, 
            opacity: 0.9,
            maxWidth: '800px',
            mx: 'auto',
            mt: 3,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            lineHeight: 1.6
          }}
        >
          Book your ideal van for any occasion. Browse our fleet and experience comfort and reliability!
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            mt: 4, 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: '#fff', 
            fontWeight: 600,
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)'
            },
            backdropFilter: 'blur(5px)',
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
          onClick={() => document.getElementById('vehicle-list')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explore Vehicles
        </Button>
      </Box>
    </Paper>
  );
};

export default Banner;
