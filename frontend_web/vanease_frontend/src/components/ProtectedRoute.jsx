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

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = role || user?.role;

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    console.log(`Access denied: ${userRole} not in ${allowedRoles.join(', ')}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;