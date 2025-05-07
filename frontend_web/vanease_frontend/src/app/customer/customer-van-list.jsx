import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customer-van-list.css";

const initialFilters = {
  priceMin: "",
  priceMax: "",
  fuelType: "",
  capacity: "",
  transmission: "",
  search: ""
};

const CustomerVanList = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/vehicles/available");
        const data = await res.json();
        setVehicles(data);
        setFiltered(data);
      } catch {
        setVehicles([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    let result = vehicles;
    if (filters.priceMin)
      result = result.filter(v => parseFloat(v.ratePerDay) >= parseFloat(filters.priceMin));
    if (filters.priceMax)
      result = result.filter(v => parseFloat(v.ratePerDay) <= parseFloat(filters.priceMax));
    if (filters.fuelType)
      result = result.filter(v => v.fuelType === filters.fuelType);
    if (filters.capacity)
      result = result.filter(v => String(v.capacity) === String(filters.capacity));
    if (filters.transmission)
      result = result.filter(v => v.transmission === filters.transmission);
    if (filters.search)
      result = result.filter(v =>
        v.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.model.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.plateNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    setFiltered(result);
  }, [filters, vehicles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="customer-van-list-container">
      <h2>Browse Vans</h2>
      <div className="van-filters">
        <input name="search" placeholder="Search (brand/model/plate)" value={filters.search} onChange={handleFilterChange} />
        <input name="priceMin" type="number" placeholder="Min Price" value={filters.priceMin} onChange={handleFilterChange} />
        <input name="priceMax" type="number" placeholder="Max Price" value={filters.priceMax} onChange={handleFilterChange} />
        <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange}>
          <option value="">All Fuel Types</option>
          <option value="GASOLINE">Gasoline</option>
          <option value="DIESEL">Diesel</option>
          <option value="ELECTRIC">Electric</option>
        </select>
        <select name="capacity" value={filters.capacity} onChange={handleFilterChange}>
          <option value="">All Capacities</option>
          {[...new Set(vehicles.map(v => v.capacity))].map(cap => (
            <option key={cap} value={cap}>{cap}</option>
          ))}
        </select>
        <select name="transmission" value={filters.transmission} onChange={handleFilterChange}>
          <option value="">All Transmissions</option>
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </select>
      </div>
      {loading ? (
        <div className="loading">Loading vehicles...</div>
      ) : filtered.length === 0 ? (
        <div className="no-vehicles">No vehicles match the filters.</div>
      ) : (
        <div className="vehicle-list-cards">
          {filtered.map(vehicle => (
            <div className="vehicle-card customer-view" key={vehicle.id}>
              <div className="vehicle-img-wrap">
                {vehicle.imageUrl || vehicle.imageSize ? (
                  <img src={vehicle.imageUrl || `/api/vehicles/${vehicle.id}/image`} alt="Vehicle" className="vehicle-image" />
                ) : (
                  <div className="vehicle-image-placeholder">No Image</div>
                )}
              </div>
              <div className="vehicle-details-section">
                <div className="vehicle-title">{vehicle.brand} {vehicle.model} <span className="vehicle-year">({vehicle.year})</span></div>
                <div className="vehicle-plate"><span>Plate:</span> {vehicle.plateNumber}</div>
                <div className="vehicle-rate"><span>Rate/Day:</span> ₱{vehicle.ratePerDay}</div>
                <div className="vehicle-capacity"><span>Capacity:</span> {vehicle.capacity}</div>
                <div className="vehicle-fuel"><span>Fuel:</span> {vehicle.fuelType}</div>
                <div className="vehicle-trans"><span>Transmission:</span> {vehicle.transmission}</div>
                <div className="vehicle-status"><span>Status:</span> {vehicle.status}</div>
                {vehicle.description && (
                  <div className="vehicle-desc">{vehicle.description}</div>
                )}
                <button className="book-btn" disabled={vehicle.status !== "AVAILABLE"} onClick={() => navigate('/customer/booking', {
                  state: {
                    vehicleId: vehicle.id,
                    vehicleName: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
                    ratePerDay: vehicle.ratePerDay,
                    imageUrl: vehicle.imageUrl || `/api/vehicles/${vehicle.id}/image`
                  }
                })}>
                  {vehicle.status === "AVAILABLE" ? "Book Now" : "Not Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerVanList;
