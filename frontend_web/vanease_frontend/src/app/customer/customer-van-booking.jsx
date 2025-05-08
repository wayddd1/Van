import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { axiosInstance } from '../../context/AuthContext';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, 
  FaMoneyBillWave, FaCheck, FaInfoCircle, FaClock, FaUsers, 
  FaCommentAlt, FaArrowLeft, FaArrowRight, FaCar
} from 'react-icons/fa';
import "./customer-van-booking.css";

const initialState = {
  vehicleId: "",
  startDate: "",
  endDate: "",
  pickupLocation: "",
  dropoffLocation: "",
  pickupTime: "10:00", // Default pickup time
  dropoffTime: "14:00", // Default dropoff time
  numberOfPassengers: "",
  specialRequests: "",
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
  const [currentStep, setCurrentStep] = useState(1); // For multi-step form
  const [dateAvailability, setDateAvailability] = useState({
    checking: false,
    available: true,
    message: ''
  });

  // Available vehicles
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Check authentication and fetch vehicles on component mount
  useEffect(() => {
    const checkAuthAndFetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token');
        // We don't need to redirect here since we're using ProtectedRoute
        // The ProtectedRoute component will handle the authentication check
        
        // Fetch available vehicles if we have a token
        if (token) {
          await fetchAvailableVehicles(token);
        }
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
      const response = await axiosInstance.get('/api/vehicles/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = response.data;
      console.log('Available vehicles:', data);
      
      // Process vehicle data to ensure image URLs are properly formatted and filter only available vehicles
      const processedVehicles = data
        .filter(vehicle => vehicle.availability === true)
        .map(vehicle => ({
          ...vehicle,
          imageUrl: vehicle.imageUrl ? 
            (vehicle.imageUrl.startsWith('http') || vehicle.imageUrl.startsWith('/') ? 
              vehicle.imageUrl : 
              `http://localhost:8080${vehicle.imageUrl.startsWith('/') ? '' : '/'}${vehicle.imageUrl}`
            ) : 'https://via.placeholder.com/150x100?text=Van+Image'
        }));
      
      setVehicles(processedVehicles);
      
      // If we have a pre-selected vehicle, verify it's still available
      if (preSelectedVehicleId) {
        const vehicle = processedVehicles.find(v => v.id === parseInt(preSelectedVehicleId));
        if (!vehicle) {
          toast.warning('The selected vehicle is no longer available. Please choose another.');
          setForm(prev => ({ ...prev, vehicleId: '' }));
        } else {
          setSelectedVehicle(vehicle);
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.warning('Could not load vehicles from server. Using sample data.');
      
      // Fallback to sample data
      const sampleVehicles = [
        { 
          id: 1, 
          brand: "Toyota", 
          model: "HiAce", 
          imageUrl: "https://via.placeholder.com/150x100?text=Toyota+HiAce", 
          ratePerDay: 2500, 
          description: "Comfortable 10-seater van", 
          status: "AVAILABLE", 
          availability: true, 
          passengerCapacity: 10,
          plateNumber: "ABC-123",
          transmission: "Automatic",
          fuelType: "Diesel",
          year: 2022
        },
        { 
          id: 2, 
          brand: "Ford", 
          model: "Transit", 
          imageUrl: "https://via.placeholder.com/150x100?text=Ford+Transit", 
          ratePerDay: 3000, 
          description: "Spacious 12-seater van with cargo space", 
          status: "AVAILABLE", 
          availability: true, 
          passengerCapacity: 12,
          plateNumber: "DEF-456",
          transmission: "Manual",
          fuelType: "Diesel",
          year: 2023
        },
        { 
          id: 3, 
          brand: "Mercedes", 
          model: "Sprinter", 
          imageUrl: "https://via.placeholder.com/150x100?text=Mercedes", 
          ratePerDay: 3500, 
          description: "Luxury 8-seater van", 
          status: "AVAILABLE", 
          availability: true, 
          passengerCapacity: 8,
          plateNumber: "GHI-789",
          transmission: "Automatic",
          fuelType: "Diesel",
          year: 2024
        }
      ];
      setVehicles(sampleVehicles);
      
      // If we have a pre-selected vehicle, find it in sample data
      if (preSelectedVehicleId) {
        const vehicle = sampleVehicles.find(v => v.id === parseInt(preSelectedVehicleId));
        if (vehicle) {
          setSelectedVehicle(vehicle);
        }
      }
    } finally {
      setLoadingVehicles(false);
    }
  };
  
  // Function to check date availability for a specific vehicle
  const checkDateAvailability = async () => {
    const { vehicleId, startDate, endDate } = form;
    
    if (!vehicleId || !startDate || !endDate) {
      return; // Don't check if we don't have all required fields
    }
    
    setDateAvailability(prev => ({ ...prev, checking: true }));
    
    try {
      const token = localStorage.getItem('token');
      
      // Call the API to check vehicle availability for the selected dates
      const response = await axiosInstance.get(
        `/api/vehicles/${vehicleId}/check-availability?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const available = response.data.available;
      
      setDateAvailability({
        checking: false,
        available,
        message: available 
          ? 'Vehicle is available for these dates!' 
          : 'Vehicle is not available for these dates. Please select different dates.'
      });
      
      if (!available) {
        setErrors(prev => ({
          ...prev,
          dates: 'Vehicle is not available for these dates. Please select different dates.'
        }));
      } else {
        // Clear date errors if dates are available
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.dates;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error checking date availability:', error);
      
      // Fallback to a simple check by comparing with existing bookings
      // This is a client-side fallback in case the API call fails
      const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
      const available = !vehicle || !vehicle.bookings || vehicle.bookings.length === 0;
      
      setDateAvailability({
        checking: false,
        available,
        message: available 
          ? 'Vehicle appears to be available for these dates.' 
          : 'Vehicle may not be available for these dates. Please try different dates.'
      });
    }
  };
  
  // Check date availability when vehicle, start date, or end date changes
  useEffect(() => {
    if (form.vehicleId && form.startDate && form.endDate) {
      checkDateAvailability();
    }
  }, [form.vehicleId, form.startDate, form.endDate]);

  // Calculate days between two dates, inclusive (matching backend logic)
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset time to compare dates only
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Add 1 to include both start and end days
    return diffDays + 1;
  };

  // Calculate total price (matching backend logic)
  const calculateTotalPrice = () => {
    if (!form.vehicleId || !form.startDate || !form.endDate) {
      setCalculatedPrice("");
      return;
    }
    
    const vehicle = vehicles.find(v => v.id === parseInt(form.vehicleId));
    if (!vehicle) {
      setCalculatedPrice("");
      return;
    }
    
    const days = calculateDays(form.startDate, form.endDate);
    if (days <= 0) {
      setCalculatedPrice("");
      return;
    }
    
    const price = vehicle.ratePerDay * days;
    setCalculatedPrice(price.toFixed(2));
    return price;
  };

  // Update price when dates or vehicle changes
  useEffect(() => {
    if (form.vehicleId && form.startDate && form.endDate) {
      calculateTotalPrice();
    }
  }, [form.vehicleId, form.startDate, form.endDate]);

  // Form validation
  const validate = (step = 0) => {
    const newErrors = {};
    
    // Validate all fields if step is 0, otherwise validate fields for the current step
    if (step === 0 || step === 1) {
      if (!form.vehicleId) newErrors.vehicleId = "Please select a vehicle";
      if (!form.startDate) newErrors.startDate = "Please select a start date";
      if (!form.endDate) newErrors.endDate = "Please select an end date";
      
      // Date validation
      if (form.startDate && form.endDate) {
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
          newErrors.startDate = "Start date cannot be in the past";
        }
        
        if (end < start) {
          newErrors.endDate = "End date cannot be before start date";
        }
      }
    }
    
    if (step === 0 || step === 2) {
      if (!form.pickupLocation) newErrors.pickupLocation = "Please enter pickup location";
      if (!form.dropoffLocation) newErrors.dropoffLocation = "Please enter dropoff location";
      if (!form.pickupTime) newErrors.pickupTime = "Please select pickup time";
      if (!form.dropoffTime) newErrors.dropoffTime = "Please select dropoff time";
      
      if (form.numberOfPassengers) {
        const passengers = parseInt(form.numberOfPassengers);
        const vehicle = vehicles.find(v => v.id === parseInt(form.vehicleId));
        
        if (vehicle && passengers > vehicle.passengerCapacity) {
          newErrors.numberOfPassengers = `Maximum capacity for this vehicle is ${vehicle.passengerCapacity} passengers`;
        }
      }
    }
    
    if (step === 0 || step === 3) {
      if (!form.fullName) newErrors.fullName = "Please enter your full name";
      if (!form.email) newErrors.email = "Please enter your email";
      if (!form.phone) newErrors.phone = "Please enter your phone number";
      
      // Email validation
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      
      // Phone validation
      if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }
    
    // Check date availability
    if (!dateAvailability.available && form.vehicleId && form.startDate && form.endDate) {
      newErrors.dates = dateAvailability.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // If vehicle changes, update selected vehicle
    if (name === 'vehicleId' && value) {
      const vehicle = vehicles.find(v => v.id === parseInt(value));
      setSelectedVehicle(vehicle || null);
    }
    
    // Recalculate price when relevant fields change
    if (['vehicleId', 'startDate', 'endDate'].includes(name)) {
      setTimeout(calculateTotalPrice, 0);
    }
  };
  
  // Handle next step in multi-step form
  const handleNextStep = () => {
    const isValid = validate(currentStep);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step in multi-step form
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  // Submit booking to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validate(0);
    if (!isValid) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    // Check if vehicle is available for selected dates
    if (!dateAvailability.available) {
      toast.error(dateAvailability.message);
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Calculate total price
      const totalPrice = calculateTotalPrice();
      
      // Prepare booking data according to BookingRequestDTO structure
      const bookingData = {
        vehicleId: parseInt(form.vehicleId),
        startDate: form.startDate,
        endDate: form.endDate,
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        totalPrice: totalPrice || null
      };
      
      // Add additional fields that will be stored in the booking metadata
      const bookingMetadata = {
        pickupTime: form.pickupTime,
        dropoffTime: form.dropoffTime,
        numberOfPassengers: form.numberOfPassengers ? parseInt(form.numberOfPassengers) : null,
        specialRequests: form.specialRequests,
        customerDetails: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone
        }
      };
      
      // Combine data for the frontend, but only send the required fields to the backend
      const fullBookingData = { ...bookingData, ...bookingMetadata };
      
      console.log('Submitting booking:', bookingData);
      
      // Submit booking to backend
      const response = await axiosInstance.post('/api/bookings/create', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Booking response:', response.data);
      
      // Store complete booking data in localStorage for payment page
      const booking = { ...response.data, ...bookingMetadata };
      localStorage.setItem('currentBooking', JSON.stringify(booking));
      
      // Update state
      setBookingId(booking.id);
      setSuccess(true);
      setLoading(false);
      
      // Show success message
      toast.success('Booking created successfully!');
      
      // Navigate to payment page
      setTimeout(() => {
        navigate(`/customer/payment/${booking.id}`, {
          state: { bookingData: booking }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      
      let errorMessage = 'Failed to create booking. Please try again.';
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  
  // Render vehicle selection step
  const renderVehicleSelection = () => {
    return (
      <div className="booking-step">
        <h2>Select a Vehicle</h2>
        <p>Choose a vehicle for your trip</p>
        
        {loadingVehicles ? (
          <div className="loading-message">Loading available vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="no-vehicles-message">
            <p>No vehicles available for the selected dates.</p>
            <p>Please try different dates or contact support.</p>
          </div>
        ) : (
          <div className="vehicle-selection">
            <div className="vehicle-list">
              <label>Vehicle:</label>
              <select 
                name="vehicleId" 
                value={form.vehicleId} 
                onChange={handleChange}
                className="vehicle-select-dropdown"
              >
                <option value="">-- Select a vehicle --</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.brand} {vehicle.model} - ₱{vehicle.ratePerDay}/day - {vehicle.passengerCapacity} passengers
                  </option>
                ))}
              </select>
              {errors.vehicleId && <div className="form-error">{errors.vehicleId}</div>}
            </div>
            
            {selectedVehicle && (
              <div className="selected-vehicle-info">
                <h3>Selected Vehicle Details</h3>
                <div className="vehicle-info-grid">
                  <div className="info-row">
                    <span className="info-label">Vehicle:</span>
                    <span className="info-value">{selectedVehicle.brand} {selectedVehicle.model}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Plate Number:</span>
                    <span className="info-value">{selectedVehicle.plateNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Capacity:</span>
                    <span className="info-value">{selectedVehicle.passengerCapacity} passengers</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Rate:</span>
                    <span className="info-value">₱{selectedVehicle.ratePerDay}/day</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="date-selection">
          <div className="form-row">
            <div className="form-group">
              <label><FaCalendarAlt /> Start Date</label>
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
              <label><FaCalendarAlt /> End Date</label>
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
          
          {dateAvailability.checking ? (
            <div className="availability-checking">Checking availability...</div>
          ) : form.vehicleId && form.startDate && form.endDate ? (
            <div className={`availability-status ${dateAvailability.available ? 'available' : 'unavailable'}`}>
              <FaInfoCircle /> {dateAvailability.message}
            </div>
          ) : null}
        </div>
        
        {errors.vehicleId && <div className="form-error">{errors.vehicleId}</div>}
        {errors.dates && <div className="form-error">{errors.dates}</div>}
        
        <div className="step-buttons">
          <button 
            type="button" 
            className="next-btn" 
            onClick={handleNextStep}
            disabled={!form.vehicleId || !form.startDate || !form.endDate || !dateAvailability.available}
          >
            Next: Trip Details <FaArrowRight />
          </button>
        </div>
      </div>
    );
  };
  
  // Render trip details step
  const renderTripDetails = () => {
    return (
      <div className="booking-step">
        <h2>Trip Details</h2>
        <p>Provide pickup and dropoff information</p>
        
        {selectedVehicle && (
          <div className="selected-vehicle-summary">
            <h3>Selected Vehicle: {selectedVehicle.brand} {selectedVehicle.model}</h3>
            <p>₱{selectedVehicle.ratePerDay}/day × {calculateDays(form.startDate, form.endDate)} days = ₱{calculatedPrice}</p>
          </div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label><FaMapMarkerAlt /> Pickup Location</label>
            <input 
              name="pickupLocation" 
              value={form.pickupLocation} 
              onChange={handleChange} 
              placeholder="Enter pickup location"
            />
            {errors.pickupLocation && <div className="form-error">{errors.pickupLocation}</div>}
          </div>
          <div className="form-group">
            <label><FaMapMarkerAlt /> Dropoff Location</label>
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
            <label><FaClock /> Pickup Time</label>
            <input 
              type="time" 
              name="pickupTime" 
              value={form.pickupTime} 
              onChange={handleChange}
            />
            {errors.pickupTime && <div className="form-error">{errors.pickupTime}</div>}
          </div>
          <div className="form-group">
            <label><FaClock /> Dropoff Time</label>
            <input 
              type="time" 
              name="dropoffTime" 
              value={form.dropoffTime} 
              onChange={handleChange}
            />
            {errors.dropoffTime && <div className="form-error">{errors.dropoffTime}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label><FaUsers /> Number of Passengers</label>
            <input 
              type="number" 
              name="numberOfPassengers" 
              value={form.numberOfPassengers} 
              onChange={handleChange} 
              placeholder="Enter number of passengers"
              min="1"
              max={selectedVehicle ? selectedVehicle.passengerCapacity : ""}
            />
            {errors.numberOfPassengers && <div className="form-error">{errors.numberOfPassengers}</div>}
          </div>
          <div className="form-group">
            <label><FaCommentAlt /> Special Requests (Optional)</label>
            <textarea 
              name="specialRequests" 
              value={form.specialRequests} 
              onChange={handleChange} 
              placeholder="Any special requests or requirements"
            />
          </div>
        </div>
        
        <div className="step-buttons">
          <button type="button" className="prev-btn" onClick={handlePrevStep}>
            <FaArrowLeft /> Back: Vehicle Selection
          </button>
          <button type="button" className="next-btn" onClick={handleNextStep}>
            Next: Contact Information <FaArrowRight />
          </button>
        </div>
      </div>
    );
  };
  
  // Render contact information step
  const renderContactInfo = () => {
    return (
      <div className="booking-step">
        <h2>Contact Information</h2>
        <p>Provide your contact details</p>
        
        <div className="form-row">
          <div className="form-group">
            <label><FaUser /> Full Name</label>
            <input 
              name="fullName" 
              value={form.fullName} 
              onChange={handleChange} 
              placeholder="Enter your full name"
            />
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input 
              type="email"
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label><FaPhone /> Phone</label>
            <input 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              placeholder="Enter your phone number"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>
        </div>
        
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span className="summary-label">Vehicle:</span>
              <span className="summary-value">{selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : ''}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Dates:</span>
              <span className="summary-value">{form.startDate} to {form.endDate}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Duration:</span>
              <span className="summary-value">{calculateDays(form.startDate, form.endDate)} days</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pickup:</span>
              <span className="summary-value">{form.pickupLocation} at {form.pickupTime}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Dropoff:</span>
              <span className="summary-value">{form.dropoffLocation} at {form.dropoffTime}</span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Total Price:</span>
              <span className="summary-value">₱{calculatedPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="step-buttons">
          <button type="button" className="prev-btn" onClick={handlePrevStep}>
            <FaArrowLeft /> Back: Trip Details
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : "Complete Booking"}
          </button>
        </div>
      </div>
    );
  };
  
  // Render success message
  const renderSuccess = () => {
    return (
      <div className="booking-success">
        <div className="success-icon">✓</div>
        <h2>Booking Successful!</h2>
        <p>Your booking has been created successfully.</p>
        <p>Booking ID: {bookingId}</p>
        <button 
          className="payment-btn"
          onClick={() => navigate(`/customer/payment/${bookingId}`, {
            state: { bookingData: JSON.parse(localStorage.getItem('currentBooking')) }
          })}
        >
          Proceed to Payment
        </button>
      </div>
    );
  };
  
  return (
    <div className="van-booking-main">
      <div className="van-booking-container">
        <h1 className="booking-title">Book a Van</h1>
        
        {success ? (
          renderSuccess()
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="booking-progress">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1. Vehicle</div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2. Trip Details</div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3. Contact</div>
            </div>
            
            {currentStep === 1 && renderVehicleSelection()}
            {currentStep === 2 && renderTripDetails()}
            {currentStep === 3 && renderContactInfo()}
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerVanBooking;
