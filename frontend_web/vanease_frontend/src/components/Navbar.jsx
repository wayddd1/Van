import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth from AuthContext
import "../styles/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, token, logout } = useAuth(); // Get user info, token, and logout function from context
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check localStorage directly as a fallback
  const localStorageToken = localStorage.getItem('token');
  
  // Parse user from localStorage if available
  const localStorageUser = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;
  
  // Use either context token or localStorage token
  const isAuthenticated = !!token || !!localStorageToken;
  
  // Get user role from localStorage if not available in context
  const userRole = user?.role || localStorageUser?.role;
  
  // Debug authentication state
  useEffect(() => {
    console.log('Auth state:', { 
      contextToken: !!token, 
      localToken: !!localStorageToken,
      isAuthenticated,
      contextUser: user,
      localUser: localStorageUser,
      userRole
    });
  }, [token, localStorageToken, user, localStorageUser, userRole]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from context
    // Also clear localStorage directly as a fallback
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    navigate("/"); // Redirect to the homepage or login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-logo">
          <span className="logo-text">VanEase</span>
        </span>

        <div className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
          <span className="toggle-icon">{isMenuOpen ? "✕" : "☰"}</span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-links">
            {/* Conditional links based on role */}
            {(userRole === 'CUSTOMER' || localStorageUser?.role === 'CUSTOMER') && (
              <>
                <Link to="/customer/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/customer/van-list" className="navbar-link">Van List</Link>
                <Link to="/customer/booking" className="navbar-link">Book A Van</Link>
                <Link to="/payment" className="navbar-link">Payment</Link>
              </>
            )}
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar-profile">
                  <span className="profile-icon">👤</span>
                  <span className="profile-text">{user?.name || localStorageUser?.name || 'Profile'}</span>
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
