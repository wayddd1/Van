"use client"

import { useState, useEffect } from "react"
import "../styles/manager-bookings.css"

export default function ManagerBookings() {
  const [activeTab, setActiveTab] = useState("pending")
  const [bookings, setBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    // Mock bookings data
    const mockBookings = [
      {
        id: "B001",
        userId: "U123",
        userName: "John Smith",
        userEmail: "john@example.com",
        userPhone: "555-123-4567",
        vanId: "V001",
        model: "Transit Connect",
        brand: "Ford",
        year: 2023,
        plateNumber: "ABC-1234",
        rentalRate: 59,
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "Downtown",
        dropoffLocation: "Airport",
        pickupDate: "2023-08-15",
        dropoffDate: "2023-08-20",
        status: "confirmed",
        price: 295,
        paymentStatus: "paid",
        notes: "Customer requested child seat",
        createdAt: "2023-08-01T10:30:00Z",
      },
      {
        id: "B002",
        userId: "U456",
        userName: "Sarah Johnson",
        userEmail: "sarah@example.com",
        userPhone: "555-987-6543",
        vanId: "V002",
        model: "Sprinter",
        brand: "Mercedes-Benz",
        year: 2022,
        plateNumber: "XYZ-5678",
        rentalRate: 89,
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "North Branch",
        dropoffLocation: "South Branch",
        pickupDate: "2023-09-05",
        dropoffDate: "2023-09-07",
        status: "pending",
        price: 178,
        paymentStatus: "pending",
        notes: "",
        createdAt: "2023-08-25T14:15:00Z",
      },
      {
        id: "B003",
        userId: "U789",
        userName: "Michael Brown",
        userEmail: "michael@example.com",
        userPhone: "555-456-7890",
        vanId: "V003",
        model: "Odyssey",
        brand: "Honda",
        year: 2023,
        plateNumber: "DEF-9012",
        rentalRate: 79,
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "Airport",
        dropoffLocation: "Downtown",
        pickupDate: "2023-10-10",
        dropoffDate: "2023-10-15",
        status: "completed",
        price: 395,
        paymentStatus: "paid",
        notes: "Customer returned vehicle in excellent condition",
        createdAt: "2023-09-15T09:00:00Z",
      },
      {
        id: "B004",
        userId: "U101",
        userName: "Emily Davis",
        userEmail: "emily@example.com",
        userPhone: "555-222-3333",
        vanId: "V001",
        model: "Transit Connect",
        brand: "Ford",
        year: 2023,
        plateNumber: "ABC-1234",
        rentalRate: 59,
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "Downtown",
        dropoffLocation: "Downtown",
        pickupDate: "2023-11-20",
        dropoffDate: "2023-11-22",
        status: "pending",
        price: 118,
        paymentStatus: "pending",
        notes: "First-time customer",
        createdAt: "2023-11-10T16:45:00Z",
      },
    ]

    setAllBookings(mockBookings)
    filterBookings("pending", mockBookings)
  }, [])

  const filterBookings = (status, bookingsData = allBookings) => {
    setActiveTab(status)
    if (status === "all") {
      setBookings(bookingsData)
    } else {
      setBookings(bookingsData.filter((booking) => booking.status === status))
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

  const handleStatusChange = (bookingId, newStatus) => {
    // Update booking status
    const updatedBookings = allBookings.map((booking) => {
      if (booking.id === bookingId) {
        return { ...booking, status: newStatus }
      }
      return booking
    })

    setAllBookings(updatedBookings)
    filterBookings(activeTab, updatedBookings)

    // If modal is open, update the selected booking
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus })
    }

    // Show success message
    setMessage({
      text: `Booking ${bookingId} has been ${newStatus === "confirmed" ? "approved" : newStatus}`,
      type: "success",
    })

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 3000)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateTimeString).toLocaleString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="status-badge confirmed">Confirmed</span>
      case "pending":
        return <span className="status-badge pending">Pending</span>
      case "completed":
        return <span className="status-badge completed">Completed</span>
      case "cancelled":
        return <span className="status-badge cancelled">Cancelled</span>
      default:
        return null
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="payment-badge paid">Paid</span>
      case "pending":
        return <span className="payment-badge pending">Pending</span>
      case "refunded":
        return <span className="payment-badge refunded">Refunded</span>
      default:
        return null
    }
  }

  return (
    <div className="manager-bookings-container">
      <div className="manager-bookings-header">
        <h1>Booking Management</h1>
        <p>View and manage customer bookings</p>
      </div>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="booking-tabs">
        <button className={`booking-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => filterBookings("all")}>
          All Bookings
        </button>
        <button
          className={`booking-tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => filterBookings("pending")}
        >
          Pending
        </button>
        <button
          className={`booking-tab ${activeTab === "confirmed" ? "active" : ""}`}
          onClick={() => filterBookings("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={`booking-tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => filterBookings("completed")}
        >
          Completed
        </button>
        <button
          className={`booking-tab ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => filterBookings("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No {activeTab !== "all" ? activeTab : ""} bookings found.</p>
        </div>
      ) : (
        <div className="booking-table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{booking.userName}</span>
                      <span className="customer-email">{booking.userEmail}</span>
                    </div>
                  </td>
                  <td>
                    <div className="vehicle-info">
                      <span className="vehicle-name">
                        {booking.brand} {booking.model}
                      </span>
                      <span className="vehicle-plate">{booking.plateNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="booking-dates">
                      <div>{formatDate(booking.pickupDate)}</div>
                      <div className="date-separator">to</div>
                      <div>{formatDate(booking.dropoffDate)}</div>
                    </div>
                  </td>
                  <td>${booking.price}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>{getPaymentStatusBadge(booking.paymentStatus)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-view"
                        onClick={() => handleViewDetails(booking)}
                        aria-label={`View details for booking ${booking.id}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>

                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Details
                      </button>

                      {booking.status === "pending" && (
                        <button
                          className="btn btn-approve"
                          onClick={() => handleStatusChange(booking.id, "confirmed")}
                          aria-label={`Approve booking ${booking.id}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedBooking && (
        <div className="booking-modal-overlay" onClick={closeModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="close-button" onClick={closeModal} aria-label="Close modal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="booking-status-bar">
                <div className="booking-id">Booking ID: {selectedBooking.id}</div>
                <div className="booking-status">
                  {getStatusBadge(selectedBooking.status)}
                  {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                </div>
              </div>

              <div className="booking-sections">
                <div className="booking-section">
                  <h3>Customer Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{selectedBooking.userName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{selectedBooking.userEmail}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{selectedBooking.userPhone}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Customer ID</span>
                      <span className="info-value">{selectedBooking.userId}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-section">
                  <h3>Vehicle Information</h3>
                  <div className="vehicle-details">
                    <img
                      src={selectedBooking.image || "/placeholder.svg?height=150&width=250"}
                      alt={`${selectedBooking.brand} ${selectedBooking.model}`}
                      className="vehicle-image"
                    />
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Vehicle</span>
                        <span className="info-value">
                          {selectedBooking.brand} {selectedBooking.model}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Year</span>
                        <span className="info-value">{selectedBooking.year}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Plate Number</span>
                        <span className="info-value">{selectedBooking.plateNumber}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Daily Rate</span>
                        <span className="info-value">${selectedBooking.rentalRate}/day</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-section">
                  <h3>Booking Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Pickup Date</span>
                      <span className="info-value">{formatDate(selectedBooking.pickupDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Return Date</span>
                      <span className="info-value">{formatDate(selectedBooking.dropoffDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Pickup Location</span>
                      <span className="info-value">{selectedBooking.pickupLocation}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Return Location</span>
                      <span className="info-value">{selectedBooking.dropoffLocation}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Price</span>
                      <span className="info-value">${selectedBooking.price}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Booking Created</span>
                      <span className="info-value">{formatDateTime(selectedBooking.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="booking-section">
                    <h3>Notes</h3>
                    <p className="booking-notes">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {selectedBooking.status === "pending" && (
                <div className="modal-actions">
                  <button
                    className="btn btn-cancel"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "cancelled")
                      closeModal()
                    }}
                  >
                    Reject Booking
                  </button>
                  <button
                    className="btn btn-approve"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "confirmed")
                      closeModal()
                    }}
                  >
                    Approve Booking
                  </button>
                </div>
              )}

              {selectedBooking.status === "confirmed" && (
                <div className="modal-actions">
                  <button
                    className="btn btn-complete"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "completed")
                      closeModal()
                    }}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}

              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
