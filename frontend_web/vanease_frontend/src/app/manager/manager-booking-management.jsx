import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./manager-booking-management.css";

const ManagerBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();

  // Mock data in case the API is not available
  const mockBookings = [
    { 
      bookingId: 1, 
      user: { id: 1, name: "John Doe", email: "john@example.com" },
      vehicle: { id: 1, make: "Toyota", model: "HiAce", licensePlate: "ABC123" },
      startDate: "2025-05-15", 
      endDate: "2025-05-18", 
      pickupLocation: "Manila Airport", 
      dropoffLocation: "Cebu City Center",
      status: "PENDING",
      totalDays: 4,
      totalPrice: 12000
    },
    { 
      bookingId: 2, 
      user: { id: 2, name: "Jane Smith", email: "jane@example.com" },
      vehicle: { id: 2, make: "Nissan", model: "Urvan", licensePlate: "XYZ789" },
      startDate: "2025-05-20", 
      endDate: "2025-05-25", 
      pickupLocation: "Davao City", 
      dropoffLocation: "Davao City",
      status: "CONFIRMED",
      totalDays: 6,
      totalPrice: 18000
    },
    { 
      bookingId: 3, 
      user: { id: 3, name: "Bob Johnson", email: "bob@example.com" },
      vehicle: { id: 3, make: "Hyundai", model: "Starex", licensePlate: "DEF456" },
      startDate: "2025-05-10", 
      endDate: "2025-05-12", 
      pickupLocation: "Baguio City", 
      dropoffLocation: "Manila",
      status: "COMPLETED",
      totalDays: 3,
      totalPrice: 9000
    },
    { 
      bookingId: 4, 
      user: { id: 4, name: "Alice Brown", email: "alice@example.com" },
      vehicle: { id: 1, make: "Toyota", model: "HiAce", licensePlate: "ABC123" },
      startDate: "2025-05-30", 
      endDate: "2025-06-05", 
      pickupLocation: "Iloilo City", 
      dropoffLocation: "Bacolod City",
      status: "ACTIVE",
      totalDays: 7,
      totalPrice: 21000
    },
    { 
      bookingId: 5, 
      user: { id: 5, name: "Charlie Wilson", email: "charlie@example.com" },
      vehicle: { id: 4, make: "Kia", model: "Carnival", licensePlate: "GHI789" },
      startDate: "2025-05-18", 
      endDate: "2025-05-19", 
      pickupLocation: "Cagayan de Oro", 
      dropoffLocation: "Cagayan de Oro",
      status: "CANCELLED",
      totalDays: 2,
      totalPrice: 6000
    },
  ];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No authentication token found');
        setError("Authentication token is missing. Using sample data for demonstration.");
        setBookings(mockBookings);
        setLoading(false);
        return;
      }

      console.log("Fetching bookings with token");
      
      // First try with fetch API
      try {
        const response = await fetch("http://localhost:8080/api/bookings", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched bookings:", data);
          setBookings(data);
          setError(null);
          setLoading(false);
          return;
        }
        
        if (response.status === 401 || response.status === 403) {
          console.warn("Authentication failed, using mock data");
          setError("Authentication failed. Using sample data for demonstration.");
          setBookings(mockBookings);
          setLoading(false);
          return;
        }
        
        throw new Error(`Server responded with status: ${response.status}`);
      } catch (fetchError) {
        // If fetch fails, try with XMLHttpRequest as a fallback
        console.log("Fetch failed, trying XMLHttpRequest as fallback");
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/api/bookings', true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log("Fetched bookings via XHR:", data);
            setBookings(data);
            setError(null);
          } else {
            console.warn("XHR request failed, using mock data");
            setError("Failed to load bookings. Using sample data for demonstration.");
            setBookings(mockBookings);
          }
          setLoading(false);
        };
        
        xhr.onerror = function() {
          console.error("XHR network error, using mock data");
          setError("Network error. Using sample data for demonstration.");
          setBookings(mockBookings);
          setLoading(false);
        };
        
        xhr.send();
        return; // Return here as XHR is asynchronous
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Using sample data for demonstration.");
      setBookings(mockBookings);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Refresh bookings every 5 minutes
    const interval = setInterval(() => {
      fetchBookings();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropoffLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Authentication token is missing");
        return;
      }

      console.log(`Updating booking #${bookingId} status to ${newStatus}`);
      
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const updatedBooking = await response.json();
          
          // Update the bookings state with the updated booking
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking.bookingId === bookingId ? updatedBooking : booking
            )
          );
          
          toast.success(`Booking #${bookingId} status updated to ${newStatus}`);
          return;
        }
        
        if (response.status === 401 || response.status === 403) {
          toast.error("Authentication failed. Please log in again.");
          return;
        }
        
        throw new Error(`Server responded with status: ${response.status}`);
      } catch (fetchError) {
        console.error("Error updating booking status with fetch:", fetchError);
        
        // Try with XMLHttpRequest as a fallback
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', `http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const updatedBooking = JSON.parse(xhr.responseText);
            
            // Update the bookings state with the updated booking
            setBookings(prevBookings => 
              prevBookings.map(booking => 
                booking.bookingId === bookingId ? updatedBooking : booking
              )
            );
            
            toast.success(`Booking #${bookingId} status updated to ${newStatus}`);
          } else {
            throw new Error(`XHR request failed with status: ${xhr.status}`);
          }
        };
        
        xhr.onerror = function() {
          throw new Error("XHR network error");
        };
        
        xhr.send();
        return; // Return here as XHR is asynchronous
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
      
      // For demo purposes, update the UI anyway
      if (bookings === mockBookings) {
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.bookingId === bookingId ? {...booking, status: newStatus} : booking
          )
        );
        toast.info("Demo mode: Status updated in UI only");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'ACTIVE': return 'status-active';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      case 'REJECTED': return 'status-rejected';
      case 'PAYMENT_FAILED': return 'status-payment-failed';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="manager-booking-management">
      <div className="page-header">
        <h1>Booking Management</h1>
        <p>Manage all van bookings in the system</p>
      </div>
      
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by customer, vehicle, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
            <option value="PAYMENT_FAILED">Payment Failed</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-message">Loading bookings...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="booking-stats">
            <div className="stat-card">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {bookings.filter(booking => booking.status === "PENDING").length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {bookings.filter(booking => booking.status === "ACTIVE").length}
              </div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {bookings.filter(booking => booking.status === "COMPLETED").length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Dates</th>
                  <th>Pickup/Dropoff</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-results">No bookings found matching your criteria</td>
                  </tr>
                ) : (
                  filteredBookings.map(booking => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{booking.user?.name || "N/A"}</div>
                          <div className="customer-email">{booking.user?.email || "N/A"}</div>
                        </div>
                      </td>
                      <td>
                        <div className="vehicle-info">
                          <div className="vehicle-name">{booking.vehicle?.make} {booking.vehicle?.model}</div>
                          <div className="vehicle-plate">{booking.vehicle?.licensePlate || "N/A"}</div>
                        </div>
                      </td>
                      <td>
                        <div className="date-range">
                          <div>{formatDate(booking.startDate)}</div>
                          <div>to</div>
                          <div>{formatDate(booking.endDate)}</div>
                          <div className="total-days">({booking.totalDays} days)</div>
                        </div>
                      </td>
                      <td>
                        <div className="location-info">
                          <div className="pickup">
                            <span className="location-label">Pickup:</span> {booking.pickupLocation}
                          </div>
                          <div className="dropoff">
                            <span className="location-label">Dropoff:</span> {booking.dropoffLocation}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="price-cell">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="actions-cell">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                          className="status-select"
                          disabled={['COMPLETED', 'CANCELLED', 'REJECTED'].includes(booking.status)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="ACTIVE">Active</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                        <button 
                          className="view-details-btn"
                          onClick={() => navigate(`/manager/booking-details/${booking.bookingId}`)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerBookingManagement;