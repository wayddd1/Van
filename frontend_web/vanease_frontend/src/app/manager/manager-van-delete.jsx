import React from "react";

const ManagerVanDelete = ({ vehicleId, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete vehicle");
      onDelete(vehicleId);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button className="delete-btn" onClick={handleDelete} title="Delete Vehicle">
      🗑 Delete
    </button>
  );
};

export default ManagerVanDelete;
