"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Always show as logged in for demo
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    // Simply redirect to home page
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">VanEase</span>
        </Link>

        <div className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
          <span className="toggle-icon">{isMenuOpen ? "✕" : "☰"}</span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/van-list" className="navbar-link">
              Our Vans
            </Link>
            <Link to="/book-van" className="navbar-link">
              Book a Van
            </Link>

            {/* Conditional links based on authentication */}
            {isLoggedIn ? (
              <>
                <Link to="/my-bookings" className="navbar-link">
                  My Bookings
                </Link>
              </>
            ) : null}
          </div>

          <div className="navbar-auth">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="navbar-profile">
                  <span className="profile-icon">👤</span>
                  <span className="profile-text">Profile</span>
                </Link>
                <button onClick={handleLogout} className="navbar-button logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-button login-button">
                  Login
                </Link>
                <Link to="/register" className="navbar-button register-button">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
