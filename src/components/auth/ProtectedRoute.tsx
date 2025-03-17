
import React from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// This component previously handled authentication protection
// Now it simply renders children without any auth checks
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Log information about the route access for debugging
  console.log(`Accessing route: ${location.pathname} - No auth required`);
  
  // Simply render children without any protection
  return <>{children}</>;
};

export default ProtectedRoute;
