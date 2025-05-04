// App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './app/auth/login';
import Register from './app/auth/register';
import ManagerRegister from './app/auth/manager-register';

// Customer Pages
import CustomerDashboard from './app/customer/customer-dashboard';

// Manager Pages
import ManagerDashboard from './app/manager/manager-dashboard';
import ManagerVanAdd from './app/manager/vehicle/manager-van-add'; 
import ManagerVanUpdate from './app/manager/vehicle/manager-van-update'; 
import ManagerVanList from './app/manager/vehicle/manager-van-list';

// Shared Components
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
  const isManagerRoute = location.pathname.startsWith('/manager');

  return (
    <>
      {isManagerRoute ? <ManagerNavbar role={role} /> : <Navbar role={role} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager-register" element={<ManagerRegister />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Manager Routes */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/vans"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerVanList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/vans/add"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerVanAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/vans/:id/update"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerVanUpdate />
            </ProtectedRoute>
          }
        />
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
