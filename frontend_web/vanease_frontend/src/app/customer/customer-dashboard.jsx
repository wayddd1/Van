import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customer-dashboard.css";

const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/vehicles/available");
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        setVehicles(data);
      } catch (err) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleBook = (vehicle) => {
    if (!isLoggedIn) {
      navigate("/register");
    } else {
      // Navigate to booking page with vehicle details in state
      navigate('/customer/booking', {
        state: {
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.brand} ${vehicle.model}`,
          imageUrl: vehicle.imageUrl || `/api/vehicles/${vehicle.id}/image`,
          ratePerDay: vehicle.ratePerDay
        }
      });
    }
  };

  return (
    <div className="parent customer-dashboard-grid">
      {/* Banner Section */}
      <div className="div3 banner-section">
        <div className="banner-content">
          <h1 className="banner-title">Welcome to VanEase</h1>
          <p className="banner-desc">Book your ideal van for any occasion. Browse our fleet and experience comfort and reliability!</p>
        </div>
      </div>
      {/* Vehicle List Section */}
      <div className="div4 vehicle-list-section">
        <h2>Available Vehicles</h2>
        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="no-vehicles">No vehicles available.</div>
        ) : (
          <div className="vehicle-list-cards">
            {vehicles.map((vehicle) => (
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
                  <div className="vehicle-rate"><span>Rate/Day:</span> ₱{vehicle.ratePerDay}</div>
                  <div className="vehicle-capacity"><span>Capacity:</span> {vehicle.capacity}</div>
                  <div className="vehicle-status"><span>Status:</span> {vehicle.status}</div>
                  <button className="book-btn" onClick={() => handleBook(vehicle)} disabled={vehicle.status !== "AVAILABLE"}>
                    {vehicle.status === "AVAILABLE" ? "Book Now" : "Not Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Feedback Section */}
      <div className="div5 feedback-section">
        <h2>Customer Feedback</h2>
        <div className="feedback-list">
          <div className="feedback-card">
            <div className="feedback-text">"Booking was so easy and the van was spotless. Highly recommended!"</div>
            <div className="feedback-author">- Maria S.</div>
          </div>
          <div className="feedback-card">
            <div className="feedback-text">"VanEase made our family trip comfortable and stress-free."</div>
            <div className="feedback-author">- John D.</div>
          </div>
          <div className="feedback-card">
            <div className="feedback-text">"Fast booking and friendly service. Will book again!"</div>
            <div className="feedback-author">- Grace L.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
