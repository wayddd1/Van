"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

export default function ManagerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simply redirect to manager dashboard without authentication
    navigate("/manager-dashboard")
  }

  return (
    <div className="auth-container manager-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Manager Login</h1>
          <p className="auth-subtitle">Access the manager portal to manage vans and bookings</p>
        </div>

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
              placeholder="manager@vanease.com"
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


          <button type="submit" className="auth-submit-btn manager-submit-btn">
            Login to Manager Portal
          </button>
        </form>
      </div>
    </div>
  )
}
