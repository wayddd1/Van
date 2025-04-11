"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/my-bookings.css"

export default function MyBookings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [bookings, setBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Mock bookings data
    const mockBookings = [
      {
        id: "B001",
        model: "Transit Connect",
        brand: "Ford",
        year: 2023,
        rentalRate: 59,
        vanType: "Family Van",
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "Downtown",
        dropoffLocation: "Airport",
        pickupDate: "2023-08-15",
        dropoffDate: "2023-08-20",
        status: "confirmed",
        price: "$395",
      },
      {
        id: "B002",
        model: "Sprinter",
        brand: "Mercedes-Benz",
        year: 2022,
        rentalRate: 89,
        vanType: "Cargo Van",
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "North Branch",
        dropoffLocation: "South Branch",
        pickupDate: "2023-09-05",
        dropoffDate: "2023-09-07",
        status: "pending",
        price: "$178",
      },
      {
        id: "B003",
        model: "Odyssey",
        brand: "Honda",
        year: 2023,
        rentalRate: 79,
        vanType: "Luxury Van",
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "Airport",
        dropoffLocation: "Downtown",
        pickupDate: "2023-10-10",
        dropoffDate: "2023-10-15",
        status: "completed",
        price: "$645",
      },
      {
        id: "B004",
        model: "Sienna",
        brand: "Toyota",
        year: 2022,
        rentalRate: 85,
        vanType: "Compact Van",
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "Downtown",
        dropoffLocation: "Downtown",
        pickupDate: "2023-07-20",
        dropoffDate: "2023-07-22",
        status: "completed",
        price: "$118",
      },
      {
        id: "B005",
        model: "Express",
        brand: "Chevrolet",
        year: 2021,
        rentalRate: 75,
        vanType: "Sprinter",
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "South Branch",
        dropoffLocation: "Airport",
        pickupDate: "2023-11-15",
        dropoffDate: "2023-11-20",
        status: "confirmed",
        price: "$445",
      },
      {
        id: "B006",
        model: "ProMaster",
        brand: "RAM",
        year: 2023,
        rentalRate: 82,
        vanType: "Cargo Van",
        image: "/placeholder.svg?height=300&width=500",
        pickupLocation: "North Branch",
        dropoffLocation: "North Branch",
        pickupDate: "2023-08-25",
        dropoffDate: "2023-08-26",
        status: "confirmed",
        price: "$89",
      },
    ]

    setAllBookings(mockBookings)
    setBookings(mockBookings)
  }, [navigate])

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

  if (!user) {
    return <div className="loading-container">Loading...</div>
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
            <Link to="/van-list" className="btn btn-primary">
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
                        <h2 className="booking-card-title">
                          {booking.brand} {booking.model} - {booking.vanType}
                        </h2>
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

                    <div className="booking-specs">
                      <div className="booking-spec">
                        <span className="booking-spec-label">Brand:</span>
                        <span>{booking.brand}</span>
                      </div>
                      <div className="booking-spec">
                        <span className="booking-spec-label">Model:</span>
                        <span>{booking.model}</span>
                      </div>
                      <div className="booking-spec">
                        <span className="booking-spec-label">Year:</span>
                        <span>{booking.year}</span>
                      </div>
                      <div className="booking-spec">
                        <span className="booking-spec-label">Rental Rate:</span>
                        <span>${booking.rentalRate}/day</span>
                      </div>
                    </div>

                    <div className="booking-card-footer">
                      <div className="booking-price">
                        <span className="booking-price-label">Total Price</span>
                        <span className="booking-price-value">{booking.price}</span>
                      </div>
                      <div className="booking-actions">
                        {booking.status === "pending" && <button className="btn btn-cancel">Cancel</button>}

                        {booking.status === "completed" && <button className="btn btn-review">Leave Review</button>}
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
