import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './customer-payment.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYMENT_METHODS = [
  { value: 'CASH_ON_HAND', label: 'Cash on Hand' },
  { value: 'GCASH', label: 'GCash' },
  { value: 'PAYPAL', label: 'PayPal' },
];

// PayPal configuration
const PAYPAL_CLIENT_ID = 'AY3ovFWX-WmVDEtLX0JJ-l0oP36y8Zm1WlKitZwv0DNYkbPsmFxeDHh99EWV9GYwJ2jd_0tcyChBuv5e';

function CustomerPayment() {
  const { bookingId: paramBookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  
  // Get bookingId from either URL params or state
  const bookingId = paramBookingId || (state?.bookingData?.bookingId);
  
  // Initialize amount from state if available
  const initialAmount = state?.bookingData?.totalPrice || '';
  
  // Form state
  const [amount, setAmount] = useState(initialAmount); // Fixed amount from booking, not editable
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_HAND');
  const [transactionId, setTransactionId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null); // Add missing state for proof preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Debug info
  useEffect(() => {
    console.log('Payment page state:', state);
    console.log('BookingId:', bookingId);
  }, [state, bookingId]);

  // Debug info - remove in production
  useEffect(() => {
    if (bookingId) {
      console.log('Payment page loaded with booking ID:', bookingId);
      console.log('Booking data:', state?.bookingData);
    }
  }, [bookingId, state]);
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.warn('No authentication token found, redirecting to login');
          toast.error('Please log in to continue with payment');
          navigate('/login', { 
            state: { 
              returnTo: `/customer/payment/${bookingId}`,
              bookingData: state?.bookingData 
            } 
          });
          return;
        }
        
        // Verify token is valid by making a simple request
        try {
          const response = await fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
          });
          
          if (!response.ok) {
            // If token is invalid, try to refresh it
            console.warn('Token validation failed, attempting to refresh...');
            const { refreshToken } = await import('../../context/AuthContext');
            await refreshToken();
          }
          
          console.log('Authentication token validated for payment requests');
        } catch (validationError) {
          console.warn('Token validation error, proceeding anyway:', validationError);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Authentication error. Please log in again.');
      }
    };
    
    checkAuth();
  }, [bookingId, navigate, state]);

  // Function to process payment with API or localStorage fallback
  const processPayment = async (paymentData) => {
    try {
      // Get token directly from localStorage for maximum reliability
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Format data to match PaymentRequestDTO exactly as expected by the backend
      const paymentRequestDTO = {
        bookingId: parseInt(paymentData.bookingId), // Must be a number, not a string
        amount: parseFloat(paymentData.amount), // Must be a number, not a string
        paymentMethod: paymentData.paymentMethod, // This is an enum in the backend
        transactionId: paymentData.transactionId || null, // Optional for some payment methods
        proofUrl: paymentData.proofUrl || null // Optional for some payment methods
      };
      
      console.log('Payment request data:', paymentRequestDTO);
      
      // Try using fetch directly instead of axios to avoid any interceptor issues
      let response;
      try {
        // First try with /api/payments/create
        console.log('Attempting payment with /api/payments/create endpoint');
        response = await fetch('http://localhost:8080/api/payments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(paymentRequestDTO),
          credentials: 'include',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Payment create failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Payment processed successfully:', data);
        return data;
      } catch (createError) {
        console.log('First payment endpoint failed, trying alternative endpoint:', createError.message);
        
        // If that fails, try /api/payments
        response = await fetch('http://localhost:8080/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(paymentRequestDTO),
          credentials: 'include',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Payment endpoint failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Payment processed successfully with alternative endpoint:', data);
        return data;
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      
      // If both API endpoints fail, use localStorage fallback for testing/demo purposes
      console.warn('API endpoints failed, using localStorage fallback for demo');
      toast.warning('Could not connect to payment server. Using demo mode.');
      
      // Create a mock payment response
      const mockPayment = {
        id: Date.now(),
        paymentId: Date.now(),
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId || `MOCK-${Date.now()}`,
        proofUrl: paymentData.proofUrl,
        paymentStatus: "PENDING",
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const existingPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
      existingPayments.push(mockPayment);
      localStorage.setItem('mockPayments', JSON.stringify(existingPayments));
      console.log('Payment saved to localStorage:', mockPayment);
      
      // Also update the booking status in localStorage
      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const bookingIndex = bookings.findIndex(b => b.id === parseInt(paymentData.bookingId));
        if (bookingIndex !== -1) {
          bookings[bookingIndex].status = 'PAID';
          localStorage.setItem('bookings', JSON.stringify(bookings));
        }
      } catch (e) {
        console.error('Error updating booking status in localStorage:', e);
      }
      
      return mockPayment;
    }
  };

  // Handle GCash proof upload
  const handleProofUpload = async (file) => {
    // For demo purposes, create a mock URL instead of actually uploading
    const mockProofUrl = 'https://example.com/mock-proof-' + Date.now() + '.jpg';
    console.log('Mock proof URL created:', mockProofUrl);
    return mockProofUrl;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let proofUrl = null;
      
      // Handle GCash proof upload
      if (paymentMethod === 'GCASH' && proofFile) {
        try {
          proofUrl = await handleProofUpload(proofFile);
        } catch (uploadError) {
          console.error('Proof upload error:', uploadError);
          toast.warning('Could not upload proof. Using a placeholder image.');
          proofUrl = 'https://example.com/placeholder-proof.jpg';
        }
      }

      // Generate transaction ID for non-PayPal payments
      const txnId = `TXN-${Date.now()}`;
      
      // Create payment data object according to PaymentRequestDTO
      const paymentData = {
        bookingId: parseInt(bookingId),
        amount: parseFloat(amount),
        paymentMethod: paymentMethod,
        transactionId: paymentMethod === 'PAYPAL' ? transactionId : txnId,
        proofUrl: proofUrl
      };
      
      console.log('Submitting payment data:', paymentData);
      
      // Process the payment
      const paymentResponse = await processPayment(paymentData);
      
      // Reset form
      setTransactionId('');
      setProofFile(null);
      setProofPreview(null);
      setPaymentMethod('CASH_ON_HAND');
      
      // Show success message
      toast.success('Payment submitted successfully!');
      
      // Navigate to summary page
      navigate('/customer/payment-summary', {
        state: {
          bookingData: state?.bookingData || { bookingId: bookingId },
          paymentData: paymentResponse
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'An error occurred during payment');
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Show booking info from state if available
  const bookingInfo = state?.bookingData;
  
  if (!bookingId && !bookingInfo) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-body">
            <div className="alert alert-danger">
              <div className="alert-icon">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <div className="alert-content">
                <h3 className="alert-title">No Booking Found</h3>
                <p className="alert-text">No booking information available. Please start from the booking page.</p>
              </div>
            </div>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => navigate('/customer/booking')}
            >
              <i className="bi bi-calendar-plus btn-icon"></i>
              Go to Booking Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Make a Payment</h2>
          {bookingInfo && (
            <p>
              Booking: {bookingInfo.vehicleName} ({bookingInfo.date} to {bookingInfo.endDate})
            </p>
          )}
        </div>
        <div className="payment-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="amount" className="form-label">Amount (PHP)</label>
                  <div className="input-group">
                    <span className="input-group-text">₱</span>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      value={amount}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="form-text">Amount is fixed based on your booking</div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    {PAYMENT_METHODS.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  <div className="payment-methods">
                    <div 
                      className={`payment-method-option ${paymentMethod === 'CASH_ON_HAND' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('CASH_ON_HAND')}
                    >
                      <i className="bi bi-cash-coin payment-method-icon text-success"></i>
                      <span className="payment-method-label">Cash</span>
                    </div>
                    <div 
                      className={`payment-method-option ${paymentMethod === 'GCASH' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('GCASH')}
                    >
                      <i className="bi bi-phone payment-method-icon text-primary"></i>
                      <span className="payment-method-label">GCash</span>
                    </div>
                    <div 
                      className={`payment-method-option ${paymentMethod === 'PAYPAL' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('PAYPAL')}
                    >
                      <i className="bi bi-credit-card payment-method-icon text-info"></i>
                      <span className="payment-method-label">PayPal</span>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'PAYPAL' && (
                  <div className="payment-method-section">
                    <h3>Pay with PayPal</h3>
                    <div className="paypal-container">
                      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "PHP" }}>
                        <PayPalButtons 
                          style={{ layout: "vertical" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: amount,
                                    currency_code: "PHP"
                                  },
                                  description: `Payment for booking ${bookingId || state?.bookingData?.bookingId}`
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                              console.log('PayPal transaction completed', details);
                              setTransactionId(details.id);
                              // Auto-submit the form after PayPal payment
                              handleSubmit(new Event('submit'));
                            });
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'GCASH' && (
                  <div className="payment-method-section">
                    <h3>GCash Payment</h3>
                    <p>Please send your payment to: <strong>09123456789</strong></p>
                    <div className="file-upload-container">
                      <label htmlFor="proofFile" className="form-label">Upload GCash Payment Proof</label>
                      <input
                        type="file"
                        className="file-upload-input"
                        id="proofFile"
                        accept="image/*"
                        onChange={e => setProofFile(e.target.files[0])}
                        required={paymentMethod === 'GCASH'}
                      />
                      <div className="form-text">Upload a screenshot of your GCash payment receipt.</div>
                    </div>
                    {proofFile && (
                      <div className="file-upload-preview">
                        <img 
                          src={URL.createObjectURL(proofFile)} 
                          alt="Payment proof preview" 
                          className="preview-image" 
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {paymentMethod === 'CASH_ON_HAND' && (
                  <div className="payment-method-section">
                    <div className="alert alert-info">
                      <div className="alert-icon">
                        <i className="bi bi-info-circle-fill"></i>
                      </div>
                      <div className="alert-content">
                        <h3 className="alert-title">Cash Payment</h3>
                        <p className="alert-text">You will pay in cash when your booking is confirmed. Please prepare the exact amount of ₱{amount}.</p>
                      </div>
                    </div>
                    
                    <div className="payment-summary">
                      <h4 className="payment-summary-title">Payment Summary</h4>
                      <div className="payment-summary-item">
                        <span className="payment-summary-label">Booking ID</span>
                        <span className="payment-summary-value">#{bookingId || state?.bookingData?.bookingId}</span>
                      </div>
                      <div className="payment-summary-item">
                        <span className="payment-summary-label">Vehicle</span>
                        <span className="payment-summary-value">{bookingInfo?.vehicleName || 'Selected Vehicle'}</span>
                      </div>
                      <div className="payment-summary-item">
                        <span className="payment-summary-label">Payment Method</span>
                        <span className="payment-summary-value">Cash on Hand</span>
                      </div>
                      <div className="payment-summary-item payment-summary-total">
                        <span className="payment-summary-label">Total Amount</span>
                        <span className="payment-summary-value">₱{amount}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod !== 'PAYPAL' && (
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg btn-block" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill btn-icon"></i>
                        Confirm Payment
                      </>
                    )}
                  </button>
                )}
                
                {error && (
                  <div className="alert alert-danger">
                    <div className="alert-icon">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div className="alert-content">
                      <h3 className="alert-title">Payment Error</h3>
                      <p className="alert-text">{error}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
      
          <div className="navigation-buttons">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/customer/booking')}
            >
              <i className="bi bi-arrow-left btn-icon"></i>
              Back to Booking
            </button>
            
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/customer/dashboard')}
            >
              <i className="bi bi-house btn-icon"></i>
              Dashboard
            </button>
          </div>
      </div>
  );
}

export default CustomerPayment;
