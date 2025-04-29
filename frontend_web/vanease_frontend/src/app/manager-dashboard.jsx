// src/app/manager-dashboard.jsx
import React from 'react';
import ManagerNavbar from '../components/ManagerNavbar';  // Import the ManagerNavbar component
import { useAuth } from '../context/AuthContext';

const ManagerDashboard = () => {
  const { user, role } = useAuth();  // Get the user and role from the context

  return (
    <div>
      {/* Use the ManagerNavbar component instead of regular Navbar */}
      <ManagerNavbar />
      <div className="container">
        <h1>Manager Dashboard</h1>
        <p>Welcome, manager!</p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
