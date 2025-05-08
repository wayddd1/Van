import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerVanDelete from "./manager-van-delete";
import { axiosInstance } from "../../context/AuthContext";
import "./manager-van-list.css";

const getImageUrl = (vehicle) => {
  // If backend returns imageUrl, use it. Otherwise, build from id if image exists.
  if (vehicle.imageUrl) return vehicle.imageUrl;
  if (vehicle.imageSize && vehicle.id) return `/api/vehicles/${vehicle.id}/image`;
  return null;
};

const ManagerVanList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(null);
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/vehicles/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);
  
  const toggleVehicleAvailability = async (vehicleId, newAvailability) => {
    setStatusUpdating(vehicleId);
    try {
      const response = await axiosInstance.patch(
        `/api/vehicles/${vehicleId}/availability?available=${newAvailability}`,
        {}, // Empty body for PATCH request
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.status === 200) {
        // Update the local state with the updated vehicle
        setVehicles(vehicles.map(vehicle => 
          vehicle.id === vehicleId ? response.data : vehicle
        ));
      }
    } catch (err) {
      console.error("Error updating vehicle availability:", err);
      alert("Failed to update vehicle availability. Please try again.");
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div className="manager-van-list-container">
      <div className="list-header-row">
        <h2>Vehicle List</h2>
        <button className="add-vehicle-btn" onClick={() => navigate("/manager/van-add")}>+ Add Vehicle</button>
      </div>
      {loading && <div className="loading">Loading vehicles...</div>}
      {error && <div className="error">{error}</div>}
      <div className="vehicle-card-list">
        {vehicles.length === 0 && !loading && !error && (
          <div className="no-vehicles">No vehicles found.</div>
        )}
        {vehicles.map((vehicle) => (
          <div className="vehicle-card professional" key={vehicle.id}>
            <div className="vehicle-image-section">
              {getImageUrl(vehicle) ? (
                <img src={getImageUrl(vehicle)} alt="Vehicle" className="vehicle-image" />
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
              <div className="vehicle-status">
                <span>Status:</span> 
                <span className={`status-badge status-${vehicle.status?.toLowerCase()}`}>
                  {vehicle.status}
                </span>
              </div>
              <div className="vehicle-availability">
                <span>Availability:</span>
                <div className="availability-toggle">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={vehicle.availability} 
                      onChange={() => toggleVehicleAvailability(vehicle.id, !vehicle.availability)}
                      disabled={statusUpdating === vehicle.id}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="availability-label">
                    {vehicle.availability ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
              {vehicle.description && (
                <div className="vehicle-desc">{vehicle.description}</div>
              )}
              <div className="vehicle-actions">
                <button className="update-btn" onClick={() => navigate(`/manager/van-update/${vehicle.id}`)}>
                  ✏️ Update
                </button>
                <ManagerVanDelete vehicleId={vehicle.id} onDelete={(id) => setVehicles((prev) => prev.filter(v => v.id !== id))} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerVanList;
