"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    // Here we would handle the logout, e.g. clearing user data
    // For this example, we'll just redirect to the login page
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          VanEase
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/van-list" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Van List
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/book-van" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Book a Van
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/my-bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              My Bookings
            </Link>
          </li>
        </ul>

        <div className="user-profile">
          <div
            className="profile-pic"
            onClick={toggleDropdown}
            style={{ backgroundColor: "#8ed284" }} // Static background color
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
