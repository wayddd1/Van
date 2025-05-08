import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, role, fetchUserProfile } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      // Check if we need to fetch the user profile
      if (token && !role && !user?.role) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('Error fetching profile in ProtectedRoute:', error);
        }
      }
      setIsValidating(false);
    };
    validateAuth();
  }, [token, role, user, fetchUserProfile]);

  if (isValidating) {
    return <LoadingSpinner />;
  }

  // If no token, redirect to login
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from multiple sources
  const userRole = role || user?.role || localStorage.getItem('userRole');
  console.log('ProtectedRoute - User role:', userRole);
  
  // Check if user has permission to access this route
  if (allowedRoles && userRole) {
    // Check for both formats of roles (with or without ROLE_ prefix)
    const normalizedUserRole = userRole.replace('ROLE_', '');
    const normalizedAllowedRoles = allowedRoles.map(r => r.replace('ROLE_', ''));
    
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.log(`Access denied: ${userRole} not in ${allowedRoles.join(', ')}`);
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;