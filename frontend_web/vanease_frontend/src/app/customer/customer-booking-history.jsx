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
      
      // While backend is being updated, we'll use mock data
      // Comment out the API call for now
      /*
      // Use direct endpoint for all bookings by user ID
      const endpoint = `/api/bookings/user/${userId}`;
      
      // Use fetch API directly to avoid interceptor issues
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Bookings data:', data);
      
      // Process the data to match our component's expected structure
      const processedBookings = data.map(booking => ({
        id: booking.booking_id,
        bookingId: booking.booking_id,
        startDate: booking.start_date,
        endDate: booking.end_date,
        status: booking.status,
        totalPrice: booking.total_price,
        totalDays: booking.total_days,
        pickupLocation: booking.pickup_location,
        dropoffLocation: booking.dropoff_location,
        userId: booking.user_id,
        vehicleId: booking.vehicle_id,
        // We'll need to fetch vehicle details separately
        vehicle: {
          id: booking.vehicle_id,
          // These will be populated later or from mock data
          brand: 'Loading...',
          model: 'Loading...',
          plateNumber: 'Loading...',
          ratePerDay: booking.total_price / booking.total_days
        },
        // Payment info might be missing
        payment: null
      }));
      */
      
      // Use the mock data directly
      const processedBookings = [
        {
          id: 1,
          bookingId: 1,
          startDate: '2025-05-07',
          endDate: '2025-05-08',
          status: 'PENDING',
          totalPrice: 4100.00,
          totalDays: 2,
          pickupLocation: 'buhisan',
          dropoffLocation: 'punta',
          userId: 1,
          vehicleId: 4,
          vehicle: {
            id: 4,
            brand: 'Toyota',
            model: 'HiAce',
            plateNumber: 'ABC-123',
            ratePerDay: 2050.00
          },
          payment: null
        },
        {
          id: 2,
          bookingId: 2,
          startDate: '2025-05-08',
          endDate: '2025-05-08',
          status: 'PENDING',
          totalPrice: 2500.00,
          totalDays: 1,
          pickupLocation: 'Buhisan',
          dropoffLocation: 'Buhisan',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: null
        },
        {
          id: 3,
          bookingId: 3,
          startDate: '2025-05-13',
          endDate: '2025-05-14',
          status: 'PENDING',
          totalPrice: 5000.00,
          totalDays: 2,
          pickupLocation: 'a',
          dropoffLocation: 'a',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: null
        },
        {
          id: 4,
          bookingId: 4,
          startDate: '2025-05-17',
          endDate: '2025-05-18',
          status: 'PENDING',
          totalPrice: 5000.00,
          totalDays: 2,
          pickupLocation: 'k',
          dropoffLocation: 'k',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: null
        },
        {
          id: 5,
          bookingId: 5,
          startDate: '2025-05-08',
          endDate: '2025-05-09',
          status: 'PENDING',
          totalPrice: 4200.00,
          totalDays: 2,
          pickupLocation: 'a',
          dropoffLocation: 'a',
          userId: 1,
          vehicleId: 9,
          vehicle: {
            id: 9,
            brand: 'Ford',
            model: 'Transit',
            plateNumber: 'DEF-456',
            ratePerDay: 2100.00
          },
          payment: null
        },
        // Add a completed booking with payment for the past tab
        {
          id: 6,
          bookingId: 6,
          startDate: '2025-04-10',
          endDate: '2025-04-12',
          status: 'COMPLETED',
          totalPrice: 5000.00,
          totalDays: 2,
          pickupLocation: 'Davao City',
          dropoffLocation: 'Davao City',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: {
            id: 103,
            status: 'COMPLETED',
            amount: 5000.00,
            paymentMethod: 'GCASH',
            paymentDate: '2025-04-08'
          }
        }
      ];
      
      console.log('Using mock bookings:', processedBookings);
      
      // Filter based on active tab
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      
      if (activeTab === 'upcoming') {
        // Filter for upcoming bookings (start date is today or in the future)
        const upcomingBookings = processedBookings.filter(booking => {
          const startDate = new Date(booking.startDate);
          startDate.setHours(0, 0, 0, 0);
          return startDate >= today && booking.status !== 'CANCELLED';
        });
        setBookings(upcomingBookings);
      } else {
        // Filter for past bookings (end date is in the past or status is COMPLETED)
        const pastBookings = processedBookings.filter(booking => {
          const endDate = new Date(booking.endDate);
          endDate.setHours(0, 0, 0, 0);
          return (endDate < today || booking.status === 'COMPLETED') && booking.payment;
        });
        setBookings(pastBookings);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
      
      // Use the actual data from the database as mock data
      const mockBookings = [
        {
          id: 1,
          bookingId: 1,
          startDate: '2025-05-07',
          endDate: '2025-05-08',
          status: 'PENDING',
          totalPrice: 4100.00,
          totalDays: 2,
          pickupLocation: 'buhisan',
          dropoffLocation: 'punta',
          userId: 1,
          vehicleId: 4,
          vehicle: {
            id: 4,
            brand: 'Toyota',
            model: 'HiAce',
            plateNumber: 'ABC-123',
            ratePerDay: 2050.00
          },
          payment: null
        },
        {
          id: 2,
          bookingId: 2,
          startDate: '2025-05-08',
          endDate: '2025-05-08',
          status: 'PENDING',
          totalPrice: 2500.00,
          totalDays: 1,
          pickupLocation: 'Buhisan',
          dropoffLocation: 'Buhisan',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: null
        },
        {
          id: 3,
          bookingId: 3,
          startDate: '2025-05-13',
          endDate: '2025-05-14',
          status: 'PENDING',
          totalPrice: 5000.00,
          totalDays: 2,
          pickupLocation: 'a',
          dropoffLocation: 'a',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: null
        },
        {
          id: 4,
          bookingId: 4,
          startDate: '2025-05-17',
          endDate: '2025-05-18',
          status: 'PENDING',
          totalPrice: 5000.00,
          totalDays: 2,
          pickupLocation: 'k',
          dropoffLocation: 'k',
          userId: 1,
          vehicleId: 5,
          vehicle: {
            id: 5,
            brand: 'Nissan',
            model: 'Urvan',
            plateNumber: 'XYZ-789',
            ratePerDay: 2500.00
          },
          payment: null
        },
        {
          id: 5,
          bookingId: 5,
          startDate: '2025-05-08',
          endDate: '2025-05-09',
          status: 'PENDING',
          totalPrice: 4200.00,
          totalDays: 2,
          pickupLocation: 'a',
          dropoffLocation: 'a',
          userId: 1,
          vehicleId: 9,
          vehicle: {
            id: 9,
            brand: 'Ford',
            model: 'Transit',
            plateNumber: 'DEF-456',
            ratePerDay: 2100.00
          },
          payment: null
        }
      ];
      
      // Filter based on active tab
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      
      if (activeTab === 'upcoming') {
        // Filter for upcoming bookings (start date is today or in the future)
        const upcomingBookings = mockBookings.filter(booking => {
          const startDate = new Date(booking.startDate);
          startDate.setHours(0, 0, 0, 0);
          return startDate >= today && booking.status !== 'CANCELLED';
        });
        setBookings(upcomingBookings);
      } else {
        // Filter for past bookings (end date is in the past or status is COMPLETED)
        const pastBookings = mockBookings.filter(booking => {
          const endDate = new Date(booking.endDate);
          endDate.setHours(0, 0, 0, 0);
          return endDate < today || booking.status === 'COMPLETED';
        });
        setBookings(pastBookings);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/customer/booking-details/${bookingId}`);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        
        // For now, we'll simulate a successful cancellation
        // Comment out the actual API call until backend is ready
        /*
        // Use fetch API directly to avoid interceptor issues
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'CANCELLED' }),
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to cancel booking: ${response.status}`);
        }
        */
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update local state to reflect cancellation
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
          )
        );
        
        toast.success('Booking cancelled successfully');
      } catch (err) {
        console.error('Error cancelling booking:', err);
        toast.error('Failed to cancel booking. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMakePayment = (booking) => {
    // For demo purposes, let's simulate a successful payment
    if (window.confirm(`Proceed to payment for Booking #${booking.id}?`)) {
      // Simulate API delay
      setLoading(true);
      setTimeout(() => {
        // Update the booking with payment info
        const updatedBookings = bookings.map(b => {
          if (b.id === booking.id) {
            return {
              ...b,
              status: 'CONFIRMED',
              payment: {
                id: 100 + booking.id,
                status: 'COMPLETED',
                amount: booking.totalPrice,
                paymentMethod: 'CREDIT_CARD',
                paymentDate: new Date().toISOString().split('T')[0]
              }
            };
          }
          return b;
        });
        
        setBookings(updatedBookings);
        setLoading(false);
        toast.success('Payment successful!');
      }, 1500);
    }
    
    // In a real implementation, we would navigate to the payment page
    // navigate('/customer/payment', { state: { booking } });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      case 'PAID': return 'status-paid';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="booking-history-container">
      <div className="booking-history-header">
        <h1>My Bookings</h1>
        <p>View and manage all your van bookings</p>
      </div>

      <div className="booking-tabs">
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Bookings
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading your bookings...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">📅</div>
          <h3>No {activeTab} bookings found</h3>
          <p>You don't have any {activeTab} bookings at the moment.</p>
          <button 
            className="book-now-btn"
            onClick={() => navigate('/customer/van-list')}
          >
            Book a Van Now
          </button>
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
