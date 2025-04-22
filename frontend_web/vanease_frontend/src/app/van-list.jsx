"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/van-list.css"

export default function VanList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    brand: [],
    year: [],
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("price-low")

  useEffect(() => {
    // Fetch data from the backend
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vehicles") // Replace with your backend API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles")
        }
        const data = await response.json()
        console.log("Fetched vehicles:", data) // Debugging: Log the fetched data
        setVehicles(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // Dynamically get the image path for a vehicle
  const getImagePath = (model) => {
    try {
      return require(`../assets/${model.replace(/\s+/g, "-")}.png`) // Replace spaces with hyphens
    } catch {
      return "/placeholder.svg" // Fallback image
    }
  }

  // Apply filters and search
  const filteredVehicles = vehicles
    .filter((vehicle) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return vehicle.model.toLowerCase().includes(term) || vehicle.brand.toLowerCase().includes(term)
      }
      return true
    })
    .filter((vehicle) => {
      if (filters.brand.length > 0 && !filters.brand.includes(vehicle.brand)) return false
      if (filters.year.length > 0 && !filters.year.includes(vehicle.year)) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.rentalRate - b.rentalRate
      if (sortBy === "price-high") return b.rentalRate - a.rentalRate
      if (sortBy === "year-new") return b.year - a.year
      if (sortBy === "year-old") return a.year - b.year
      return 0
    })

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }

      return {
        ...prev,
        [type]: current,
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      brand: [],
      year: [],
    })
    setSearchTerm("")
  }

  if (loading) {
    return <div className="loading">Loading vehicles...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <main>
      <div className="van-list-container">
        <div className="van-list-header">
          <div>
            <h1 className="van-list-title">Our Vehicle Collection</h1>
            <p className="van-list-subtitle">Find the perfect vehicle for your next journey</p>
          </div>

          <div className="van-list-actions">
            <select className="van-list-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest First</option>
              <option value="year-old">Year: Oldest First</option>
            </select>

            <button className="filter-toggle mobile-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <span className="filter-toggle-icon">🔍</span>
              Filters
            </button>
          </div>
        </div>

        <div className="van-list-layout">
          {/* Desktop Filters */}
          <div className="van-filters desktop-filters">
            <div className="van-search">
              <span className="van-search-icon">🔍</span>
              <input
                type="text"
                className="van-search-input"
                placeholder="Search by model or brand"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Brand</h3>
              <div className="filter-options">
                {[...new Set(vehicles.map((vehicle) => vehicle.brand))].map((brand) => (
                  <label key={brand} className="filter-option">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={filters.brand.includes(brand)}
                      onChange={() => toggleFilter("brand", brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Year</h3>
              <div className="filter-options">
                {[...new Set(vehicles.map((vehicle) => vehicle.year))].map((year) => (
                  <label key={year} className="filter-option">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={filters.year.includes(year)}
                      onChange={() => toggleFilter("year", year)}
                    />
                    {year}
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-secondary w-100" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>

          {/* Vehicle Grid */}
          <div>
            {filteredVehicles.length === 0 ? (
              <div className="card text-center">
                <p className="mb-4">No vehicles match your search criteria.</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="van-list">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.vehicle_id || vehicle.model} className="card van-horizontal-card">
                    <div className="van-card-layout">
                      <div className="van-card-image-container">
                        <img
                          src={getImagePath(vehicle.model)}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="van-card-image"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </div>

                      <div className="van-card-content">
                        <div className="van-card-header">
                          <div className="van-card-title-container">
                            <h3 className="van-card-title">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <span
                              className={`availability-badge ${
                                vehicle.availability ? "available" : "not-available"
                              }`}
                            >
                              {vehicle.availability ? "Available" : "Not Available"}
                            </span>
                          </div>
                          <span className="van-card-price">₱{vehicle.rentalRate || 0}/day</span>
                        </div>

                        <div className="van-card-specs">
                          <div className="van-spec">
                            <span className="van-spec-label">Brand:</span>
                            <span>{vehicle.brand}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Model:</span>
                            <span>{vehicle.model}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Year:</span>
                            <span>{vehicle.year}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Rental Rate:</span>
                            <span>₱{vehicle.rentalRate || "N/A"}/day</span> {/* Ensure rentalRate is displayed */}
                          </div>
                        </div>

                        <div className="van-card-actions">
                          <Link
                            to="/book-van"
                            className={`btn ${vehicle.availability ? "btn-primary" : "btn-disabled"}`}
                            disabled={!vehicle.availability}
                          >
                            {vehicle.availability ? "Book Now" : "Not Available"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
