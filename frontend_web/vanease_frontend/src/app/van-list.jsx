"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/van-list.css"
import AlphardHybrid from "../assets/Alphard-Hybrid.png"

export default function VanList() {
  // Mock data for vans
  const allVans = [
    {
      id: 1,
      model: "Transit Connect",
      brand: "Ford",
      year: 2023,
      rentalRate: 59,
      image: AlphardHybrid,
      available: true,
    },
    {
      id: 2,
      model: "Sprinter",
      brand: "Mercedes-Benz",
      year: 2022,
      rentalRate: 89,
      image: "/placeholder.svg?height=300&width=500",
      available: false,
    },
    {
      id: 3,
      model: "Odyssey",
      brand: "Honda",
      year: 2023,
      rentalRate: 79,
      image: "/placeholder.svg?height=300&width=500",
      available: true,
    },
    {
      id: 4,
      model: "Sienna",
      brand: "Toyota",
      year: 2022,
      rentalRate: 85,
      image: "/placeholder.svg?height=300&width=500",
      available: false,
    },
    {
      id: 5,
      model: "Express",
      brand: "Chevrolet",
      year: 2021,
      rentalRate: 75,
      image: "/placeholder.svg?height=300&width=500",
      available: true,
    },
    {
      id: 6,
      model: "ProMaster",
      brand: "RAM",
      year: 2023,
      rentalRate: 82,
      image: "/placeholder.svg?height=300&width=500",
      available: false,
    },
    {
      id: 7,
      model: "Carnival",
      brand: "Kia",
      year: 2023,
      rentalRate: 88,
      image: "/placeholder.svg?height=300&width=500",
      available: true,
    },
    {
      id: 8,
      model: "Metris",
      brand: "Mercedes-Benz",
      year: 2022,
      rentalRate: 129,
      image: "/placeholder.svg?height=300&width=500",
      available: false,
    },
    {
      id: 9,
      model: "Transit",
      brand: "Ford",
      year: 2023,
      rentalRate: 79,
      image: "/placeholder.svg?height=300&width=500",
      available: true,
    },
    {
      id: 10,
      model: "NV200",
      brand: "Nissan",
      year: 2021,
      rentalRate: 55,
      image: "/placeholder.svg?height=300&width=500",
      available: true,
    },
    {
      id: 11,
      model: "Pacifica",
      brand: "Chrysler",
      year: 2023,
      rentalRate: 115,
      image: "/placeholder.svg?height=300&width=500",
      available: false,
    },
    {
      id: 12,
      model: "Grand Caravan",
      brand: "Dodge",
      year: 2020,
      rentalRate: 65,
      image: "/placeholder.svg?height=300&width=500",
      available: true,
    },
  ]

  const [vans, setVans] = useState(allVans)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    brand: [],
    year: [],
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("price-low")

  // Extract unique values for filter options
  const brands = [...new Set(allVans.map((van) => van.brand))]
  const years = [...new Set(allVans.map((van) => van.year))]

  // Apply filters and search
  useEffect(() => {
    let filteredVans = [...allVans]

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredVans = filteredVans.filter(
        (van) => van.model.toLowerCase().includes(term) || van.brand.toLowerCase().includes(term),
      )
    }

    // Apply filters
    if (filters.brand.length > 0) {
      filteredVans = filteredVans.filter((van) => filters.brand.includes(van.brand))
    }

    if (filters.year.length > 0) {
      filteredVans = filteredVans.filter((van) => filters.year.includes(van.year))
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filteredVans.sort((a, b) => a.rentalRate - b.rentalRate)
    } else if (sortBy === "price-high") {
      filteredVans.sort((a, b) => b.rentalRate - a.rentalRate)
    } else if (sortBy === "year-new") {
      filteredVans.sort((a, b) => b.year - a.year)
    } else if (sortBy === "year-old") {
      filteredVans.sort((a, b) => a.year - b.year)
    }

    setVans(filteredVans)
  }, [searchTerm, filters, sortBy])

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

  return (
    <main>
      <div className="van-list-container">
        <div className="van-list-header">
          <div>
            <h1 className="van-list-title">Our Van Collection</h1>
            <p className="van-list-subtitle">Find the perfect van for your next journey</p>
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
                {brands.map((brand) => (
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
                {years.map((year) => (
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

          {/* Mobile Filters */}
          <div className={`van-filters mobile-filters ${showFilters ? "open" : ""}`}>
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
                {brands.map((brand) => (
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
                {years.map((year) => (
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

            <div className="mobile-filter-actions">
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear All
              </button>
              <button className="btn btn-primary" onClick={() => setShowFilters(false)}>
                Apply Filters
              </button>
            </div>
          </div>

          {/* Van Grid */}
          <div>
            {vans.length === 0 ? (
              <div className="card text-center">
                <p className="mb-4">No vans match your search criteria.</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="van-list">
                {vans.map((van) => (
                  <div key={van.id} className="card van-horizontal-card">
                    <div className="van-card-layout">
                      <div className="van-card-image-container">
                        <img
                          src={van.image || "/placeholder.svg"}
                          alt={`${van.brand} ${van.model}`}
                          className="van-card-image"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </div>

                      <div className="van-card-content">
                        <div className="van-card-header">
                          <div className="van-card-title-container">
                            <h3 className="van-card-title">
                              {van.brand} {van.model}
                            </h3>
                            <span className={`availability-badge ${van.available ? "available" : "not-available"}`}>
                              {van.available ? "Available" : "Not Available"}
                            </span>
                          </div>
                          <span className="van-card-price">${van.rentalRate}/day</span>
                        </div>

                        <div className="van-card-specs">
                          <div className="van-spec">
                            <span className="van-spec-label">Brand:</span>
                            <span>{van.brand}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Model:</span>
                            <span>{van.model}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Year:</span>
                            <span>{van.year}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Rental Rate:</span>
                            <span>${van.rentalRate}/day</span>
                          </div>
                        </div>

                        <div className="van-card-actions">
                          <Link
                            to="/book-van"
                            className={`btn ${van.available ? "btn-primary" : "btn-disabled"}`}
                            disabled={!van.available}
                          >
                            {van.available ? "Book Now" : "Not Available"}
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
