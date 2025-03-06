
import { useAuth, UserRole } from '../contexts/AuthContext';

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  superuser: ['manage:all'],
  admin: ['manage:facilities', 'manage:staff', 'manage:configurations'],
  auditor: ['manage:audits', 'manage:criteria:audit', 'view:reports'],
  clinician: ['manage:patients', 'manage:assessments', 'manage:criteria:clinical', 'view:dashboard'],
  viewer: ['view:dashboard', 'view:reports', 'view:facilities', 'view:patients']
};

export const useAuthorization = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role] || [];
    if (userPermissions.includes('manage:all')) return true;
    
    return userPermissions.includes(permission);
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return route === '/login';
    
    // Common routes accessible by all authenticated users
    if (['/dashboard'].includes(route)) return true;
    
    // Route specific permissions
    switch (route) {
      case '/facilities':
      case '/facilities/add':
      case '/facilities/edit':
        return hasPermission('manage:facilities') || hasPermission('view:facilities');
      
      case '/staff':
        return hasPermission('manage:staff');
      
      case '/patients':
        return hasPermission('manage:patients') || hasPermission('view:patients');
      
      case '/assessments':
        return hasPermission('manage:assessments');
      
      case '/audits':
        return hasPermission('manage:audits');
      
      case '/criteria':
        return hasPermission('manage:criteria:audit') || 
               hasPermission('manage:criteria:clinical');
      
      case '/reports':
        return hasPermission('view:reports');
      
      default:
        return false;
    }
  };

  return {
    hasPermission,
    canAccessRoute,
    role: user?.role
  };
};
