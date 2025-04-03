"use client"

import { useState } from "react"
import "../styles/book-van.css"

export default function BookVan() {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    vanType: "",
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real application, you would send this data to your backend
    console.log("Booking form submitted:", formData)
    alert("Booking request submitted! We will contact you shortly.")
  }

  return (
    <main>
      <div className="booking-container">
        <h1 className="booking-title">Book Your Van</h1>
        <p className="booking-subtitle">
          Fill out the form below to reserve your van. We'll get back to you promptly to confirm your booking
        </p>

        <div className="booking-card">
          <div className="booking-layout">
            <div className="booking-info">
              <h2 className="booking-info-title">Booking Information</h2>

              <div className="booking-features">
                <div className="booking-feature">
                  <span className="booking-feature-icon">📅</span>
                  <div className="booking-feature-content">
                    <h4>Flexible Rental Periods</h4>
                    <p>Daily, weekly, and monthly rental options available to suit your schedule.</p>
                  </div>
                </div>
                <div className="booking-feature">
                  <span className="booking-feature-icon">👥</span>
                  <div className="booking-feature-content">
                    <h4>Variety of Options</h4>
                    <p>Choose from our range of vans to match your specific requirements.</p>
                  </div>
                </div>
                <div className="booking-feature">
                  <span className="booking-feature-icon">📍</span>
                  <div className="booking-feature-content">
                    <h4>Multiple Locations</h4>
                    <p>Convenient pickup and drop-off points throughout the city.</p>
                  </div>
                </div>
              </div>

              <div className="booking-payment-info">
                <h4 className="booking-payment-title">Payment Options</h4>
                <div className="booking-payment-methods">
                  <div className="booking-payment-method">
                    <span className="booking-payment-icon">💵</span>
                    <div>
                      <h5>Cash On-Site</h5>
                      <p>Pay in cash when you pick up your van</p>
                    </div>
                  </div>
                  <div className="booking-payment-method">
                    <span className="booking-payment-icon">💳</span>
                    <div>
                      <h5>PayPal</h5>
                      <p>Secure online payment via PayPal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-help">
                <h4>Need Help?</h4>
                <p>Our customer service team is available 24/7 to assist you with your booking.</p>
                <p className="booking-help-phone">Call us: (555) 123-4567</p>
              </div>
            </div>

            <div className="booking-form">
              <form onSubmit={handleSubmit}>
                <div className="booking-form-section">
                  <h3 className="booking-form-section-title">Rental Details</h3>

                  <div className="booking-form-grid">
                    <div className="booking-form-group">
                      <label htmlFor="pickupLocation" className="booking-form-label">
                        Pickup Location
                      </label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        className="booking-form-control"
                        required
                      >
                        <option value="">Select location</option>
                        <option value="downtown">Downtown</option>
                        <option value="airport">Airport</option>
                        <option value="north">North Branch</option>
                        <option value="south">South Branch</option>
                      </select>
                    </div>
                    <div className="booking-form-group">
                      <label htmlFor="dropoffLocation" className="booking-form-label">
                        Drop-off Location
                      </label>
                      <select
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        className="booking-form-control"
                        required
                      >
                        <option value="">Select location</option>
                        <option value="downtown">Downtown</option>
                        <option value="airport">Airport</option>
                        <option value="north">North Branch</option>
                        <option value="south">South Branch</option>
                      </select>
                    </div>
                  </div>

                  <div className="booking-form-grid">
                    <div className="booking-form-group">
                      <label htmlFor="pickupDate" className="booking-form-label">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        className="booking-form-control"
                        required
                      />
                    </div>
                    <div className="booking-form-group">
                      <label htmlFor="dropoffDate" className="booking-form-label">
                        Drop-off Date
                      </label>
                      <input
                        type="date"
                        id="dropoffDate"
                        name="dropoffDate"
                        value={formData.dropoffDate}
                        onChange={handleChange}
                        className="booking-form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="booking-form-group">
                    <label htmlFor="vanType" className="booking-form-label">
                      Van Type
                    </label>
                    <select
                      id="vanType"
                      name="vanType"
                      value={formData.vanType}
                      onChange={handleChange}
                      className="booking-form-control"
                      required
                    >
                      <option value="">Select van type</option>
                      <option value="compact">Compact Van</option>
                      <option value="family">Family Van</option>
                      <option value="cargo">Cargo Van</option>
                      <option value="luxury">Luxury Van</option>
                    </select>
                  </div>
                </div>

                <div className="booking-form-section">
                  <h3 className="booking-form-section-title">Personal Information</h3>

                  <div className="booking-form-grid">
                    <div className="booking-form-group">
                      <label htmlFor="name" className="booking-form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="booking-form-control"
                        required
                      />
                    </div>
                    <div className="booking-form-group">
                      <label htmlFor="email" className="booking-form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="booking-form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="booking-form-group">
                    <label htmlFor="phone" className="booking-form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="booking-form-control"
                      required
                    />
                  </div>
                </div>

                <div className="booking-form-section">
                  <h3 className="booking-form-section-title">Payment Method</h3>

                  <div className="booking-form-group">
                    <div className="payment-options">
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={handleChange}
                          required
                        />
                        <span className="payment-option-icon">💵</span>
                        <div className="payment-option-info">
                          <span className="payment-option-title">Cash On-Site</span>
                          <span className="payment-option-description">Pay when you pick up your van</span>
                        </div>
                      </label>

                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === "paypal"}
                          onChange={handleChange}
                          required
                        />
                        <span className="payment-option-icon">💳</span>
                        <div className="payment-option-info">
                          <span className="payment-option-title">PayPal</span>
                          <span className="payment-option-description">Pay securely online</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="booking-form-submit">
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

