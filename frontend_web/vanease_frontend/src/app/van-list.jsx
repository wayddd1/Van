"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/van-list.css"
import AlphardHybrid from '../assets/Alphard-Hybrid.png';

export default function VanList() {
  // Mock data for vans
  const allVans = [
    {
      id: 1,
      model: "Transit Connect",
      brand: "Ford",
      year: 2023,
      transmission: "Automatic",
      category: "Compact",
      seats: 5,
      price: 59,
      image: AlphardHybrid,
      description:
        "Compact and fuel-efficient van perfect for city driving and small groups. Features comfortable seating, ample storage, and modern amenities for a pleasant journey.",
      available: true,
    },
    {
      id: 2,
      model: "Sprinter",
      brand: "Mercedes-Benz",
      year: 2022,
      transmission: "Automatic",
      category: "Cargo",
      seats: 3,
      price: 89,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Professional-grade cargo van with spacious interior and high roof. Ideal for moving goods, equipment, or business deliveries with its reliable performance.",
      available: false,
    },
    {
      id: 3,
      model: "Odyssey",
      brand: "Honda",
      year: 2023,
      transmission: "Automatic",
      category: "Family",
      seats: 7,
      price: 79,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Family-friendly minivan with versatile seating, entertainment options, and safety features. Perfect for family trips with plenty of space for passengers and luggage.",
      available: true,
    },
    {
      id: 4,
      model: "Sienna",
      brand: "Toyota",
      year: 2022,
      transmission: "Automatic",
      category: "Family",
      seats: 8,
      price: 85,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Spacious and comfortable family van with hybrid efficiency. Features advanced safety systems, entertainment options, and flexible seating arrangements.",
      available: false,
    },
    {
      id: 5,
      model: "Express",
      brand: "Chevrolet",
      year: 2021,
      transmission: "Automatic",
      category: "Cargo",
      seats: 2,
      price: 75,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Reliable cargo van with powerful engine and substantial payload capacity. Well-suited for commercial use with its durable construction and practical features.",
      available: true,
    },
    {
      id: 6,
      model: "ProMaster",
      brand: "RAM",
      year: 2023,
      transmission: "Manual",
      category: "Cargo",
      seats: 3,
      price: 82,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Versatile cargo van with front-wheel drive and low load floor. Offers excellent maneuverability and cargo access through multiple entry points.",
      available: false,
    },
    {
      id: 7,
      model: "Carnival",
      brand: "Kia",
      year: 2023,
      transmission: "Automatic",
      category: "Family",
      seats: 8,
      price: 88,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Modern family van with SUV-inspired styling and premium features. Includes advanced tech, comfortable seating, and impressive safety credentials.",
      available: true,
    },
    {
      id: 8,
      model: "Metris",
      brand: "Mercedes-Benz",
      year: 2022,
      transmission: "Automatic",
      category: "Luxury",
      seats: 7,
      price: 129,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Premium passenger van with luxury appointments and refined driving experience. Combines comfort, style, and performance for discerning travelers.",
      available: false,
    },
    {
      id: 9,
      model: "Transit",
      brand: "Ford",
      year: 2023,
      transmission: "Automatic",
      category: "Cargo",
      seats: 3,
      price: 79,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Versatile full-size cargo van with multiple roof heights and lengths. Offers excellent utility, driver-assist features, and comfortable cabin.",
      available: true,
    },
    {
      id: 10,
      model: "NV200",
      brand: "Nissan",
      year: 2021,
      transmission: "Manual",
      category: "Compact",
      seats: 2,
      price: 55,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Compact cargo van with excellent fuel economy and city-friendly dimensions. Perfect for small businesses with its practical design and low operating costs.",
      available: true,
    },
    {
      id: 11,
      model: "Pacifica",
      brand: "Chrysler",
      year: 2023,
      transmission: "Automatic",
      category: "Luxury",
      seats: 7,
      price: 115,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Upscale family van with hybrid option and innovative features. Includes premium materials, advanced technology, and versatile seating configurations.",
      available: false,
    },
    {
      id: 12,
      model: "Grand Caravan",
      brand: "Dodge",
      year: 2020,
      transmission: "Automatic",
      category: "Family",
      seats: 7,
      price: 65,
      image: "/placeholder.svg?height=300&width=500",
      description:
        "Practical family van with Stow 'n Go seating and budget-friendly pricing. Offers reliable performance and flexible interior space for various needs.",
      available: true,
    },
  ]

  const [vans, setVans] = useState(allVans)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    brand: [],
    category: [],
    transmission: [],
    year: [],
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("price-low")

  // Extract unique values for filter options
  const brands = [...new Set(allVans.map((van) => van.brand))]
  const categories = [...new Set(allVans.map((van) => van.category))]
  const transmissions = [...new Set(allVans.map((van) => van.transmission))]
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

    if (filters.category.length > 0) {
      filteredVans = filteredVans.filter((van) => filters.category.includes(van.category))
    }

    if (filters.transmission.length > 0) {
      filteredVans = filteredVans.filter((van) => filters.transmission.includes(van.transmission))
    }

    if (filters.year.length > 0) {
      filteredVans = filteredVans.filter((van) => filters.year.includes(van.year))
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filteredVans.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filteredVans.sort((a, b) => b.price - a.price)
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
      category: [],
      transmission: [],
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
              <h3 className="filter-title">Category</h3>
              <div className="filter-options">
                {categories.map((category) => (
                  <label key={category} className="filter-option">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleFilter("category", category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Transmission</h3>
              <div className="filter-options">
                {transmissions.map((transmission) => (
                  <label key={transmission} className="filter-option">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={filters.transmission.includes(transmission)}
                      onChange={() => toggleFilter("transmission", transmission)}
                    />
                    {transmission}
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
              <h3 className="filter-title">Category</h3>
              <div className="filter-options">
                {categories.map((category) => (
                  <label key={category} className="filter-option">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleFilter("category", category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Transmission</h3>
              <div className="filter-options">
                {transmissions.map((transmission) => (
                  <label key={transmission} className="filter-option">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={filters.transmission.includes(transmission)}
                      onChange={() => toggleFilter("transmission", transmission)}
                    />
                    {transmission}
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
                          style={{width: "100%", height: "100%", objectFit: "contain" }}
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
                          <span className="van-card-price">${van.price}/day</span>
                        </div>

                        <div className="van-card-specs">
                          <div className="van-spec">
                            <span className="van-spec-label">Year:</span>
                            <span>{van.year}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Category:</span>
                            <span>{van.category}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Transmission:</span>
                            <span>{van.transmission}</span>
                          </div>
                          <div className="van-spec">
                            <span className="van-spec-label">Seats:</span>
                            <span>{van.seats}</span>
                          </div>
                        </div>

                        <div className="van-card-description">
                          <p>{van.description}</p>
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

