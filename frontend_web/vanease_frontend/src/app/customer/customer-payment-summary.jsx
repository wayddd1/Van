// src/app/customer/customer-payment-summary.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './customer-payment-summary.css';

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
      <div className="summary-container">
        <div className="summary-card">
          <div className="summary-body">
            <div className="error-container">
              <div className="error-icon">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h2 className="error-title">No Summary Data Available</h2>
              <p className="error-message">We couldn't find the booking or payment information needed to display this summary.</p>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => navigate('/customer/booking')}
              >
                <i className="bi bi-calendar-plus btn-icon"></i>
                Return to Booking
              </button>
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
    <div className="summary-container">
      <div className="summary-card">
        <div className="summary-header">
          <h2>Booking & Payment Summary</h2>
        </div>
        <div className="summary-body">
          <div className="summary-alert">
            <div className="summary-alert-icon">
              <i className="bi bi-info-circle-fill"></i>
            </div>
            <div className="summary-alert-content">
              <h3 className="summary-alert-title">Review Your Information</h3>
              <p className="summary-alert-text">Please review your booking and payment details before confirming.</p>
            </div>
          </div>

          <div className="details-card">
            <div className="details-header booking">
              <i className="bi bi-calendar-check details-header-icon"></i>
              <h4>Booking Details</h4>
            </div>
            <div className="details-body">
              <div className="details-row">
                <div className="details-label">Booking ID:</div>
                <div className="details-value">{bookingData.bookingId || bookingData.id || 'N/A'}</div>
              </div>
              <div className="details-row">
                <div className="details-label">Customer Name:</div>
                <div className="details-value">{bookingData.customerName || 'N/A'}</div>
              </div>
              <div className="details-row">
                <div className="details-label">Start Date:</div>
                <div className="details-value">{formatDate(bookingData.startDate)}</div>
              </div>
              <div className="details-row">
                <div className="details-label">End Date:</div>
                <div className="details-value">{formatDate(bookingData.endDate)}</div>
              </div>
              <div className="details-row">
                <div className="details-label">Pickup Location:</div>
                <div className="details-value">{bookingData.pickupLocation || 'N/A'}</div>
              </div>
              <div className="details-row">
                <div className="details-label">Dropoff Location:</div>
                <div className="details-value">{bookingData.dropoffLocation || 'N/A'}</div>
              </div>
              <div className="details-row">
                <div className="details-label">Status:</div>
                <div className="details-value">
                  <span className={`status-badge ${(bookingData.status || 'PENDING').toLowerCase()}`}>
                    {bookingData.status || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-card">
            <div className="details-header payment">
              <i className="bi bi-credit-card details-header-icon"></i>
              <h4>Payment Details</h4>
            </div>
            <div className="details-body">
              <div className="details-row">
                <div className="details-label">Payment Method:</div>
                <div className="details-value">{getPaymentMethodDisplay(paymentData.paymentMethod)}</div>
              </div>
              <div className="details-row">
                <div className="details-label">Amount:</div>
                <div className="details-value highlight">{formatCurrency(paymentData.amount)}</div>
              </div>
              {paymentData.transactionId && (
                <div className="details-row">
                  <div className="details-label">Transaction ID:</div>
                  <div className="details-value">{paymentData.transactionId}</div>
                </div>
              )}
              {paymentData.proofUrl && (
                <div className="details-row">
                  <div className="details-label">Payment Proof:</div>
                  <div className="details-value">
                    <a href={paymentData.proofUrl} target="_blank" rel="noopener noreferrer" className="proof-link">
                      <i className="bi bi-eye proof-link-icon"></i> View Proof
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            className="btn btn-primary btn-lg btn-block" 
            onClick={handleConfirm}
          >
            <i className="bi bi-check-circle-fill btn-icon"></i>
            Confirm & Process Payment
          </button>
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/customer/payment/' + (bookingData.bookingId || bookingData.id))}
        >
          <i className="bi bi-arrow-left btn-icon"></i>
          Back to Payment
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
};

export default CustomerPaymentSummary;