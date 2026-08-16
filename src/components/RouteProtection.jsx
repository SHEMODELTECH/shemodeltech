// components/RouteProtection.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Automatic route redirects based on authentication status
export const RouteRedirect = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect logged in users from landing pages to their home
    if (currentUser && (location.pathname === '/' || location.pathname === '/career')) {
      navigate('/community', { replace: true });
    }
    
    // Redirect logged out users from protected pages to landing
    if (!currentUser && ['/community', '/dashboard', '/career/dashboard'].includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

// Protected route wrapper for authenticated pages
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-orange-400 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting (if not authenticated)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-orange-400 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
};

// Navigation helper hook for active states
export const useActiveNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getNavLinkClass = (path, baseClass = "", activeClass = "text-orange-400") => {
    return `${baseClass} ${isActive(path) ? activeClass : ''}`;
  };

  return {
    isActive,
    getNavLinkClass,
    currentPath: pathname
  };
};
