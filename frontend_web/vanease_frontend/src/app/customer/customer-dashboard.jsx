// src/app/customer-dashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { role } = useAuth();  // Get the role from the context

  return (
    <div>
      <h1>Customer Dashboard</h1>
      <p>Welcome, dear customer!</p>
    </div>
  );
};

export default CustomerDashboard;
