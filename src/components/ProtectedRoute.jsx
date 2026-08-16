// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // Added loading state for better UX

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Only check if user is authenticated (logged in)
  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content (no payment check needed)
  return children;
};

export default ProtectedRoute;
