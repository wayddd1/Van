import React from "react";
import "./manager-dashboard.css";

const dummyStats = {
  totalVehicles: 42,
  activeRentals: 18,
  pendingApprovals: 5,
  totalRevenue: 12450.75,
};

const recentBookings = [
  { id: 1, customer: "John Doe", vehicle: "Toyota Hiace", date: "2025-05-06", status: "Pending" },
  { id: 2, customer: "Jane Smith", vehicle: "Nissan Urvan", date: "2025-05-06", status: "Approved" },
  { id: 3, customer: "Alice Lee", vehicle: "Ford Transit", date: "2025-05-05", status: "Rejected" },
  { id: 4, customer: "Bob Brown", vehicle: "Hyundai Starex", date: "2025-05-05", status: "Pending" },
];

const ManagerDashboard = () => {
  return (
    <div className="manager-dashboard-container">
      <h1 className="dashboard-title">Manager Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-label">Total Vehicles</div>
          <div className="card-value">{dummyStats.totalVehicles}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-label">Active Rentals</div>
          <div className="card-value">{dummyStats.activeRentals}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-label">Pending Approvals</div>
          <div className="card-value">{dummyStats.pendingApprovals}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-label">Total Revenue</div>
          <div className="card-value">₱{dummyStats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-btn">Manage Vehicles</button>
        <button className="action-btn">View Reports</button>
        <button className="action-btn">Handle Customer Feedback</button>
      </div>

      <div className="dashboard-table-section">
        <h2 className="section-title">Recent Booking Requests</h2>
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customer}</td>
                  <td>{booking.vehicle}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
