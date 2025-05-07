import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./manager-van-add.css";

const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC"];
const transmissionTypes = ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"];
const statusTypes = ["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "RESERVED"];

const ManagerVanUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch vehicle");
        const data = await res.json();
        setForm({
          plateNumber: data.plateNumber,
          brand: data.brand,
          model: data.model,
          year: data.year,
          ratePerDay: data.ratePerDay,
          capacity: data.capacity,
          fuelType: data.fuelType,
          transmission: data.transmission,
          availability: data.availability,
          status: data.status,
          description: data.description || "",
        });
        if (data.imageSize) {
          setImagePreview(`/api/vehicles/${id}/image`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const body = {
        ...form,
        year: Number(form.year),
        ratePerDay: form.ratePerDay,
        capacity: Number(form.capacity),
        fuelType: form.fuelType.toUpperCase(),
        transmission: form.transmission.toUpperCase(),
        availability: Boolean(form.availability),
        status: form.status.toUpperCase(),
      };
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update vehicle");
      // If image is changed, upload it
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const imgRes = await fetch(`/api/vehicles/${id}/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!imgRes.ok) throw new Error("Vehicle updated but image upload failed");
      }
      setSuccess("Vehicle updated successfully!");
      setTimeout(() => navigate("/manager/van-list"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form) return <div className="loading">Loading...</div>;
  if (!form) return <div className="error">{error || "Vehicle not found."}</div>;

  return (
    <div className="manager-van-add-container redesigned-form">
      <h2 className="form-title">Update Vehicle</h2>
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
        <button type="submit" className="submit-btn redesigned-btn" disabled={loading}>{loading ? "Saving..." : "Update Vehicle"}</button>
        {success && <div className="success-msg redesigned-success">{success}</div>}
        {error && <div className="error-msg redesigned-error">{error}</div>}
      </form>
    </div>
  );
};

export default ManagerVanUpdate;
