import { Link } from "react-router-dom"
import "../styles/footer.css"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <Link to="/" className="footer-logo">
              Van<span>Ease</span>
            </Link>
            <p className="footer-description">
              Premium van rental service for every journey. Experience comfort, reliability, and exceptional service.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <span className="footer-social-icon">📱</span>
              </a>
              <a href="#" className="footer-social-link">
                <span className="footer-social-icon">📘</span>
              </a>
              <a href="#" className="footer-social-link">
                <span className="footer-social-icon">📸</span>
              </a>
              <a href="#" className="footer-social-link">
                <span className="footer-social-icon">🐦</span>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/van-list" className="footer-link">
                  Van Fleet
                </Link>
              </li>
              <li>
                <Link to="/book-van" className="footer-link">
                  Book a Van
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="footer-link">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span>123 Rental Street, City, State 12345</span>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <span>(555) 123-4567</span>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <span>info@vanease.com</span>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">🕒</span>
                <span>Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">&copy; {currentYear} VanEase. All rights reserved.</p>
          <div className="footer-payment">
            <span className="footer-payment-icon">💳</span>
            <span className="footer-payment-icon">💳</span>
            <span className="footer-payment-icon">💳</span>
            <span className="footer-payment-icon">💳</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

