import React, { useState } from "react";
import "./manager-van-add.css";

// Hardcoded enums (MUST match backend)
const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC"];
const transmissionTypes = ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"];
const statusTypes = ["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "RESERVED"];

const ManagerVanAdd = () => {
  const [form, setForm] = useState({
    plateNumber: "",
    brand: "",
    model: "",
    year: "",
    ratePerDay: "",
    capacity: "",
    fuelType: fuelTypes[0],
    transmission: transmissionTypes[0],
    availability: true,
    status: statusTypes[0],
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // 1. Create vehicle (with image) using multipart/form-data
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("plateNumber", form.plateNumber);
      formData.append("brand", form.brand);
      formData.append("model", form.model);
      formData.append("year", String(form.year));
      formData.append("ratePerDay", String(form.ratePerDay));
      formData.append("capacity", String(form.capacity));
      formData.append("fuelType", form.fuelType.toUpperCase());
      formData.append("transmission", form.transmission.toUpperCase());
      formData.append("availability", String(form.availability));
      formData.append("status", form.status.toUpperCase());
      formData.append("description", form.description);
      if (image) formData.append("image", image);

      const vehicleRes = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type manually!
        },
        body: formData,
      });
      if (!vehicleRes.ok) {
        let errMsg = "Failed to save vehicle data.";
        try {
          const errJson = await vehicleRes.json();
          if (errJson && errJson.error) errMsg = errJson.error;
        } catch {}
        throw new Error(errMsg);
      }
      setSuccess("Vehicle added successfully!");
      setForm({
        plateNumber: "",
        brand: "",
        model: "",
        year: "",
        ratePerDay: "",
        capacity: "",
        fuelType: fuelTypes[0],
        transmission: transmissionTypes[0],
        availability: true,
        status: statusTypes[0],
        description: "",
      });
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-van-add-container redesigned-form">
      <h2 className="form-title">Add New Vehicle</h2>
      <form className="manager-van-add-form redesigned-form-card" onSubmit={handleSubmit}>
        <div className="form-flex-row">
          <div className="form-col">
            <div className="form-row"><label>Plate Number</label><input name="plateNumber" value={form.plateNumber} onChange={handleChange} required /></div>
            <div className="form-row"><label>Brand</label><input name="brand" value={form.brand} onChange={handleChange} required /></div>
            <div className="form-row"><label>Model</label><input name="model" value={form.model} onChange={handleChange} required /></div>
            <div className="form-row"><label>Year</label><input name="year" type="number" min="1900" max={new Date().getFullYear() + 1} value={form.year} onChange={handleChange} required /></div>
            <div className="form-row"><label>Rate Per Day</label><input name="ratePerDay" type="number" step="0.01" value={form.ratePerDay} onChange={handleChange} required /></div>
            <div className="form-row"><label>Capacity</label><input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} required /></div>
          </div>
          <div className="form-col">
            <div className="form-row"><label>Fuel Type</label><select name="fuelType" value={form.fuelType} onChange={handleChange}>{fuelTypes.map((ft) => (<option key={ft} value={ft}>{ft}</option>))}</select></div>
            <div className="form-row"><label>Transmission</label><select name="transmission" value={form.transmission} onChange={handleChange}>{transmissionTypes.map((tt) => (<option key={tt} value={tt}>{tt}</option>))}</select></div>
            <div className="form-row"><label>Availability</label><input name="availability" type="checkbox" checked={form.availability} onChange={handleChange} /></div>
            <div className="form-row"><label>Status</label><select name="status" value={form.status} onChange={handleChange}>{statusTypes.map((st) => (<option key={st} value={st}>{st}</option>))}</select></div>
            <div className="form-row"><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} /></div>
            <div className="form-row">
              <label>Vehicle Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (<img src={imagePreview} alt="Preview" className="image-preview" />)}
            </div>
          </div>
        </div>
        <button type="submit" className="submit-btn redesigned-btn" disabled={loading}>{loading ? "Saving..." : "Add Vehicle"}</button>
        {success && <div className="success-msg redesigned-success">{success}</div>}
        {error && <div className="error-msg redesigned-error">{error}</div>}
      </form>
    </div>
  );
};

export default ManagerVanAdd;
