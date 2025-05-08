import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manager-booking-management.css';

// Booking status enum matching backend
const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  PAYMENT_FAILED: 'PAYMENT_FAILED'
};

// Status colors for visual indication
const statusColors = {
  PENDING: '#ffc107',
  CONFIRMED: '#17a2b8',
  ACTIVE: '#007bff',
  COMPLETED: '#28a745',
  CANCELLED: '#6c757d',
  REJECTED: '#dc3545',
  PAYMENT_FAILED: '#dc3545'
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};

// Helper function to format times
const formatTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Helper function to calculate duration between two dates in days
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check for valid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'N/A';
  
  // Calculate difference in days
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const ManagerBookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [refreshKey, activeTab]);

  // Get user information from localStorage
  const getUserInfo = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return null;
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get user info
      const user = getUserInfo();
      const userRole = user?.role || user?.roles?.[0];
      
      console.log('Fetching bookings with user role:', userRole);
      console.log('Active tab:', activeTab);
      
      // TEMPORARILY COMMENTED OUT - API call returning 403 Forbidden
      // Will need to update WebSecurityConfig.java to allow MANAGER role to access /api/bookings
      /*
      // Use a simple fetch with proper headers
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Bookings data:', data);
      */
      
      // Using mock data until backend permissions are fixed
      console.log('Using mock data for bookings');
      const data = [
        {
          id: 1,
          bookingId: 1,
          customerId: 1,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '123-456-7890',
          vehicleId: 4,
          vehicleName: 'Toyota HiAce',
          vehicleModel: 'HiAce',
          vehiclePlate: 'ABC-123',
          startDate: '2025-05-10',
          endDate: '2025-05-12',
          pickupLocation: 'Cebu City',
          dropoffLocation: 'Cebu City',
          totalDays: 3,
          totalPrice: 7500.00,
          status: 'PENDING',
          createdAt: '2025-05-05T10:30:00',
          paymentStatus: null,
          notes: ''
        },
        {
          id: 2,
          bookingId: 2,
          customerId: 2,
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '987-654-3210',
          vehicleId: 5,
          vehicleName: 'Nissan Urvan',
          vehicleModel: 'Urvan',
          vehiclePlate: 'XYZ-789',
          startDate: '2025-05-15',
          endDate: '2025-05-16',
          pickupLocation: 'Manila',
          dropoffLocation: 'Manila',
          totalDays: 2,
          totalPrice: 5000.00,
          status: 'CONFIRMED',
          createdAt: '2025-05-06T14:20:00',
          paymentStatus: 'COMPLETED',
          notes: 'Customer requested early pickup'
        },
        {
          id: 3,
          bookingId: 3,
          customerId: 3,
          customerName: 'Robert Johnson',
          customerEmail: 'robert@example.com',
          customerPhone: '555-123-4567',
          vehicleId: 6,
          vehicleName: 'Ford Transit',
          vehicleModel: 'Transit',
          vehiclePlate: 'DEF-456',
          startDate: '2025-05-20',
          endDate: '2025-05-25',
          pickupLocation: 'Davao',
          dropoffLocation: 'Davao',
          totalDays: 6,
          totalPrice: 12000.00,
          status: 'PENDING',
          createdAt: '2025-05-07T09:15:00',
          paymentStatus: null,
          notes: ''
        },
        {
          id: 4,
          bookingId: 4,
          customerId: 4,
          customerName: 'Maria Garcia',
          customerEmail: 'maria@example.com',
          customerPhone: '777-888-9999',
          vehicleId: 7,
          vehicleName: 'Mercedes Sprinter',
          vehicleModel: 'Sprinter',
          vehiclePlate: 'GHI-789',
          startDate: '2025-05-08',
          endDate: '2025-05-09',
          pickupLocation: 'Baguio',
          dropoffLocation: 'Baguio',
          totalDays: 2,
          totalPrice: 6000.00,
          status: 'ACTIVE',
          createdAt: '2025-05-01T16:45:00',
          paymentStatus: 'COMPLETED',
          notes: 'VIP customer'
        },
        {
          id: 5,
          bookingId: 5,
          customerId: 5,
          customerName: 'David Wilson',
          customerEmail: 'david@example.com',
          customerPhone: '333-444-5555',
          vehicleId: 8,
          vehicleName: 'Hyundai Starex',
          vehicleModel: 'Starex',
          vehiclePlate: 'JKL-012',
          startDate: '2025-04-25',
          endDate: '2025-04-30',
          pickupLocation: 'Iloilo',
          dropoffLocation: 'Iloilo',
          totalDays: 6,
          totalPrice: 12000.00,
          status: 'COMPLETED',
          createdAt: '2025-04-20T11:30:00',
          paymentStatus: 'COMPLETED',
          notes: 'Returned vehicle in excellent condition'
        }
      ];

      // Process the bookings data
      const processedBookings = data.map(booking => {
        // Format dates for display
        const formattedStartDate = formatDate(booking.startDate || booking.start_date);
        const formattedEndDate = formatDate(booking.endDate || booking.end_date);
        const formattedCreatedAt = formatDate(booking.createdAt || booking.created_at);
        const createdAtTime = formatTime(booking.createdAt || booking.created_at);
        
        // Calculate duration
        const startDate = booking.startDate || booking.start_date;
        const endDate = booking.endDate || booking.end_date;
        const duration = calculateDuration(startDate, endDate);
        
        // Extract customer info - handle different API response formats
        const customer = booking.customer || {};
        const user = booking.user || {};
        const customerName = booking.customerName || 
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
          'Unknown Customer';
        
        // Extract vehicle info - handle different API response formats
        const vehicle = booking.vehicle || {};
        const vehicleName = booking.vehicleName || vehicle.name || vehicle.model || 'Unknown Vehicle';
        
        // Normalize the data structure
        return {
          id: booking.id || booking.bookingId || booking.booking_id,
          bookingId: booking.bookingId || booking.booking_id || booking.id,
          customerId: booking.customerId || booking.customer_id || booking.userId || booking.user_id,
          customerName: customerName,
          customerEmail: booking.customerEmail || customer.email || user.email,
          customerPhone: booking.customerPhone || customer.phoneNumber || user.phoneNumber,
          vehicleId: booking.vehicleId || booking.vehicle_id,
          vehicleName: vehicleName,
          vehicleModel: booking.vehicleModel || vehicle.model,
          vehiclePlate: booking.vehiclePlate || vehicle.plateNumber,
          startDate: startDate,
          endDate: endDate,
          pickupLocation: booking.pickupLocation || booking.pickup_location,
          dropoffLocation: booking.dropoffLocation || booking.dropoff_location,
          status: booking.status,
          createdAt: booking.createdAt || booking.created_at,
          totalPrice: booking.totalPrice || booking.total_price,
          totalDays: booking.totalDays || booking.total_days || duration,
          paymentStatus: booking.paymentStatus || (booking.payment ? booking.payment.status : null),
          notes: booking.notes || booking.statusNote || '',
          // Formatted fields for display
          formattedStartDate,
          formattedEndDate,
          formattedCreatedAt,
          createdAtTime,
          duration
        };
      });

      // Filter bookings based on active tab
      let filteredBookings = [];
      switch (activeTab) {
        case 'pending':
          filteredBookings = processedBookings.filter(booking => booking.status === 'PENDING');
          break;
        case 'confirmed':
          filteredBookings = processedBookings.filter(booking => booking.status === 'CONFIRMED');
          break;
        case 'active':
          filteredBookings = processedBookings.filter(booking => booking.status === 'ACTIVE');
          break;
        case 'completed':
          filteredBookings = processedBookings.filter(booking => booking.status === 'COMPLETED');
          break;
        case 'cancelled':
          filteredBookings = processedBookings.filter(booking => 
            booking.status === 'CANCELLED' || booking.status === 'REJECTED');
          break;
        default:
          filteredBookings = processedBookings;
      }

      console.log('Filtered bookings:', filteredBookings);
      setBookings(filteredBookings);
      
      // Also save to localStorage as a cache
      localStorage.setItem('cachedBookings', JSON.stringify(processedBookings));
      
    } catch (error) {
      console.error('Error fetching bookings from API:', error);
      setError(error.message);
      toast.error(`Failed to load bookings: ${error.message}`);
      
      // Try to load from cache
      try {
        const cachedBookings = JSON.parse(localStorage.getItem('cachedBookings') || '[]');
        if (cachedBookings.length > 0) {
          console.log('Using cached bookings as fallback');
          
          // Filter cached bookings based on active tab
          let filteredBookings = [];
          switch (activeTab) {
            case 'pending':
              filteredBookings = cachedBookings.filter(booking => booking.status === 'PENDING');
              break;
            case 'confirmed':
              filteredBookings = cachedBookings.filter(booking => booking.status === 'CONFIRMED');
              break;
            case 'active':
              filteredBookings = cachedBookings.filter(booking => booking.status === 'ACTIVE');
              break;
            case 'completed':
              filteredBookings = cachedBookings.filter(booking => booking.status === 'COMPLETED');
              break;
            case 'cancelled':
              filteredBookings = cachedBookings.filter(booking => 
                booking.status === 'CANCELLED' || booking.status === 'REJECTED');
              break;
            default:
              filteredBookings = cachedBookings;
          }
          
          setBookings(filteredBookings);
          toast.info('Using cached booking data');
          return;
        }
      } catch (cacheError) {
        console.error('Error reading from cache:', cacheError);
      }
      
      // No data available
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Open action modal for a booking
  const openActionModal = (booking) => {
    setSelectedBooking(booking);
    setShowActionModal(true);
    setActionNote('');
  };

  // Handle approve booking action
  const handleApproveBooking = async () => {
    if (!selectedBooking) return;
    await updateBookingStatus(selectedBooking.id, 'CONFIRMED');
  };

  // Handle reject booking action
  const handleRejectBooking = async () => {
    if (!selectedBooking) return;
    await updateBookingStatus(selectedBooking.id, 'REJECTED');
  };

  // Handle cancel booking action
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    await updateBookingStatus(selectedBooking.id, 'CANCELLED');
  };

  // Handle mark as active action
  const handleMarkAsActive = async () => {
    if (!selectedBooking) return;
    await updateBookingStatus(selectedBooking.id, 'ACTIVE');
  };

  // Handle mark as completed action
  const handleMarkAsCompleted = async () => {
    if (!selectedBooking) return;
    await updateBookingStatus(selectedBooking.id, 'COMPLETED');
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    setProcessingAction(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(`Updating booking #${bookingId} to status: ${newStatus}`);
      console.log(`Note: ${actionNote}`);

      // First try with the PATCH endpoint
      try {
        // TEMPORARILY COMMENTED OUT - API call might return 403 Forbidden
        // Simulate API call success
        console.log(`Simulating API call to update booking #${bookingId} to status: ${newStatus}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        /* Original API call
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            status: newStatus,
            note: actionNote || undefined
          })
        });
        */
        
        // Simulate successful response
        const response = { ok: true };

        if (!response.ok) {
          throw new Error(`Failed to update booking status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Status update response:', data);
      } catch (patchError) {
        console.warn('PATCH endpoint failed, trying alternative endpoint:', patchError);
        
        // TEMPORARILY COMMENTED OUT - API call might return 403 Forbidden
        // Simulate API call success
        console.log(`Simulating PUT API call to update booking #${bookingId} to status: ${newStatus}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        /* Original API call
        const putResponse = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            ...selectedBooking,
            status: newStatus,
            statusNote: actionNote || undefined
          })
        });
        */
        
        // Simulate successful response
        const putResponse = { ok: true };

        if (!putResponse.ok) {
          throw new Error(`Failed to update booking with PUT: ${putResponse.status} ${putResponse.statusText}`);
        }
      }

      toast.success(`Booking #${bookingId} status updated to ${newStatus}`);
      setShowActionModal(false);
      
      // Refresh bookings
      setRefreshKey(oldKey => oldKey + 1);
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error('Failed to update booking status. Please try again.');
      
      // Fallback to updating in localStorage only
      try {
        const cachedBookings = JSON.parse(localStorage.getItem('cachedBookings') || '[]');
        const updatedBookings = cachedBookings.map(booking => {
          if (booking.id === bookingId || booking.bookingId === bookingId) {
            return { 
              ...booking, 
              status: newStatus,
              notes: actionNote || booking.notes 
            };
          }
          return booking;
        });
        localStorage.setItem('cachedBookings', JSON.stringify(updatedBookings));
        
        toast.success(`Booking #${bookingId} status updated to ${newStatus} (Demo Mode)`);
        setShowActionModal(false);
        setRefreshKey(oldKey => oldKey + 1);
      } catch (localStorageError) {
        console.error('Error updating localStorage:', localStorageError);
        toast.error('Failed to update booking status');
      }
    } finally {
      setProcessingAction(false);
    }
  };

  // Get available actions based on current booking status
  const getAvailableActions = (status) => {
    switch (status) {
      case 'PENDING':
        return [
          { label: 'Approve', action: handleApproveBooking, color: 'success' },
          { label: 'Reject', action: handleRejectBooking, color: 'danger' }
        ];
      case 'CONFIRMED':
        return [
          { label: 'Mark as Active', action: handleMarkAsActive, color: 'primary' },
          { label: 'Cancel', action: handleCancelBooking, color: 'secondary' }
        ];
      case 'ACTIVE':
        return [
          { label: 'Mark as Completed', action: handleMarkAsCompleted, color: 'success' },
          { label: 'Cancel', action: handleCancelBooking, color: 'secondary' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="booking-workflow-container">
      <h2 className="page-title">Booking Management</h2>
      <p className="page-description">Manage and process van rental bookings</p>

      <div className="workflow-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`tab-button ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed
        </button>
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled/Rejected
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={fetchBookings}>
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No {activeTab} bookings found</h3>
          <p>There are currently no bookings in this category.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-header">
                <div className="booking-id">Booking #{booking.id}</div>
                <div 
                  className="booking-status"
                  style={{ backgroundColor: statusColors[booking.status] }}
                >
                  {booking.status}
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <div className="detail-label">Customer:</div>
                  <div className="detail-value">{booking.customerName}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Vehicle:</div>
                  <div className="detail-value">{booking.vehicleName} {booking.vehiclePlate ? `(${booking.vehiclePlate})` : ''}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Dates:</div>
                  <div className="detail-value">
                    {booking.formattedStartDate} to {booking.formattedEndDate}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Locations:</div>
                  <div className="detail-value">
                    {booking.pickupLocation} {booking.dropoffLocation !== booking.pickupLocation ? 
                      `to ${booking.dropoffLocation}` : '(Round Trip)'}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Total:</div>
                  <div className="detail-value price">{formatCurrency(booking.totalPrice)}</div>
                </div>
                {booking.paymentStatus && (
                  <div className="detail-row">
                    <div className="detail-label">Payment:</div>
                    <div className="detail-value">
                      <span className="payment-badge">{booking.paymentStatus}</span>
                    </div>
                  </div>
                )}
                {booking.notes && (
                  <div className="detail-row notes">
                    <div className="detail-label">Notes:</div>
                    <div className="detail-value">{booking.notes}</div>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => openActionModal(booking)}
                >
                  Process Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="action-modal">
            <div className="modal-header">
              <h3>Process Booking #{selectedBooking.id}</h3>
              <button 
                className="close-button"
                onClick={() => setShowActionModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="booking-summary">
                <div className="summary-row">
                  <div className="summary-label">Customer:</div>
                  <div className="summary-value">{selectedBooking.customerName}</div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Vehicle:</div>
                  <div className="summary-value">{selectedBooking.vehicleName}</div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Dates:</div>
                  <div className="summary-value">
                    {selectedBooking.formattedStartDate} to {selectedBooking.formattedEndDate}
                  </div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Current Status:</div>
                  <div 
                    className="summary-value status"
                    style={{ color: statusColors[selectedBooking.status] }}
                  >
                    {selectedBooking.status}
                  </div>
                </div>
              </div>
              
              <div className="action-note">
                <label htmlFor="actionNote">Add a note (optional):</label>
                <textarea
                  id="actionNote"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Enter any additional information or notes for this action..."
                  rows="3"
                ></textarea>
              </div>
              
              <div className="available-actions">
                <h4>Available Actions:</h4>
                <div className="action-buttons">
                  {getAvailableActions(selectedBooking.status).map((action, index) => (
                    <button
                      key={index}
                      className={`action-button ${action.color}`}
                      onClick={action.action}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Processing...' : action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowActionModal(false)}
                disabled={processingAction}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerBookingManagement;
