import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaHistory, FaArrowLeft } from "react-icons/fa";
import "./customer-profile.css";

const CustomerProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Check localStorage directly as a fallback
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  // Parse user from localStorage if available
  const localStorageUser = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Use fetch API directly to avoid any interceptor issues
      console.log('Fetching profile with token:', token?.substring(0, 15) + '...');
      
      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Profile fetch failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Profile data response:', data);
      setProfileData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data. Please try again later.");
      // Use cached user data as fallback
      if (user) {
        console.log('Using context user data as fallback');
        setProfileData(user);
      } else if (localStorageUser) {
        console.log('Using localStorage user data as fallback');
        setProfileData(localStorageUser);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't redirect here, let the ProtectedRoute handle that
    if (token) {
      fetchProfileData();
    } else {
      // If no token but we have user data in localStorage, use that
      if (localStorageUser) {
        console.log('No token, using localStorage user data');
        setProfileData(localStorageUser);
        setLoading(false);
      }
    }
  }, [token]); // Only depend on token to avoid infinite loops

  if (authLoading || loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  // If we have an error but we have fallback data, continue to show the profile
  if (error && !profileData) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  // Use either the fetched profile data, context user, or localStorage user
  const displayData = profileData || user || localStorageUser || {};

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>
        
        <div className="profile-avatar">
          <div className="avatar-circle">
            {displayData?.firstName?.charAt(0) || displayData?.name?.charAt(0) || 'U'}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="info-group">
            <h2>Personal Information</h2>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">
                {displayData?.firstName ? `${displayData?.firstName} ${displayData?.lastName || ''}` : displayData?.name || 'User'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{displayData?.email || 'Not available'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{displayData?.phone || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">
                {displayData?.role || "CUSTOMER"}
              </span>
            </div>
          </div>

          <div className="info-group">
            <h2>Account Information</h2>
            <div className="info-row">
              <span className="info-label">User ID:</span>
              <span className="info-value">{displayData?.id || 'Not available'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Status:</span>
              <span className="info-value status-active">Active</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {displayData?.createdAt 
                  ? new Date(displayData.createdAt).toLocaleDateString() 
                  : "Not available"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="action-button history-btn"
            onClick={() => navigate("/customer/booking-history")}
          >
            <FaHistory className="button-icon" /> View Booking History
          </button>
          <button 
            className="action-button back-btn"
            onClick={() => navigate("/customer/dashboard")}
          >
            <FaArrowLeft className="button-icon" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
