"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/my-bookings.css"

export default function MyBookings() {
  // Mock data for booked vans
  const allBookings = [
    {
      id: "B001",
      vanType: "Family Van",
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "Downtown",
      dropoffLocation: "Airport",
      pickupDate: "2023-08-15",
      dropoffDate: "2023-08-20",
      status: "confirmed",
      price: "$395",
      description:
        "Spacious family van with comfortable seating for 7 passengers. Includes air conditioning, entertainment system, and ample luggage space for your journey.",
    },
    {
      id: "B002",
      vanType: "Cargo Van",
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "North Branch",
      dropoffLocation: "South Branch",
      pickupDate: "2023-09-05",
      dropoffDate: "2023-09-07",
      status: "pending",
      price: "$178",
      description:
        "Practical cargo van with 1000kg capacity and secure tie-down points. Perfect for moving goods with its spacious interior and easy-access side door.",
    },
    {
      id: "B003",
      vanType: "Luxury Van",
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "Airport",
      dropoffLocation: "Downtown",
      pickupDate: "2023-10-10",
      dropoffDate: "2023-10-15",
      status: "completed",
      price: "$645",
      description:
        "Premium luxury van featuring leather seats, climate control, and advanced entertainment system. Offers a first-class travel experience with superior comfort.",
    },
    {
      id: "B004",
      vanType: "Compact Van",
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "Downtown",
      dropoffLocation: "Downtown",
      pickupDate: "2023-07-20",
      dropoffDate: "2023-07-22",
      status: "completed",
      price: "$118",
      description:
        "Fuel-efficient compact van ideal for city driving. Easy to maneuver with comfortable seating for 5 passengers and good cargo space.",
    },
    {
      id: "B005",
      vanType: "Sprinter",
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "South Branch",
      dropoffLocation: "Airport",
      pickupDate: "2023-11-15",
      dropoffDate: "2023-11-20",
      status: "confirmed",
      price: "$445",
      description:
        "Versatile Mercedes-Benz Sprinter with high roof and spacious interior. Perfect for group travel with premium features and reliable performance.",
    },
    {
      id: "B006",
      vanType: "Cargo Van",
      image: "/placeholder.svg?height=300&width=500",
      pickupLocation: "North Branch",
      dropoffLocation: "North Branch",
      pickupDate: "2023-08-25",
      dropoffDate: "2023-08-26",
      status: "pending",
      price: "$89",
      description:
        "Reliable cargo van with practical features for short-term deliveries. Includes backup camera and easy-load rear doors for efficient loading.",
    },
  ]

  const [activeTab, setActiveTab] = useState("all")
  const [bookings, setBookings] = useState(allBookings)

  // Filter bookings based on active tab
  const filterBookings = (tab) => {
    setActiveTab(tab)

    if (tab === "all") {
      setBookings(allBookings)
    } else {
      setBookings(allBookings.filter((booking) => booking.status === tab))
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="booking-status booking-status-confirmed">
            <span className="booking-status-icon">✓</span> Confirmed
          </span>
        )
      case "pending":
        return (
          <span className="booking-status booking-status-pending">
            <span className="booking-status-icon">⏳</span> Pending
          </span>
        )
      case "completed":
        return (
          <span className="booking-status booking-status-completed">
            <span className="booking-status-icon">✓</span> Completed
          </span>
        )
      case "cancelled":
        return (
          <span className="booking-status booking-status-cancelled">
            <span className="booking-status-icon">✕</span> Cancelled
          </span>
        )
      default:
        return null
    }
  }

  return (
    <main>
      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <h1 className="my-bookings-title">My Bookings</h1>
          <p className="my-bookings-subtitle">View and manage your van rentals</p>
        </div>

        <div className="booking-tabs">
          <button
            className={`booking-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => filterBookings("all")}
          >
            All Bookings
          </button>
          <button
            className={`booking-tab ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => filterBookings("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={`booking-tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => filterBookings("pending")}
          >
            Pending
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
          <div className="empty-bookings">
            <p className="empty-bookings-text">No {activeTab !== "all" ? activeTab : ""} bookings found.</p>
            <Link to="/book-van" className="btn btn-primary">
              Book a Van Now
            </Link>
          </div>
        ) : (
          <div>
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-layout">
                  <img className="booking-card-image" src={booking.image || "/placeholder.svg"} alt={booking.vanType} />
                  <div className="booking-card-content">
                    <div className="booking-card-header">
                      <div>
                        <h2 className="booking-card-title">{booking.vanType}</h2>
                        <p className="booking-card-id">Booking ID: {booking.id}</p>
                      </div>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>

                    <div className="booking-details">
                      <div className="booking-detail">
                        <span className="booking-detail-icon">📅</span>
                        <div className="booking-detail-content">
                          <p>Pickup Date</p>
                          <p>{formatDate(booking.pickupDate)}</p>
                        </div>
                      </div>
                      <div className="booking-detail">
                        <span className="booking-detail-icon">📅</span>
                        <div className="booking-detail-content">
                          <p>Drop-off Date</p>
                          <p>{formatDate(booking.dropoffDate)}</p>
                        </div>
                      </div>
                      <div className="booking-detail">
                        <span className="booking-detail-icon">📍</span>
                        <div className="booking-detail-content">
                          <p>Pickup Location</p>
                          <p>{booking.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="booking-detail">
                        <span className="booking-detail-icon">📍</span>
                        <div className="booking-detail-content">
                          <p>Drop-off Location</p>
                          <p>{booking.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="booking-description">
                      <p>{booking.description}</p>
                    </div>

                    <div className="booking-card-footer">
                      <div className="booking-price">
                        <span className="booking-price-label">Total Price</span>
                        <span className="booking-price-value">{booking.price}</span>
                      </div>
                      <div className="booking-actions">
                        <button className="btn btn-primary">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

