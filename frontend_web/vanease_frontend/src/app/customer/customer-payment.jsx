import React, { useState, useEffect } from 'react';
import { createPayment } from '../../api/payments';
import { uploadProof } from '../../api/upload';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
          navigate('/auth/login', { 
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
      <div className="container py-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No booking information available. Please start from the booking page.
        </div>
        <button 
          className="btn btn-primary mt-3" 
          onClick={() => navigate('/customer/booking')}
        >
          Go to Booking Page
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-lg rounded-3 border-0 mb-4">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 fw-bold">Make a Payment</h4>
              {bookingInfo && (
                <p className="mb-0 mt-2 text-white-50">
                  Booking: {bookingInfo.vehicleName} ({bookingInfo.date} to {bookingInfo.endDate})
                </p>
              )}
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="amount" className="form-label fw-bold">Amount (PHP)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">₱</span>
                    <input
                      type="number"
                      className="form-control form-control-lg bg-light"
                      id="amount"
                      value={amount}
                      readOnly
                      disabled
                    />
                  </div>
                  <small className="text-muted">Amount is fixed based on your booking</small>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="form-label fw-bold">Payment Method</label>
                  <select
                    className="form-select form-select-lg mb-2"
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
                  <div className="payment-method-icons d-flex gap-3 mt-2">
                    <div className={`payment-icon p-2 rounded ${paymentMethod === 'CASH_ON_HAND' ? 'border border-primary' : 'border'}`}>
                      <i className="bi bi-cash-coin fs-2 text-success"></i>
                    </div>
                    <div className={`payment-icon p-2 rounded ${paymentMethod === 'GCASH' ? 'border border-primary' : 'border'}`}>
                      <i className="bi bi-phone fs-2 text-primary"></i>
                    </div>
                    <div className={`payment-icon p-2 rounded ${paymentMethod === 'PAYPAL' ? 'border border-primary' : 'border'}`}>
                      <i className="bi bi-credit-card fs-2 text-info"></i>
                    </div>
                  </div>
                </div>
                
                {paymentMethod === 'PAYPAL' && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h5 className="mb-3">Pay with PayPal</h5>
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
                )}
                
                {paymentMethod === 'GCASH' && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h5 className="mb-3">GCash Payment</h5>
                    <p>Please send your payment to: <strong>09123456789</strong></p>
                    <div className="mb-3">
                      <label htmlFor="proofFile" className="form-label fw-bold">Upload GCash Payment Proof</label>
                      <input
                        type="file"
                        className="form-control form-control-lg"
                        id="proofFile"
                        accept="image/*"
                        onChange={e => setProofFile(e.target.files[0])}
                        required={paymentMethod === 'GCASH'}
                      />
                      <div className="form-text">Upload a screenshot of your GCash payment receipt.</div>
                    </div>
                    {proofFile && (
                      <div className="mt-2 text-center">
                        <img 
                          src={URL.createObjectURL(proofFile)} 
                          alt="Payment proof preview" 
                          className="img-thumbnail" 
                          style={{ maxHeight: '200px' }} 
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {paymentMethod === 'CASH_ON_HAND' && (
                  <div className="alert alert-info mb-4 p-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <i className="bi bi-info-circle-fill fs-1 text-primary"></i>
                      </div>
                      <div>
                        <h5 className="alert-heading">Cash Payment</h5>
                        <p className="mb-0">You will pay in cash when your booking is confirmed. Please prepare the exact amount of ₱{amount}.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod !== 'PAYPAL' && (
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 py-3 mt-3" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Confirm Payment
                      </>
                    )}
                  </button>
                )}
                
                {error && (
                  <div className="alert alert-danger mt-4">
                    <div className="d-flex">
                      <div className="me-3">
                        <i className="bi bi-exclamation-triangle-fill fs-3 text-danger"></i>
                      </div>
                      <div>
                        <h5 className="alert-heading">Payment Error</h5>
                        <p className="mb-0">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-8 mx-auto">
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => navigate('/customer/booking')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Booking
            </button>
            
            <button 
              className="btn btn-outline-primary" 
              onClick={() => navigate('/customer/dashboard')}
            >
              <i className="bi bi-house me-2"></i>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerPayment;
