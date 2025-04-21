"use client"

import { Link } from "react-router-dom"
import ManagerNavbar from "../components/ManagerNavbar"
import "../styles/manager-dashboard.css"

export default function ManagerDashboard() {
  // Static data for dashboard
  const stats = {
    totalVans: 12,
    activeBookings: 8,
    pendingBookings: 3,
    revenue: "₱45,600",
  }

  return (
    <>
      <ManagerNavbar />
      <div className="manager-dashboard-container">
        <div className="manager-dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>Welcome to the Rental management portal</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">🚐</div>
            <div className="stat-content">
              <h3>Total Vans</h3>
              <p className="stat-value">{stats.totalVans}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Active Bookings</h3>
              <p className="stat-value">{stats.activeBookings}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Bookings</h3>
              <p className="stat-value">{stats.pendingBookings}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue</h3>
              <p className="stat-value">{stats.revenue}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Manage Vans</h3>
            <p>Add, edit, or remove vans from your fleet</p>
            <Link to="/manager-vans" className="action-button">
              Go to Van Management
            </Link>
          </div>
          <div className="action-card">
            <h3>Manage Bookings</h3>
            <p>View and process customer booking requests</p>
            <Link to="/manager-bookings" className="action-button">
              Go to Booking Management
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
