"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/profile.css"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [message, setMessage] = useState({ text: "", type: "" })

  // Commented out the useEffect to skip the user login check for now
  // useEffect(() => {
  //   const userData = localStorage.getItem("user")
  //   if (!userData) {
  //     navigate("/login")
  //     return
  //   }
  //   const parsedUser = JSON.parse(userData)
  //   setUser(parsedUser)
  //   setFormData({
  //     name: parsedUser.name || "",
  //     email: parsedUser.email || "",
  //     phone: parsedUser.phone || "",
  //     password: parsedUser.password || "",
  //   })
  //   setLoading(false)
  // }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Commented out the submit logic for now
    // if (!formData.name || !formData.email || !formData.password) {
    //   setMessage({ text: "Name, email, and password are required", type: "error" })
    //   return
    // }
    // const updatedUser = { ...user, ...formData }
    // localStorage.setItem("user", JSON.stringify(updatedUser))
    // setUser(updatedUser)
    // setIsEditing(false)
    // setMessage({ text: "Profile updated successfully", type: "success" })
  }

  // Commented out the loading state
  // if (loading) {
  //   return (
  //     <div className="profile-loading">
  //       <div className="spinner"></div>
  //       <p>Loading profile...</p>
  //     </div>
  //   )
  // }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>User Profile</h1>
          <button onClick={toggleEdit} className={`edit-button ${isEditing ? "cancel" : ""}`}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar">{formData.name.charAt(0).toUpperCase()}</div>
            <h2>{formData.name}</h2>
            <p className="user-email">{formData.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "disabled" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "disabled" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "disabled" : ""}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "disabled" : ""}
                />
                {isEditing && (
                  <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
                    {showPassword ? (
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
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
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
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="save-button">
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
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="profile-footer">
          {/* Display profile creation date */}
          <p>Member since: {/* Replace with actual user join date */}</p>
        </div>
      </div>
    </div>
  )
}
