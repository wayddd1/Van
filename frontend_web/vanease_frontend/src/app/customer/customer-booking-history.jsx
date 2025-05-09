import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './customer-booking-history.css';

const CustomerBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to view your bookings');
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [token, navigate, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      console.log('Fetching bookings for user ID:', userId);
      
      // Determine which endpoint to use based on the active tab
      let endpoint;
      if (activeTab === 'upcoming') {
        endpoint = '/api/bookings/user/upcoming';
      } else if (activeTab === 'past') {
        endpoint = '/api/bookings/user/past';
      } else {
        endpoint = `/api/bookings/user/${userId}`;
      }
      
      const response = await axiosInstance.get(endpoint);
      console.log('Bookings data:', response.data);
      
      // Process the data to match our component's expected structure
      const processedBookings = await Promise.all(response.data.map(async (booking) => {
        // For each booking, we need to fetch the vehicle details
        let vehicleDetails = null;
        try {
          const vehicleResponse = await axiosInstance.get(`/api/vehicles/${booking.vehicle.id}`);
          vehicleDetails = vehicleResponse.data;
        } catch (vehicleErr) {
          console.error('Error fetching vehicle details:', vehicleErr);
          vehicleDetails = {
            brand: 'Unknown',
            model: 'Unknown',
            plateNumber: 'Unknown',
            ratePerDay: 0
          };
        }
        
        // Check if there's a payment associated with this booking
        let paymentDetails = null;
        try {
          const paymentResponse = await axiosInstance.get(`/api/payments/booking/${booking.bookingId}`);
          if (paymentResponse.data && paymentResponse.data.length > 0) {
            paymentDetails = paymentResponse.data[0];
          }
        } catch (paymentErr) {
          console.error('Error fetching payment details:', paymentErr);
        }
        
        return {
          id: booking.bookingId,
          bookingId: booking.bookingId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status,
          totalPrice: booking.totalPrice,
          totalDays: booking.totalDays,
          pickupLocation: booking.pickupLocation,
          dropoffLocation: booking.dropoffLocation,
          userId: booking.user?.id,
          vehicleId: booking.vehicle?.id,
          vehicle: {
            id: booking.vehicle?.id,
            brand: vehicleDetails?.brand || 'Unknown',
            model: vehicleDetails?.model || 'Unknown',
            plateNumber: vehicleDetails?.plateNumber || 'Unknown',
            ratePerDay: vehicleDetails?.ratePerDay || (booking.totalPrice / booking.totalDays)
          },
          payment: paymentDetails ? {
            id: paymentDetails.id,
            amount: paymentDetails.amount,
            paymentMethod: paymentDetails.paymentMethod,
            paymentStatus: paymentDetails.paymentStatus,
            paymentDate: paymentDetails.createdAt
          } : null
        };
      }));
      
      setBookings(processedBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
      toast.error('Could not fetch your booking history. Please try again later.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/customer/booking-details/${bookingId}`);
  };

  const handleMakePayment = async (booking) => {
    try {
      // Navigate to the payment page with booking details
      navigate('/customer/payment', { 
        state: { 
          booking: booking,
          amount: booking.totalPrice,
          bookingId: booking.id
        } 
      });
    } catch (err) {
      console.error('Error navigating to payment:', err);
      toast.error('Failed to proceed to payment. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Call the API to cancel the booking
      await axiosInstance.patch(`/api/bookings/${bookingId}/status?status=CANCELLED`);
      
      // Update the local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
      ));
      
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="customer-booking-history-container">
      <h1 className="page-title">My Bookings</h1>
      
      <div className="booking-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Bookings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Bookings
        </button>
      </div>
      
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={fetchBookings}
          >
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings-message">
          <p>You don't have any {activeTab} bookings.</p>
          {activeTab === 'upcoming' && (
            <button 
              className="book-now-btn"
              onClick={() => navigate('/customer/booking')}
            >
              Book a Van Now
            </button>
          )}
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-header">
                <div className="booking-id">Booking #{booking.bookingId || booking.id}</div>
                <div className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="booking-details">
                <div className="vehicle-info">
                  <h3>Vehicle ID: {booking.vehicleId}</h3>
                  {booking.vehicle?.brand !== 'Loading...' ? (
                    <>
                      <p className="plate-number">Plate: {booking.vehicle?.plateNumber}</p>
                      <p className="vehicle-model">{booking.vehicle?.brand} {booking.vehicle?.model}</p>
                    </>
                  ) : (
                    <p className="vehicle-model">Loading vehicle details...</p>
                  )}
                  <p className="rate">₱{(booking.totalPrice / booking.totalDays).toFixed(2)}/day</p>
                </div>
                
                <div className="booking-info">
                  <div className="info-row">
                    <span className="info-label">Dates:</span>
                    <span className="info-value">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Duration:</span>
                    <span className="info-value">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Pickup:</span>
                    <span className="info-value">{booking.pickupLocation}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Dropoff:</span>
                    <span className="info-value">{booking.dropoffLocation}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total:</span>
                    <span className="info-value price">₱{booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-actions">
                <button 
                  className="action-btn details-btn"
                  onClick={() => handleViewDetails(booking.id)}
                >
                  View Details
                </button>
                
                {activeTab === 'upcoming' && booking.status === 'PENDING' && (
                  <button 
                    className="action-btn payment-btn"
                    onClick={() => handleMakePayment(booking)}
                  >
                    Make Payment
                  </button>
                )}
                
                {activeTab === 'upcoming' && ['PENDING', 'CONFIRMED'].includes(booking.status) && (
                  <button 
                    className="action-btn cancel-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
                
                {activeTab === 'past' && booking.payment && (
                  <div className="payment-info">
                    <span className="payment-label">Payment:</span>
                    <span className="payment-value">
                      {booking.payment.paymentMethod} - {formatDate(booking.payment.paymentDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookingHistory;
