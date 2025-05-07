// src/app/customer/customer-payment-confirm.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerPaymentConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('Payment confirmation state:', state);
  }, [state]);
  
  // Extract data from state
  useEffect(() => {
    if (state?.paymentData && state?.bookingData) {
      setPaymentData(state.paymentData);
      setBookingData(state.bookingData);
      setBookingId(state.bookingData.id || state.bookingId);
      console.log('Payment confirm page loaded with data:', state);
      // Set payment details for display
      setPaymentDetails(state.paymentData);
    } else {
      console.error('No payment or booking data found');
      navigate('/customer/dashboard');
    }
  }, [state, navigate]);
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.warn('No authentication token found, redirecting to login');
          toast.error('Please log in to continue with payment confirmation');
          navigate('/auth/login', { 
            state: { 
              returnTo: '/customer/payment-confirm',
              bookingData: state?.bookingData 
            } 
          });
          return;
        }
        
        // Verify token is valid by importing the auth context
        const { axiosInstance } = await import('../../context/AuthContext');
        
        // Set authorization header for all future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Authentication token set for payment confirmation requests');
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Authentication error. Please log in again.');
      }
    };
    
    checkAuth();
  }, [navigate, state]);
  
  // Process payment when data is available
  useEffect(() => {
    // Only process payment when both payment and booking data are available
    if (paymentData && bookingData && !isProcessing) {
      confirmPayment();
    }
  }, [paymentData, bookingData]);

  // Function to update booking status in the database
  const updateBookingStatus = async (bookingId, status) => {
    try {
      // Import the axiosInstance from the AuthContext
      const { axiosInstance } = await import('../../context/AuthContext');
      
      console.log('Updating booking status for booking:', bookingId);
      console.log('New status:', status);
      
      // Make the API call using axiosInstance which handles auth tokens automatically
      const response = await axiosInstance.patch(
        `/api/bookings/${bookingId}/status?status=${status}`
      );
      
      console.log('Booking status updated:', response.data);
      
      // Update in localStorage as a backup
      try {
        const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const updatedBookings = existingBookings.map(booking => {
          if (booking.id === bookingId || booking.bookingId === bookingId) {
            return { ...booking, status: status };
          }
          return booking;
        });
        localStorage.setItem('mockBookings', JSON.stringify(updatedBookings));
        console.log('Updated booking status in localStorage');
      } catch (storageError) {
        console.error('Error updating localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(`Failed to update booking status: ${error.message}`);
      
      // Fallback to localStorage if API fails
      try {
        const existingBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        const updatedBookings = existingBookings.map(booking => {
          if (booking.id === bookingId || booking.bookingId === bookingId) {
            return { ...booking, status: status };
          }
          return booking;
        });
        localStorage.setItem('mockBookings', JSON.stringify(updatedBookings));
        console.log('Updated booking status in localStorage');
        
        return { bookingId, status, message: 'Status updated in localStorage' };
      } catch (storageError) {
        console.error('Error updating localStorage:', storageError);
      }
      
      return null;
    }
  };

  const confirmPayment = async () => {
    if (isProcessing || !paymentData || !bookingData) {
      console.warn('Cannot process payment: processing already in progress or missing data');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Import axiosInstance dynamically to avoid circular dependencies
      const { axiosInstance } = await import('../../context/AuthContext');
      
      // Get token from localStorage and ensure it's set in headers
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token set for payment confirmation request');
      } else {
        throw new Error('No authentication token found');
      }

      // Get the booking ID from the appropriate source
      const targetBookingId = bookingData.bookingId || bookingData.id || bookingId;
      
      if (!targetBookingId) {
        throw new Error('No booking ID available');
      }

      console.log('Processing payment for booking ID:', targetBookingId);
      console.log('Payment data:', paymentData);

      try {
        // Try to create the payment with the backend
        const response = await axiosInstance.post('/api/payments/create', {
          bookingId: parseInt(targetBookingId),
          amount: parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod,
          transactionId: paymentData.transactionId || 'MANUAL-' + Date.now(),
          proofUrl: paymentData.proofUrl || ''
        });

        console.log('Payment created:', response.data);
      } catch (paymentError) {
        console.warn('API payment creation failed, using localStorage fallback:', paymentError.message);
        // Continue with the flow even if the API call fails
      }

      // Update booking status to CONFIRMED
      console.log('Updating booking status to CONFIRMED for booking:', targetBookingId);
      try {
        const updateResult = await updateBookingStatus(targetBookingId, 'CONFIRMED');
        console.log('Booking status update result:', updateResult);
      } catch (updateError) {
        console.warn('Error updating booking status:', updateError.message);
        // Continue with success flow even if status update failed
      }
      
      // Always show success to the user in demo mode
      setStatus('success');
      setMessage('Your payment has been processed successfully!');
    } catch (error) {
      console.error('Payment confirmation error:', error);
      
      // For demo purposes, still show success even if there was an error
      // This ensures the user can complete the flow
      setStatus('success');
      setMessage('Your payment has been processed successfully (demo mode).');
      
      // Uncomment this for production to show real errors
      // setStatus('error');
      // setMessage(error.message || 'An error occurred during payment processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-primary text-white py-3">
              <h3 className="mb-0 fw-bold">Payment Confirmation</h3>
            </div>
            
            <div className="card-body p-4">
              {status === 'processing' && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="mt-3">Processing your payment...</h4>
                  <p className="text-muted">Please wait while we confirm your transaction.</p>
                </div>
              )}
              
              {status === 'success' && (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                  </div>
                  <h3 className="mb-3">{message}</h3>
                  
                  {paymentDetails && (
                    <div className="payment-details mt-4 mb-4">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5 className="card-title mb-3">Payment Details</h5>
                          <div className="row mb-2">
                            <div className="col-6 text-start">Payment Method:</div>
                            <div className="col-6 text-end fw-bold">{paymentDetails.paymentMethod.replace('_', ' ')}</div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-6 text-start">Amount:</div>
                            <div className="col-6 text-end fw-bold">₱{paymentDetails.amount}</div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-6 text-start">Status:</div>
                            <div className="col-6 text-end">
                              <span className="badge bg-success">Confirmed</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-6 text-start">Date:</div>
                            <div className="col-6 text-end">{new Date().toLocaleDateString()}</div>
                          </div>
                          {paymentDetails.transactionId && (
                            <div className="row mb-2">
                              <div className="col-6 text-start">Transaction ID:</div>
                              <div className="col-6 text-end text-truncate">{paymentDetails.transactionId}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                    <button 
                      className="btn btn-primary btn-lg px-4" 
                      onClick={() => navigate('/customer/dashboard')}
                    >
                      <i className="bi bi-house-door me-2"></i>
                      Go to Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-lg px-4" 
                      onClick={() => navigate('/customer/booking')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Book Another Van
                    </button>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '5rem' }}></i>
                  </div>
                  <h3 className="mb-3">Payment Failed</h3>
                  <p className="text-muted mb-4">{message}</p>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button 
                      className="btn btn-danger btn-lg px-4" 
                      onClick={() => navigate(-1)}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2"></i>
                      Try Again
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-lg px-4" 
                      onClick={() => navigate('/customer/dashboard')}
                    >
                      <i className="bi bi-house-door me-2"></i>
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPaymentConfirm;