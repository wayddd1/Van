import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            Van<span>Ease</span>
          </Link>

          <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
            {["/", "/van-list", "/book-van", "/my-bookings"].map((path) => (
              <Link key={path} to={path} className={`navbar-link ${location.pathname === path ? "active" : ""}`}>
                {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
              </Link>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/login" className="btn btn-primary navbar-login-btn">
            Login
          </Link>

          <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}
