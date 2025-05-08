import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './customer-booking-details.css';

const CustomerBookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to view booking details');
      navigate('/login');
      return;
    }

    fetchBookingDetails();
  }, [bookingId, token, navigate]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setBooking(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details. Please try again later.');
      
      // Use mock data for demo purposes
      const mockBooking = {
        id: parseInt(bookingId),
        bookingId: 1000 + parseInt(bookingId),
        startDate: '2025-05-15',
        endDate: '2025-05-18',
        status: 'CONFIRMED',
        totalPrice: 7500,
        pickupLocation: 'Manila Airport',
        dropoffLocation: 'Makati City',
        pickupTime: '10:00 AM',
        dropoffTime: '2:00 PM',
        numberOfPassengers: 8,
        specialRequests: 'Extra luggage space needed',
        createdAt: '2025-04-01T10:30:00',
        payment: {
          id: 1,
          amount: 7500,
          paymentMethod: 'CREDIT_CARD',
          status: 'COMPLETED',
          transactionId: 'TXN123456789',
          paymentDate: '2025-04-02T14:20:00'
        },
        vehicle: {
          id: 1,
          brand: 'Toyota',
          model: 'HiAce',
          plateNumber: 'ABC-123',
          ratePerDay: 2500,
          passengerCapacity: 10,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          year: 2022,
          imageUrl: 'https://example.com/van-image.jpg'
        }
      };
      
      setBooking(mockBooking);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axiosInstance.patch(`/api/bookings/${bookingId}/status?status=CANCELLED`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        toast.success('Booking cancelled successfully');
        fetchBookingDetails();
      } catch (err) {
        console.error('Error cancelling booking:', err);
        toast.error('Failed to cancel booking. Please try again later.');
      }
    }
  };

  const handleMakePayment = () => {
    navigate(`/customer/payment/${bookingId}`, {
      state: { bookingData: booking }
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="booking-details-container">
        <div className="loading-spinner">Loading booking details...</div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="booking-details-container">
        <div className="error-message">{error}</div>
        <button 
          className="back-button"
          onClick={() => navigate('/customer/bookings')}
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      <div className="booking-details-header">
        <button 
          className="back-button"
          onClick={() => navigate('/customer/bookings')}
        >
          ← Back to Bookings
        </button>
        <h1>Booking Details</h1>
        <div className="booking-id-status">
          <div className="booking-id">Booking #{booking.bookingId || booking.id}</div>
          <div className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
            {booking.status}
          </div>
        </div>
      </div>

      <div className="booking-details-content">
        <div className="booking-summary-card">
          <div className="booking-dates">
            <div className="date-range">
              <div className="date-item">
                <div className="date-label">Pickup Date</div>
                <div className="date-value">{formatDate(booking.startDate)}</div>
                <div className="time-value">{booking.pickupTime}</div>
              </div>
              <div className="date-separator">
                <div className="date-line"></div>
                <div className="date-days">{calculateDuration(booking.startDate, booking.endDate)} days</div>
                <div className="date-line"></div>
              </div>
              <div className="date-item">
                <div className="date-label">Return Date</div>
                <div className="date-value">{formatDate(booking.endDate)}</div>
                <div className="time-value">{booking.dropoffTime}</div>
              </div>
            </div>
          </div>

          <div className="booking-locations">
            <div className="location-item">
              <div className="location-icon pickup-icon">📍</div>
              <div className="location-details">
                <div className="location-label">Pickup Location</div>
                <div className="location-value">{booking.pickupLocation}</div>
              </div>
            </div>
            <div className="location-item">
              <div className="location-icon dropoff-icon">🏁</div>
              <div className="location-details">
                <div className="location-label">Dropoff Location</div>
                <div className="location-value">{booking.dropoffLocation}</div>
              </div>
            </div>
          </div>

          <div className="booking-price-summary">
            <div className="price-item">
              <div className="price-label">Daily Rate</div>
              <div className="price-value">₱{booking.vehicle?.ratePerDay}</div>
            </div>
            <div className="price-item">
              <div className="price-label">Duration</div>
              <div className="price-value">{calculateDuration(booking.startDate, booking.endDate)} days</div>
            </div>
            <div className="price-item total">
              <div className="price-label">Total Price</div>
              <div className="price-value">₱{booking.totalPrice}</div>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="vehicle-details-card">
            <h2>Vehicle Details</h2>
            <div className="vehicle-image-container">
              {booking.vehicle?.imageUrl ? (
                <img 
                  src={booking.vehicle.imageUrl} 
                  alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                  className="vehicle-image" 
                />
              ) : (
                <div className="vehicle-image-placeholder">
                  <span>🚐</span>
                </div>
              )}
            </div>
            <div className="vehicle-specs">
              <h3>{booking.vehicle?.brand} {booking.vehicle?.model}</h3>
              <div className="vehicle-spec-item">
                <span className="spec-label">Plate Number:</span>
                <span className="spec-value">{booking.vehicle?.plateNumber}</span>
              </div>
              <div className="vehicle-spec-item">
                <span className="spec-label">Passenger Capacity:</span>
                <span className="spec-value">{booking.vehicle?.passengerCapacity} persons</span>
              </div>
              <div className="vehicle-spec-item">
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">{booking.vehicle?.transmission}</span>
              </div>
              <div className="vehicle-spec-item">
                <span className="spec-label">Fuel Type:</span>
                <span className="spec-value">{booking.vehicle?.fuelType}</span>
              </div>
              <div className="vehicle-spec-item">
                <span className="spec-label">Year:</span>
                <span className="spec-value">{booking.vehicle?.year}</span>
              </div>
            </div>
          </div>

          <div className="booking-info-card">
            <h2>Booking Information</h2>
            <div className="booking-info-item">
              <span className="info-label">Booking Date:</span>
              <span className="info-value">{booking.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</span>
            </div>
            <div className="booking-info-item">
              <span className="info-label">Number of Passengers:</span>
              <span className="info-value">{booking.numberOfPassengers || 'N/A'}</span>
            </div>
            <div className="booking-info-item">
              <span className="info-label">Special Requests:</span>
              <span className="info-value">{booking.specialRequests || 'None'}</span>
            </div>
            
            <h2 className="payment-title">Payment Information</h2>
            {booking.payment ? (
              <div className="payment-info">
                <div className="payment-info-item">
                  <span className="info-label">Payment Status:</span>
                  <span className={`info-value payment-status-${booking.payment.status.toLowerCase()}`}>
                    {booking.payment.status}
                  </span>
                </div>
                <div className="payment-info-item">
                  <span className="info-label">Payment Method:</span>
                  <span className="info-value">{booking.payment.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="payment-info-item">
                  <span className="info-label">Transaction ID:</span>
                  <span className="info-value">{booking.payment.transactionId}</span>
                </div>
                <div className="payment-info-item">
                  <span className="info-label">Payment Date:</span>
                  <span className="info-value">
                    {booking.payment.paymentDate ? formatDateTime(booking.payment.paymentDate) : 'N/A'}
                  </span>
                </div>
                <div className="payment-info-item">
                  <span className="info-label">Amount Paid:</span>
                  <span className="info-value payment-amount">₱{booking.payment.amount}</span>
                </div>
              </div>
            ) : (
              <div className="no-payment-info">
                <p>No payment information available.</p>
                {booking.status === 'PENDING' && (
                  <button 
                    className="make-payment-btn"
                    onClick={handleMakePayment}
                  >
                    Make Payment
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="booking-actions-container">
          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
            <button 
              className="cancel-booking-btn"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </button>
          )}
          
          <button 
            className="contact-support-btn"
            onClick={() => window.location.href = 'tel:+639123456789'}
          >
            Contact Support
          </button>
          
          {booking.status === 'PENDING' && !booking.payment && (
            <button 
              className="proceed-payment-btn"
              onClick={handleMakePayment}
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBookingDetails;
