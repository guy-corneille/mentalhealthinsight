
import React from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component for route protection (currently disabled)
 * 
 * This component will be updated later to implement proper
 * role-based authentication. For now, it simply renders
 * the children without any authentication checks.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Log information about the route access for debugging
  console.log(`Accessing route: ${location.pathname} - Authorization checks disabled`);
  
  // Simply render children without any protection
  // Will be updated later with proper role-based authentication
  return <>{children}</>;
};

export default ProtectedRoute;
