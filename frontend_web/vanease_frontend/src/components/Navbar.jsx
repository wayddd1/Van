"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            Van<span>Ease</span>
          </Link>

          <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
            <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}>
              Home
            </Link>
            <Link to="/van-list" className={`navbar-link ${location.pathname === "/van-list" ? "active" : ""}`}>
              Van List
            </Link>
            <Link to="/book-van" className={`navbar-link ${location.pathname === "/book-van" ? "active" : ""}`}>
              Book a Van
            </Link>
            <Link to="/my-bookings" className={`navbar-link ${location.pathname === "/my-bookings" ? "active" : ""}`}>
              My Bookings
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/login" className="btn btn-primary navbar-login-btn">
            Login
          </Link>

          <button className="navbar-toggle" onClick={toggleMenu}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  )
}

