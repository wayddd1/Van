"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"; // Use the AuthContext
import "../styles/manager-navbar.css"

export default function ManagerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, token, logout } = useAuth()  // Use the AuthContext
  
  const location = useLocation()
  const navigate = useNavigate()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleLogout = () => {
    logout();  // Use the logout function from AuthContext
  
    // Also clear localStorage directly as a fallback
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentBooking');
  
    // Redirect to login page
    navigate("/login");
  }

  return (
    <nav className="manager-navbar">
      <div className="manager-navbar-container">
        {/* Logo and badge */}
        <div className="manager-navbar-logo-section">
          <Link to="/manager/manager-dashboard" className="manager-navbar-logo">
            <span className="logo-text">VanEase</span>
          </Link>
          <div className="manager-badge">Manager Portal</div>
        </div>

        {/* Mobile toggle button */}
        <div className="manager-navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
          <span className="toggle-icon">{isMenuOpen ? "✕" : "☰"}</span>
        </div>

        {/* Menu links + profile */}
        <div className={`manager-navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="manager-navbar-links">
            <Link
              to="/manager/manager-dashboard"
              className={`manager-navbar-link ${location.pathname === "/manager/manager-dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/manager/van-list"
              className={`manager-navbar-link ${(location.pathname === "/manager/van-list" || location.pathname === "/manager/van-add") ? "active" : ""}`}
            >
              Manage Vehicles
            </Link>
            <Link
              to="/manager/bookings"
              className={`manager-navbar-link ${location.pathname === "/manager/bookings" ? "active" : ""}`}
            >
              Booking Management
            </Link>
            <Link
              to="/manager/users"
              className={`manager-navbar-link ${location.pathname === "/manager/users" ? "active" : ""}`}
            >
              User Management
            </Link>
            <Link
              to="#"
              className="manager-navbar-link"
              onClick={e => { e.preventDefault(); alert('Reports feature coming soon!'); }}
            >
              View Reports
            </Link>
            <Link
              to="#"
              className="manager-navbar-link"
              onClick={e => { e.preventDefault(); alert('Customer feedback feature coming soon!'); }}
            >
              Customer Feedback
            </Link>
          </div>

          {/* Profile info and logout */}
          <div className="manager-navbar-auth">
            <div className="manager-profile-section">
              <div className="manager-profile">
                <div className="manager-avatar">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </div>
                <div className="manager-info">
                  <span className="manager-name">{user ? user.name : "Manager"}</span>
                  <span className="manager-email">{user ? user.email : ""}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="manager-logout-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
