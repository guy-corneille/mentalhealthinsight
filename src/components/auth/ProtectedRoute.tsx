
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthorization } from '@/hooks/useAuthorization';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { canAccessRoute } = useAuthorization();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to access this page.",
      });
    } else if (!isLoading && isAuthenticated && !canAccessRoute(location.pathname)) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      });
    }
  }, [isLoading, isAuthenticated, location.pathname, canAccessRoute, toast]);

  // Still loading, don't redirect yet
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but not authorized for this route
  if (!canAccessRoute(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
