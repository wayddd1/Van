"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/auth.css"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("vanease_user"))
    if (user) {
      navigate("/")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("vanease_users")) || []
    const user = users.find((u) => u.email === formData.email)

    if (!user) {
      setError("User not found. Please check your email or register.")
      return
    }

    if (user.password !== formData.password) {
      setError("Incorrect password. Please try again.")
      return
    }

    // Login successful
    const { password, ...userWithoutPassword } = user
    localStorage.setItem("vanease_user", JSON.stringify(userWithoutPassword))
    navigate("/")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Login to VanEase</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="auth-form-control"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="auth-form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="auth-form-options">
            <label className="auth-checkbox-label">
              <input type="checkbox" className="auth-checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="auth-forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

