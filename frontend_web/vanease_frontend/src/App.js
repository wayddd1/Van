import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './app/auth/login';
import Register from './app/auth/register';
import ManagerRegister from './app/auth/manager-register';
import ManagerDashboard from './app/manager/manager-dashboard';
import ManagerVanAdd from './app/manager/manager-van-add';
import ManagerVanList from './app/manager/manager-van-list';
import ManagerVanUpdate from './app/manager/manager-van-update';
import CustomerDashboard from './app/customer/customer-dashboard';
import CustomerVanList from './app/customer/customer-van-list';
import CustomerVanBooking from './app/customer/customer-van-booking';
import CustomerPayment from './app/customer/customer-payment';
import CustomerPaymentSummary from './app/customer/customer-payment-summary';
import CustomerPaymentConfirm from './app/customer/customer-payment-confirm';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import Navbar from './components/Navbar';
import ManagerNavbar from './components/ManagerNavbar';

const AppContent = () => {
  const { role } = useAuth();
  const location = useLocation();
  const isManagerRoute = location.pathname.startsWith('/manager');

  return (
    <>
      {isManagerRoute ? <ManagerNavbar role={role} /> : <Navbar role={role} />}

      <Routes>
        {/* Customer Public Dashboard */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        {/* Customer Van List */}
        <Route path="/customer/van-list" element={<CustomerVanList />} />
        {/* Customer Van Booking */}
        <Route path="/customer/booking" element={<CustomerVanBooking />} />
        {/* Customer Payment Flow */}
        <Route path="/customer/payment/:bookingId?" element={<CustomerPayment />} />
        <Route path="/customer/payment-summary" element={<CustomerPaymentSummary />} />
        <Route path="/customer/payment-confirm" element={<CustomerPaymentConfirm />} />
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager-register" element={<ManagerRegister />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />


        {/* Manager Routes */}
        <Route path="/manager/manager-dashboard" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/van-list" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerVanList /></ProtectedRoute>} />
        <Route path="/manager/van-add" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerVanAdd /></ProtectedRoute>} />
        <Route path="/manager/van-update/:id" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerVanUpdate /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
