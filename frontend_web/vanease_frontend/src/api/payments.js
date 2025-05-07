const BASE_URL = '/api/payments';

/**
 * Create a new payment
 * @param {Object} data Payment data (bookingId, amount, paymentMethod, transactionId, proofUrl)
 * @returns {Promise} Promise with payment data
 */
export async function createPayment(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create payment');
  }
  return res.json();
}

/**
 * Get all payments for a booking
 * @param {number} bookingId Booking ID
 * @returns {Promise} Promise with array of payments
 */
export async function getPaymentsByBooking(bookingId) {
  const res = await fetch(`${BASE_URL}/booking/${bookingId}`, { 
    credentials: 'include' 
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch payments');
  }
  return res.json();
}

/**
 * Get payments by method
 * @param {string} method Payment method (CASH_ON_HAND, GCASH, PAYPAL)
 * @returns {Promise} Promise with array of payments
 */
export async function getPaymentsByMethod(method) {
  const res = await fetch(`${BASE_URL}/method/${method}`, { 
    credentials: 'include' 
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch payments by method');
  }
  return res.json();
}

/**
 * Get payments by status
 * @param {string} status Payment status (PENDING, SUCCESS, FAILED, CANCELLED)
 * @returns {Promise} Promise with array of payments
 */
export async function getPaymentsByStatus(status) {
  const res = await fetch(`${BASE_URL}/status/${status}`, { 
    credentials: 'include' 
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch payments by status');
  }
  return res.json();
}

/**
 * Update payment status (admin only)
 * @param {number} paymentId Payment ID
 * @param {string} status New status (PENDING, SUCCESS, FAILED, CANCELLED)
 * @returns {Promise} Promise with updated payment
 */
export async function updatePaymentStatus(paymentId, status) {
  const res = await fetch(`${BASE_URL}/${paymentId}/status?status=${status}`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update payment status');
  }
  return res.json();
}
