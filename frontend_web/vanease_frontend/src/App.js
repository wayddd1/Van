import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './app/login';
import Register from './app/register';
import ManagerRegister from './app/manager-register';
import CustomerDashboard from './app/customer-dashboard';
import ManagerDashboard from './app/manager-dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import Navbar from './components/Navbar';
import ManagerNavbar from './components/ManagerNavbar';


const theme = createTheme({
  palette: {
    primary: { main: '#34572e' },
    secondary: { main: '#e8f0e8' },
  },
});

const AppContent = () => {
  const { role } = useAuth();
  const location = useLocation();
  const isManagerRoute = location.pathname.includes('/manager-');

  return (
    <>
      {!isManagerRoute && <Navbar role={role} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager-register" element={<ManagerRegister />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        
        
        <Route path="/customer-dashboard" element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}