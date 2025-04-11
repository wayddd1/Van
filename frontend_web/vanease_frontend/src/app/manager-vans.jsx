"use client"

import { useState } from "react"
import "../styles/manager-vans.css"

export default function ManagerVans() {
  const [vans, setVans] = useState([
    {
      id: 1,
      model: "Transit Connect",
      brand: "Ford",
      year: 2023,
      rentalRate: 59,
      plateNumber: "ABC-1234",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      model: "Sprinter",
      brand: "Mercedes-Benz",
      year: 2022,
      rentalRate: 89,
      plateNumber: "XYZ-5678",
      available: false,
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 3,
      model: "Odyssey",
      brand: "Honda",
      year: 2023,
      rentalRate: 79,
      plateNumber: "DEF-9012",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
    },
  ])

  const [formData, setFormData] = useState({
    id: null,
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    rentalRate: "",
    plateNumber: "",
    available: true,
    image: "/placeholder.svg?height=300&width=500",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.model || !formData.brand || !formData.rentalRate || !formData.plateNumber) {
      setMessage({ text: "Please fill in all required fields", type: "error" })
      return
    }

    if (isEditing) {
      // Update existing van
      setVans((prev) => prev.map((van) => (van.id === formData.id ? formData : van)))
      setMessage({ text: "Van updated successfully", type: "success" })
    } else {
      // Add new van
      const newVan = {
        ...formData,
        id: Date.now(),
      }
      setVans((prev) => [...prev, newVan])
      setMessage({ text: "Van added successfully", type: "success" })
    }

    // Reset form
    resetForm()

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 3000)
  }

  const handleEdit = (van) => {
    setFormData(van)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this van?")) {
      setVans((prev) => prev.filter((van) => van.id !== id))
      setMessage({ text: "Van deleted successfully", type: "success" })

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" })
      }, 3000)
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      model: "",
      brand: "",
      year: new Date().getFullYear(),
      rentalRate: "",
      plateNumber: "",
      available: true,
      image: "/placeholder.svg?height=300&width=500",
    })
    setIsEditing(false)
  }

  return (
    <div className="manager-vans-container">
      <div className="manager-vans-header">
        <h1>Van Management</h1>
        <p>Add, edit, and manage the van fleet</p>
      </div>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="van-form-section">
        <h2>{isEditing ? "Edit Van" : "Add New Van"}</h2>
        <form onSubmit={handleSubmit} className="van-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand*</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Ford, Toyota"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model*</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Transit, Sienna"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year*</label>
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
            <div className="form-group">
              <label htmlFor="plateNumber">Plate Number*</label>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rentalRate">Daily Rental Rate ($)*</label>
              <input
                type="number"
                id="rentalRate"
                name="rentalRate"
                value={formData.rentalRate}
                onChange={handleChange}
                min="1"
                step="0.01"
                placeholder="e.g. 59.99"
                required
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                Available for Rent
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL or leave default"
              />
            </div>
          </div>

          <div className="form-actions">
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Van" : "Add Van"}
            </button>
          </div>
        </form>
      </div>

      <div className="van-list-section">
        <h2>Van Fleet</h2>
        {vans.length === 0 ? (
          <div className="empty-state">
            <p>No vans in the fleet yet. Add your first van above.</p>
          </div>
        ) : (
          <div className="van-table-container">
            <table className="van-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Plate Number</th>
                  <th>Daily Rate</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vans.map((van) => (
                  <tr key={van.id}>
                    <td>
                      <img
                        src={van.image || "/placeholder.svg?height=60&width=100"}
                        alt={`${van.brand} ${van.model}`}
                        className="van-thumbnail"
                      />
                    </td>
                    <td>{van.brand}</td>
                    <td>{van.model}</td>
                    <td>{van.year}</td>
                    <td>{van.plateNumber}</td>
                    <td>${van.rentalRate}</td>
                    <td>
                      <span className={`status-badge ${van.available ? "available" : "unavailable"}`}>
                        {van.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(van)}
                          aria-label={`Edit ${van.brand} ${van.model}`}
                        >
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
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(van.id)}
                          aria-label={`Delete ${van.brand} ${van.model}`}
                        >
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
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
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
  )
}
