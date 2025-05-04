import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth from AuthContext
import "../styles/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, token, logout } = useAuth(); // Get user info, token, and logout function from context
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate("/"); // Redirect to the homepage or login page
  };

  // Check if user is authenticated
  const isAuthenticated = !!token;

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
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/our-vans" className="navbar-link">Our Vans</Link>
            <Link to="/book-van" className="navbar-link">Book a Van</Link>

            {/* Conditional links based on role */}
            {user?.role === 'MANAGER' && (
              <>
                <Link to="/manager-dashboard" className="navbar-link">Manager Dashboard</Link>
                <Link to="/manager-vans" className="navbar-link">Manage Vans</Link>
              </>
            )}
            {user?.role === 'CUSTOMER' && (
              <Link to="/customer-dashboard" className="navbar-link">Customer Dashboard</Link>
            )}

            {/* My Bookings link only visible if logged in */}
            {isAuthenticated && (
              <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
            )}
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
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
                <Link to="/login" className="navbar-button login-button">Login</Link>
                <Link to="/register" className="navbar-button register-button">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
