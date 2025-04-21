"use client"

import { useState } from "react"
import ManagerNavbar from "../components/ManagerNavbar"
import "../styles/manager-bookings.css"

export default function ManagerBookings() {
  // Static mock data for bookings
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
      status: "pending",
      price: 295,
      paymentStatus: "pending",
      notes: "Customer requested child seat",
      createdAt: "2023-08-01T10:30:00Z",
    },
    {
      id: "B002",
      userId: "U124",
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
      pickupLocation: "Airport",
      dropoffLocation: "Downtown",
      pickupDate: "2023-08-18",
      dropoffDate: "2023-08-25",
      status: "confirmed",
      price: 623,
      paymentStatus: "paid",
      notes: "",
      createdAt: "2023-08-02T14:45:00Z",
    },
    {
      id: "B003",
      userId: "U125",
      userName: "Michael Brown",
      userEmail: "michael@example.com",
      userPhone: "555-456-7890",
      vanId: "V003",
      model: "ProMaster",
      brand: "Ram",
      year: 2023,
      plateNumber: "DEF-9012",
      rentalRate: 75,
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "Downtown",
      dropoffLocation: "Downtown",
      pickupDate: "2023-08-10",
      dropoffDate: "2023-08-12",
      status: "completed",
      price: 150,
      paymentStatus: "paid",
      notes: "Customer requested early pickup",
      createdAt: "2023-07-25T09:15:00Z",
    },
    {
      id: "B004",
      userId: "U126",
      userName: "Emily Davis",
      userEmail: "emily@example.com",
      userPhone: "555-789-0123",
      vanId: "V004",
      model: "Express",
      brand: "Chevrolet",
      year: 2021,
      plateNumber: "GHI-3456",
      rentalRate: 65,
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "Airport",
      dropoffLocation: "Airport",
      pickupDate: "2023-08-22",
      dropoffDate: "2023-08-24",
      status: "pending",
      price: 130,
      paymentStatus: "pending",
      notes: "",
      createdAt: "2023-08-05T16:20:00Z",
    },
    {
      id: "B005",
      userId: "U127",
      userName: "David Wilson",
      userEmail: "david@example.com",
      userPhone: "555-234-5678",
      vanId: "V005",
      model: "Transit",
      brand: "Ford",
      year: 2022,
      plateNumber: "JKL-7890",
      rentalRate: 70,
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "Downtown",
      dropoffLocation: "Airport",
      pickupDate: "2023-08-28",
      dropoffDate: "2023-09-02",
      status: "cancelled",
      price: 350,
      paymentStatus: "refunded",
      notes: "Customer cancelled due to change of plans",
      createdAt: "2023-08-03T11:10:00Z",
    },
  ]

  // Minimal state for UI functionality
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter bookings based on active tab
  const filteredBookings =
    activeTab === "all" ? mockBookings : mockBookings.filter((booking) => booking.status === activeTab)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <>
      <ManagerNavbar />
      <div className="manager-bookings-container">
        <div className="manager-bookings-header">
          <h1>Booking Management</h1>
          <p>View and manage customer bookings</p>
        </div>

        <div className="booking-tabs">
          <button
            className={`booking-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All Bookings
          </button>
          <button
            className={`booking-tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => handleTabChange("pending")}
          >
            Pending
          </button>
          <button
            className={`booking-tab ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => handleTabChange("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`booking-tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => handleTabChange("completed")}
          >
            Completed
          </button>
          <button
            className={`booking-tab ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => handleTabChange("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {filteredBookings.length === 0 ? (
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
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
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
                          {booking.brand} {booking.model} ({booking.year})
                        </span>
                        <span className="vehicle-plate">{booking.plateNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="booking-dates">
                        <span>{formatDate(booking.pickupDate)}</span>
                        <span className="date-separator">to</span>
                        <span>{formatDate(booking.dropoffDate)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-badge ${booking.paymentStatus}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-view" onClick={() => handleViewBooking(booking)}>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && selectedBooking && (
          <div className="booking-modal-overlay" onClick={handleCloseModal}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Booking Details</h2>
                <button className="close-button" onClick={handleCloseModal}>
                  ✕
                </button>
              </div>
              <div className="modal-content">
                <div className="booking-status-bar">
                  <div className="booking-id">Booking #{selectedBooking.id}</div>
                  <div className="booking-status">
                    <span className={`status-badge ${selectedBooking.status}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                    <span className={`payment-badge ${selectedBooking.paymentStatus}`}>
                      {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                    </span>
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
                        <span className="info-label">Booking Date</span>
                        <span className="info-value">{formatDate(selectedBooking.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-section">
                    <h3>Vehicle Details</h3>
                    <div className="vehicle-details">
                      <img
                        src={selectedBooking.image || "/placeholder.svg"}
                        alt={`${selectedBooking.brand} ${selectedBooking.model}`}
                        className="vehicle-image"
                      />
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Vehicle</span>
                          <span className="info-value">
                            {selectedBooking.brand} {selectedBooking.model} ({selectedBooking.year})
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">License Plate</span>
                          <span className="info-value">{selectedBooking.plateNumber}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Daily Rate</span>
                          <span className="info-value">₱{selectedBooking.rentalRate}/day</span>
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
                        <span className="info-label">Dropoff Date</span>
                        <span className="info-value">{formatDate(selectedBooking.dropoffDate)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Pickup Location</span>
                        <span className="info-value">{selectedBooking.pickupLocation}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Dropoff Location</span>
                        <span className="info-value">{selectedBooking.dropoffLocation}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Total Price</span>
                        <span className="info-value">₱{selectedBooking.price}</span>
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
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
