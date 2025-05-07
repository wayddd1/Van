// src/app/customer/customer-payment-summary.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerPaymentSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('Payment summary state:', state);
  }, [state]);

  // Handle missing data
  if (!state || !state.bookingData || !state.paymentData) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8 mx-auto text-center">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-5">
                <div className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="mb-4">No Summary Data Available</h2>
                <p className="lead mb-4">We couldn't find the booking or payment information needed to display this summary.</p>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => navigate('/customer/booking')}
                >
                  Return to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { bookingData, paymentData } = state;

  const handleConfirm = () => {
    navigate('/customer/payment-confirm', { state: { bookingData, paymentData } });
    toast.info('Proceeding to payment confirmation...');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get payment method display name
  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'CASH_ON_HAND': 'Cash on Hand',
      'GCASH': 'GCash',
      'PAYPAL': 'PayPal'
    };
    return methods[method] || method;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-lg border-0 rounded-3 mb-4">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="mb-0 fw-bold">Booking & Payment Summary</h2>
            </div>
            <div className="card-body p-4">
              <div className="alert alert-info mb-4">
                <div className="d-flex">
                  <div className="me-3">
                    <i className="bi bi-info-circle-fill fs-3"></i>
                  </div>
                  <div>
                    <h5 className="alert-heading">Review Your Information</h5>
                    <p className="mb-0">Please review your booking and payment details before confirming.</p>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card border-0 bg-light">
                    <div className="card-header bg-secondary text-white">
                      <h4 className="mb-0"><i className="bi bi-calendar-check me-2"></i>Booking Details</h4>
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Booking ID:</div>
                        <div className="col-md-8">{bookingData.bookingId || bookingData.id || 'N/A'}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Customer Name:</div>
                        <div className="col-md-8">{bookingData.customerName || 'N/A'}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Start Date:</div>
                        <div className="col-md-8">{formatDate(bookingData.startDate)}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">End Date:</div>
                        <div className="col-md-8">{formatDate(bookingData.endDate)}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Pickup Location:</div>
                        <div className="col-md-8">{bookingData.pickupLocation || 'N/A'}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Dropoff Location:</div>
                        <div className="col-md-8">{bookingData.dropoffLocation || 'N/A'}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Status:</div>
                        <div className="col-md-8">
                          <span className="badge bg-warning text-dark">{bookingData.status || 'PENDING'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card border-0 bg-light">
                    <div className="card-header bg-success text-white">
                      <h4 className="mb-0"><i className="bi bi-credit-card me-2"></i>Payment Details</h4>
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Payment Method:</div>
                        <div className="col-md-8">{getPaymentMethodDisplay(paymentData.paymentMethod)}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4 fw-bold">Amount:</div>
                        <div className="col-md-8 fw-bold text-success">{formatCurrency(paymentData.amount)}</div>
                      </div>
                      {paymentData.transactionId && (
                        <div className="row mb-2">
                          <div className="col-md-4 fw-bold">Transaction ID:</div>
                          <div className="col-md-8">{paymentData.transactionId}</div>
                        </div>
                      )}
                      {paymentData.proofUrl && (
                        <div className="row mb-2">
                          <div className="col-md-4 fw-bold">Payment Proof:</div>
                          <div className="col-md-8">
                            <a href={paymentData.proofUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye me-1"></i> View Proof
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-lg py-3" 
                  onClick={handleConfirm}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Confirm & Process Payment
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => navigate('/customer/payment/' + (bookingData.bookingId || bookingData.id))}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Payment
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
};

export default CustomerPaymentSummary;