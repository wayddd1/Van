import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, role, fetchUserProfile } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  
  // Check localStorage directly as a fallback
  const localStorageToken = localStorage.getItem('token');
  
  // Parse user from localStorage if available
  const localStorageUser = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;
  
  // Use either context token or localStorage token
  const effectiveToken = token || localStorageToken;

  useEffect(() => {
    const validateAuth = async () => {
      // Check if we need to fetch the user profile
      if (effectiveToken && (!role && !user?.role)) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('Error fetching profile in ProtectedRoute:', error);
        }
      }
      setIsValidating(false);
    };
    validateAuth();
  }, [effectiveToken, role, user, fetchUserProfile]);

  if (isValidating) {
    return <LoadingSpinner />;
  }

  // If no token from any source, redirect to login
  // Check if we have a token from any source
  if (!effectiveToken) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from multiple sources
  const userRole = role || user?.role || localStorageUser?.role || localStorage.getItem('userRole');
  console.log('ProtectedRoute - User role:', userRole);
  
  // Check if user has permission to access this route
  if (allowedRoles && userRole) {
    // Check for both formats of roles (with or without ROLE_ prefix)
    const normalizedUserRole = userRole.replace('ROLE_', '').toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.replace('ROLE_', '').toUpperCase());
    
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.log(`Access denied: ${userRole} not in ${allowedRoles.join(', ')}`);
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  } else if (allowedRoles && !userRole) {
    // If we have a token but no role, try to get the user profile
    // This is a fallback for when the user has a token but no role information
    fetchUserProfile().catch(err => {
      console.error('Failed to fetch user profile for role check:', err);
    });
  }

  return children;
};

export default ProtectedRoute;