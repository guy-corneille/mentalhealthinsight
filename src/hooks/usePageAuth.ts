import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasRequiredRole, UserRole } from '@/utils/roleUtils';

/**
 * Simple page authorization hook
 * Checks if user is authenticated and has required role
 * Redirects to login or dashboard if unauthorized
 */
export const usePageAuth = (requiredRole: UserRole, fallbackPath: string = '/dashboard') => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    
    // Check if user has required role
    if (!hasRequiredRole(user.role, requiredRole)) {
      console.log(`User role ${user.role} does not have access to ${requiredRole} level, redirecting to ${fallbackPath}`);
      navigate(fallbackPath);
      return;
    }
    
    console.log(`User ${user.username} (${user.role}) authorized for ${requiredRole} level`);
  }, [user, isAuthenticated, requiredRole, navigate, fallbackPath]);
};

/**
 * Hook to check if user can access a specific feature
 */
export const useFeatureAuth = (feature: string, fallbackPath: string = '/dashboard') => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    // Import canAccessFeature here to avoid circular dependency
    const { canAccessFeature } = require('@/utils/roleUtils');
    
    if (!canAccessFeature(user.role, feature)) {
      console.log(`User ${user.username} (${user.role}) cannot access feature: ${feature}`);
      navigate(fallbackPath);
      return;
    }
  }, [user, isAuthenticated, feature, navigate, fallbackPath]);
}; 