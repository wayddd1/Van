"use client"

import { useState, useEffect } from "react"
import "../styles/book-van.css"

export default function BookVan() {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    vanModel: "",
    paymentMethod: "",
  })
  const [vanModels, setVanModels] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchVanModels = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vehicles")
        if (!response.ok) {
          throw new Error("Failed to fetch van models")
        }
        const data = await response.json()
        setVanModels(data) // Store the entire vehicle data
      } catch (error) {
        console.error("Error fetching van models:", error)
        setErrorMessage("Failed to load van models. Please try again later.")
      }
    }

    fetchVanModels()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "vanModel") {
      const selectedVehicle = vanModels.find((vehicle) => vehicle.model === value)
      setSelectedVehicleId(selectedVehicle ? selectedVehicle.vehicleId : null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!selectedVehicleId) {
      setErrorMessage("Please select a van model.")
      return
    }

    const bookingData = {
      startDate: formData.pickupDate,
      endDate: formData.dropoffDate,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      vehicle: { vehicleId: selectedVehicleId },
      paymentStatus: "PENDING",
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setErrorMessage("You must be logged in to make a booking.")
        return
      }

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        setErrorMessage("Failed to submit booking. Please try again.")
        return
      }

      alert("Booking request submitted successfully!")
      setFormData({
        pickupLocation: "",
        dropoffLocation: "",
        pickupDate: "",
        dropoffDate: "",
        vanModel: "",
        paymentMethod: "",
      })
      setSelectedVehicleId(null)
    } catch (error) {
      console.error("Error submitting booking:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <main>
      <div className="booking-container">
        <h1 className="booking-title">Book Your Van</h1>
        <p className="booking-subtitle">
          Fill out the form below to reserve your van. We'll get back to you promptly to confirm your booking.
        </p>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

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
                      <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        className="booking-form-control"
                        placeholder="Enter pickup location"
                        required
                      />
                    </div>
                    <div className="booking-form-group">
                      <label htmlFor="dropoffLocation" className="booking-form-label">
                        Drop-off Location
                      </label>
                      <input
                        type="text"
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        className="booking-form-control"
                        placeholder="Enter drop-off location"
                        required
                      />
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
                    <label htmlFor="vanModel" className="booking-form-label">
                      Van Model
                    </label>
                    <select
                      id="vanModel"
                      name="vanModel"
                      value={formData.vanModel}
                      onChange={handleChange}
                      className="booking-form-control"
                      required
                    >
                      <option value="">Select van model</option>
                      {vanModels.map((vehicle) => (
                        <option key={vehicle.vehicleId} value={vehicle.model}>
                          {vehicle.model}
                        </option>
                      ))}
                    </select>
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

