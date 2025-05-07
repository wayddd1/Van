import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./customer-van-booking.css";

const initialState = {
  vehicleId: "",
  startDate: "",
  endDate: "",
  pickupLocation: "",
  dropoffLocation: "",
  fullName: "", 
  email: "", 
  phone: ""
};

const CustomerVanBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  // Extract vehicle details from location state if available
  const preSelectedVehicleId = state.vehicleId || "";
  const preSelectedVehicleName = state.vehicleName || "";
  const preSelectedVehicleImage = state.imageUrl || "";
  const preSelectedRate = state.ratePerDay || "";
  
  // Form state - initialize with pre-selected vehicle if available
  const [form, setForm] = useState({
    ...initialState,
    vehicleId: preSelectedVehicleId
  });
  const [calculatedPrice, setCalculatedPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Available vehicles
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // Check authentication and fetch vehicles on component mount
  useEffect(() => {
    const checkAuthAndFetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to make a booking');
          navigate('/auth/login', { state: { returnTo: '/customer/booking' } });
          return;
        }
        
        // Fetch available vehicles
        fetchAvailableVehicles(token);
      } catch (error) {
        console.error('Error during initialization:', error);
        toast.error('Failed to initialize booking page. Please try again.');
      }
    };
    
    checkAuthAndFetchVehicles();
  }, [navigate]);

  // Function to fetch available vehicles from backend
  const fetchAvailableVehicles = async (token) => {
    setLoadingVehicles(true);
    try {
      console.log('Fetching available vehicles...');
      const response = await fetch('http://localhost:8080/api/vehicles/available', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Error fetching vehicles: ${response.status}`);
      }

      const data = await response.json();
      console.log('Available vehicles:', data);
      
      // Process vehicle data to ensure image URLs are properly formatted
      const processedVehicles = data.map(vehicle => ({
        ...vehicle,
        imageUrl: vehicle.imageUrl ? 
          (vehicle.imageUrl.startsWith('http') || vehicle.imageUrl.startsWith('/') ? 
            vehicle.imageUrl : 
            `http://localhost:8080${vehicle.imageUrl.startsWith('/') ? '' : '/'}${vehicle.imageUrl}`
          ) : 'https://via.placeholder.com/150x100?text=Van+Image'
      }));
      
      setVehicles(processedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.warning('Could not load vehicles from server. Using sample data.');
      
      // Fallback to sample data
      const sampleVehicles = [
        { id: 1, name: "Toyota HiAce", imageUrl: "https://via.placeholder.com/150x100?text=Toyota+HiAce", ratePerDay: 150.00, description: "Comfortable 10-seater van", status: "AVAILABLE" },
        { id: 2, name: "Ford Transit", imageUrl: "https://via.placeholder.com/150x100?text=Ford+Transit", ratePerDay: 175.00, description: "Spacious 12-seater van with cargo space", status: "AVAILABLE" },
        { id: 3, name: "Mercedes Sprinter", imageUrl: "https://via.placeholder.com/150x100?text=Mercedes", ratePerDay: 200.00, description: "Luxury 8-seater van", status: "AVAILABLE" }
      ];
      setVehicles(sampleVehicles);
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Calculate days between two dates, inclusive (matching backend logic)
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    // Create date objects without time component to match backend calculation
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    if (end < start) return 0;
    
    // Calculate days between dates and add 1 to include both start and end dates
    // This matches the backend logic: ChronoUnit.DAYS.between(startDate, endDate) + 1
    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Add 1 to include both start and end dates
  };

  // Calculate total price (matching backend logic)
  const calculateTotalPrice = () => {
    // If we have a pre-selected rate, use that
    const ratePerDay = preSelectedRate || (() => {
      const selectedVehicle = vehicles.find(v => v.id === parseInt(form.vehicleId));
      return selectedVehicle ? selectedVehicle.ratePerDay : null;
    })();
    
    if (!ratePerDay) return "";
    
    const days = calculateDays(form.startDate, form.endDate);
    if (days <= 0) return "";
    
    // Match backend calculation: vehicle.getRatePerDay().multiply(BigDecimal.valueOf(totalDays))
    const totalPrice = parseFloat(ratePerDay) * days;
    return totalPrice.toFixed(2);
  };
  
  // Update price when dates or vehicle changes
  useEffect(() => {
    if (form.vehicleId && form.startDate && form.endDate) {
      const price = calculateTotalPrice();
      setCalculatedPrice(price);
    }
  }, [form.vehicleId, form.startDate, form.endDate]);

  // Form validation
  const validate = () => {
    const errs = {};
    if (!form.vehicleId) errs.vehicleId = "Please select a vehicle";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      errs.endDate = "End date must be after start date";
    }
    if (!form.pickupLocation) errs.pickupLocation = "Pickup location is required";
    if (!form.dropoffLocation) errs.dropoffLocation = "Dropoff location is required";
    if (!form.fullName) errs.fullName = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.phone) errs.phone = "Phone number is required";
    return errs;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Price will be updated by the useEffect hook
  };
  
  // Calculate initial price when component mounts if vehicle is pre-selected
  useEffect(() => {
    if (preSelectedVehicleId && preSelectedRate) {
      setTimeout(() => {
        const price = calculateTotalPrice();
        setCalculatedPrice(price);
      }, 0);
    }
  }, [preSelectedVehicleId, preSelectedRate]);

  // Submit booking to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to book a vehicle');
        navigate('/auth/login', { state: { returnTo: '/customer/booking' } });
        return;
      }
      
      // Calculate the total price
      const totalPrice = calculatedPrice || calculateTotalPrice();
      
      // Prepare booking data
      const bookingData = {
        vehicleId: parseInt(form.vehicleId),
        startDate: form.startDate,
        endDate: form.endDate,
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        totalPrice: parseFloat(totalPrice)
      };
      
      console.log('Submitting booking:', bookingData);
      
      // First try the /api/bookings endpoint
      let response;
      try {
        response = await fetch('http://localhost:8080/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify(bookingData)
        });
        
        // If we get a 403, try the /create endpoint
        if (response.status === 403) {
          console.log('Trying alternative endpoint /api/bookings/create due to 403');
          response = await fetch('http://localhost:8080/api/bookings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(bookingData)
          });
        }
      } catch (error) {
        console.error('Network error during booking submission:', error);
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Handle response
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Booking failed with status ${response.status}:`, errorText);
        
        if (response.status === 500 && errorText.includes('not available')) {
          throw new Error('This vehicle is not available for the selected dates. Please choose different dates.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to make bookings. Please log in with a customer account.');
        } else {
          throw new Error(`Booking failed: ${response.status} ${response.statusText}`);
        }
      }
      
      const responseData = await response.json();
      console.log('Booking created successfully:', responseData);
      
      // Save booking data for the payment page
      localStorage.setItem('currentBooking', JSON.stringify(responseData));
      
      // Reset form and show success
      setSuccess(true);
      setBookingId(responseData.id || responseData.bookingId);
      setForm(initialState);
      setCalculatedPrice("");
      toast.success('Booking created successfully!');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: error.message });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="van-booking-main">
      <div className="van-booking-grid">
        {/* Left panel with info */}
        <div className="booking-info-panel">
          <h2 className="booking-info-title">Booking Information</h2>
          <ul className="booking-features-list">
            <li><span className="feature-icon">🕒</span> <b>Flexible Rental Periods</b><br /><span className="feature-desc">Daily, weekly, and monthly rental options available to suit your schedule.</span></li>
            <li><span className="feature-icon">🛣️</span> <b>Variety of Options</b><br /><span className="feature-desc">Choose from our range of vans to match your specific requirements.</span></li>
            <li><span className="feature-icon">📍</span> <b>Multiple Locations</b><br /><span className="feature-desc">Convenient pickup and drop-off points throughout the city.</span></li>
          </ul>
          <div className="booking-help">
            <b>Need help?</b><br />
            Contact our customer service team for assistance.<br />
            <span className="help-phone">Call us: <b>(123) 456-7890</b></span>
          </div>
        </div>

        {/* Right panel with booking form */}
        <div className="booking-form-panel">
          <h2 className="booking-form-title">Book Your Van</h2>
          <p className="booking-form-desc">Fill out the form below to reserve your van.</p>
          
          {/* Vehicle Selection */}
          <div className="vehicle-selection-container">
            <h3>{preSelectedVehicleId ? "Selected Vehicle" : "Select a Vehicle"}</h3>
            
            {/* Show pre-selected vehicle if available */}
            {preSelectedVehicleId && preSelectedVehicleName && (
              <div className="pre-selected-vehicle">
                <div className="vehicle-card selected">
                  {preSelectedVehicleImage && (
                    <img 
                      src={preSelectedVehicleImage} 
                      alt={preSelectedVehicleName} 
                      className="vehicle-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150x100?text=Van+Image';
                      }}
                    />
                  )}
                  <h4>{preSelectedVehicleName}</h4>
                  <div className="vehicle-rate">₱{preSelectedRate}/day</div>
                </div>
              </div>
            )}
            
            {/* Show vehicle selection if no pre-selected vehicle */}
            {!preSelectedVehicleId && (
              loadingVehicles ? (
                <div className="loading-vehicles">Loading available vehicles...</div>
              ) : vehicles.length === 0 ? (
                <div className="no-vehicles">No vehicles are currently available.</div>
              ) : (
                <div className="vehicles-grid">
                  {vehicles.map(vehicle => (
                    <div 
                      key={vehicle.id} 
                      className={`vehicle-card ${parseInt(form.vehicleId) === vehicle.id ? 'selected' : ''}`}
                      onClick={() => handleChange({ target: { name: 'vehicleId', value: vehicle.id.toString() } })}
                    >
                      <img 
                        src={vehicle.imageUrl} 
                        alt={vehicle.name} 
                        className="vehicle-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x100?text=Van+Image';
                        }}
                      />
                      <h4>{vehicle.name}</h4>
                      <p>{vehicle.description || 'No description available'}</p>
                      <div className="vehicle-rate">₱{vehicle.ratePerDay}/day</div>
                    </div>
                  ))}
                </div>
              )
            )}
            {errors.vehicleId && <div className="form-error">{errors.vehicleId}</div>}
          </div>
          
          {/* Booking Form */}
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Pickup Location</label>
                <input 
                  name="pickupLocation" 
                  value={form.pickupLocation} 
                  onChange={handleChange} 
                  placeholder="Enter pickup location"
                />
                {errors.pickupLocation && <div className="form-error">{errors.pickupLocation}</div>}
              </div>
              <div className="form-group">
                <label>Dropoff Location</label>
                <input 
                  name="dropoffLocation" 
                  value={form.dropoffLocation} 
                  onChange={handleChange} 
                  placeholder="Enter dropoff location"
                />
                {errors.dropoffLocation && <div className="form-error">{errors.dropoffLocation}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={form.startDate} 
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <div className="form-error">{errors.startDate}</div>}
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={form.endDate} 
                  onChange={handleChange}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <div className="form-error">{errors.endDate}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  name="fullName" 
                  value={form.fullName} 
                  onChange={handleChange} 
                  placeholder="Enter your full name"
                />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="Enter your phone number"
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
              <div className="form-group">
                <label>Total Price</label>
                <input 
                  value={calculatedPrice ? `₱${calculatedPrice}` : ''} 
                  readOnly 
                  className="price-display"
                  placeholder="Select vehicle and dates to calculate"
                />
              </div>
            </div>
            
            {errors.submit && <div className="form-error submit-error">{errors.submit}</div>}
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Book Now"}
            </button>
          </form>
          
          {success && bookingId && (
            <div className="booking-success-container">
              <div className="form-success">Booking created successfully!</div>
              <button 
                className="payment-btn"
                onClick={() => navigate(`/customer/payment/${bookingId}`, {
                  state: { bookingData: JSON.parse(localStorage.getItem('currentBooking')) }
                })}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerVanBooking;
