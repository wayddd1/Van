import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CreditCardIcon from "@mui/icons-material/CreditCard";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Paper
      component="footer"
      elevation={3}
      sx={{
        bgcolor: "#fff",
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none',
                color: '#1f2b23',
                fontWeight: 700,
                display: 'inline-block',
                mb: 2
              }}
            >
              Van<span style={{ color: '#34c759' }}>Ease</span>
            </Typography>
            <Typography variant="body2" color="#5a6d61" paragraph>
              Premium van rental service for every journey. Experience comfort, reliability, and exceptional service.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook" size="small" sx={{ color: '#34c759', mr: 1 }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter" size="small" sx={{ color: '#34c759', mr: 1 }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="instagram" size="small" sx={{ color: '#34c759', mr: 1 }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="linkedin" size="small" sx={{ color: '#34c759' }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="#1f2b23" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <List dense disablePadding>
              <ListItem component={Link} to="/" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem component={Link} to="/van-list" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Van Fleet" />
              </ListItem>
              <ListItem component={Link} to="/book-van" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Book a Van" />
              </ListItem>
              <ListItem component={Link} to="/my-bookings" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="My Bookings" />
              </ListItem>
            </List>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="#1f2b23" fontWeight={600} gutterBottom>
              Support
            </Typography>
            <List dense disablePadding>
              <ListItem component="a" href="#" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Help Center" />
              </ListItem>
              <ListItem component="a" href="#" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="FAQs" />
              </ListItem>
              <ListItem component="a" href="#" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Contact Us" />
              </ListItem>
              <ListItem component="a" href="#" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Terms of Service" />
              </ListItem>
              <ListItem component="a" href="#" sx={{ py: 0.5, color: '#5a6d61', textDecoration: 'none', '&:hover': { color: '#34c759' } }}>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
            </List>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="#1f2b23" fontWeight={600} gutterBottom>
              Contact Us
            </Typography>
            <List dense disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: '#66d19e' }} />
                </ListItemIcon>
                <ListItemText primary="123 Rental Street, City, State 12345" primaryTypographyProps={{ variant: 'body2', color: '#5a6d61' }} />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <PhoneIcon fontSize="small" sx={{ color: '#66d19e' }} />
                </ListItemIcon>
                <ListItemText primary="(555) 123-4567" primaryTypographyProps={{ variant: 'body2', color: '#5a6d61' }} />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <EmailIcon fontSize="small" sx={{ color: '#66d19e' }} />
                </ListItemIcon>
                <ListItemText primary="info@vanease.com" primaryTypographyProps={{ variant: 'body2', color: '#5a6d61' }} />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: '#66d19e' }} />
                </ListItemIcon>
                <ListItemText primary="Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm" primaryTypographyProps={{ variant: 'body2', color: '#5a6d61' }} />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(52, 199, 89, 0.1)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="#5a6d61">
            &copy; {currentYear} VanEase. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 4].map((item) => (
              <CreditCardIcon key={item} sx={{ color: '#66d19e', fontSize: 20 }} />
            ))}
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}

