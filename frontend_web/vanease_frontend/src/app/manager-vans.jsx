"use client"

import { useState, useRef } from "react"
import ManagerNavbar from "../components/ManagerNavbar"
import "../styles/manager-vans.css"

export default function ManagerVans() {
  // Static mock data for vans
  const mockVans = [
    {
      id: "V001",
      model: "Transit Connect",
      brand: "Ford",
      year: 2023,
      rentalRate: 59,
      plateNumber: "ABC-1234",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
      features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Cruise Control"],
      capacity: 5,
      fuelType: "Gasoline",
      transmission: "Automatic",
    },
    {
      id: "V002",
      model: "Sprinter",
      brand: "Mercedes-Benz",
      year: 2022,
      rentalRate: 89,
      plateNumber: "XYZ-5678",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
      features: ["Air Conditioning", "Bluetooth", "Navigation", "Backup Camera", "Cruise Control"],
      capacity: 12,
      fuelType: "Diesel",
      transmission: "Automatic",
    },
    {
      id: "V003",
      model: "ProMaster",
      brand: "Ram",
      year: 2023,
      rentalRate: 75,
      plateNumber: "DEF-9012",
      available: false,
      image: "/placeholder.svg?height=300&width=500",
      features: ["Air Conditioning", "Bluetooth", "Backup Camera"],
      capacity: 8,
      fuelType: "Gasoline",
      transmission: "Automatic",
    },
    {
      id: "V004",
      model: "Express",
      brand: "Chevrolet",
      year: 2021,
      rentalRate: 65,
      plateNumber: "GHI-3456",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
      features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Cruise Control"],
      capacity: 10,
      fuelType: "Gasoline",
      transmission: "Automatic",
    },
    {
      id: "V005",
      model: "Transit",
      brand: "Ford",
      year: 2022,
      rentalRate: 70,
      plateNumber: "JKL-7890",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
      features: ["Air Conditioning", "Bluetooth", "Navigation", "Backup Camera", "Cruise Control"],
      capacity: 15,
      fuelType: "Diesel",
      transmission: "Automatic",
    },
  ]

  // Minimal state for UI functionality
  const [formData, setFormData] = useState({
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    rentalRate: "",
    plateNumber: "",
    available: true,
    capacity: 5,
    fuelType: "Gasoline",
    transmission: "Automatic",
  })

  // State for image upload
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)

      // Create a preview URL for the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    // Trigger the file input click when the preview or placeholder is clicked
    fileInputRef.current.click()
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation() // Prevent triggering the parent click handler
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would add or update a van and upload the image
    alert("Form submitted! In a real app, this would add a new van with the uploaded image.")

    // Reset form
    setFormData({
      model: "",
      brand: "",
      year: new Date().getFullYear(),
      rentalRate: "",
      plateNumber: "",
      available: true,
      capacity: 5,
      fuelType: "Gasoline",
      transmission: "Automatic",
    })
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <ManagerNavbar />
      <div className="manager-vans-container">
        <div className="manager-vans-header">
          <h1>Van Management</h1>
          <p>Add, edit, and manage the van fleet</p>
        </div>

        <div className="van-form-section">
          <h2>Add New Van</h2>
          <form onSubmit={handleSubmit} className="van-form">
            {/* Image Upload Section */}
            <div className="image-upload-container">
              <div
                className="image-upload-preview"
                onClick={handleImageClick}
                style={{
                  backgroundImage: imagePreview
                    ? `url(${imagePreview})`
                    : 'url("/placeholder.svg?height=300&width=500")',
                }}
              >
                {!imagePreview && (
                  <div className="upload-placeholder">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                      <line x1="16" y1="5" x2="22" y2="5"></line>
                      <line x1="19" y1="2" x2="19" y2="8"></line>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                    <span>Click to upload van image</span>
                  </div>
                )}
                {imagePreview && (
                  <button type="button" className="remove-image-btn" onClick={handleRemoveImage} title="Remove image">
                    ✕
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="image-upload-input"
                id="van-image"
              />
              <p className="image-upload-help">Click on the area above to upload an image of the van</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Ford, Mercedes-Benz"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Transit, Sprinter"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="plateNumber">License Plate</label>
                <input
                  type="text"
                  id="plateNumber"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  placeholder="e.g. ABC-1234"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="rentalRate">Daily Rental Rate (₱)</label>
                <input
                  type="number"
                  id="rentalRate"
                  name="rentalRate"
                  value={formData.rentalRate}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 59.99"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Passenger Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type</label>
                <input
                  type="text"
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  placeholder="e.g. Gasoline, Diesel"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="transmission">Transmission</label>
                <input
                  type="text"
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  placeholder="e.g. Automatic, Manual"
                  required
                />
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                Available for Booking
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Van
              </button>
            </div>
          </form>
        </div>

        <div className="van-list-section">
          <h2>Van Fleet</h2>
          {mockVans.length === 0 ? (
            <div className="empty-state">
              <p>No vans in the fleet. Add your first van above.</p>
            </div>
          ) : (
            <div className="van-table-container">
              <table className="van-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Van Details</th>
                    <th>License Plate</th>
                    <th>Daily Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVans.map((van) => (
                    <tr key={van.id}>
                      <td>
                        <img
                          src={van.image || "/placeholder.svg"}
                          alt={`${van.brand} ${van.model}`}
                          className="van-thumbnail"
                        />
                      </td>
                      <td>
                        <div>
                          <strong>
                            {van.brand} {van.model} ({van.year})
                          </strong>
                          <div>Capacity: {van.capacity} passengers</div>
                          <div>
                            {van.fuelType} • {van.transmission}
                          </div>
                        </div>
                      </td>
                      <td>{van.plateNumber}</td>
                      <td>₱{van.rentalRate}/day</td>
                      <td>
                        <span className={`status-badge ${van.available ? "available" : "unavailable"}`}>
                          {van.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-view" title="View">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
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
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
