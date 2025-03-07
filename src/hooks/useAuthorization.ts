
import { useAuth, UserRole } from '../contexts/AuthContext';

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  superuser: ['manage:all'],
  admin: ['manage:facilities', 'manage:staff', 'manage:configurations', 'manage:users', 'approve:users'],
  evaluator: ['manage:assessments', 'manage:audits', 'manage:criteria', 'view:reports', 'manage:patients'],
  viewer: ['view:dashboard', 'view:reports', 'view:facilities', 'view:patients']
};

// Define a lookup for UI access level display names
const accessLevelLabels: Record<string, string> = {
  'manage:all': 'Full System Access',
  'manage:facilities': 'Manage Facilities',
  'manage:staff': 'Manage Staff',
  'manage:users': 'Manage User Accounts',
  'approve:users': 'Approve New Users',
  'manage:configurations': 'System Configuration',
  'manage:assessments': 'Manage Assessments',
  'manage:audits': 'Manage Audits', 
  'manage:criteria': 'Manage Assessment Criteria',
  'manage:patients': 'Manage Patients',
  'view:dashboard': 'View Dashboard',
  'view:reports': 'View Reports',
  'view:facilities': 'View Facilities',
  'view:patients': 'View Patients'
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
    if (['/dashboard', '/profile'].includes(route)) return true;
    
    // Route specific permissions
    const path = route.split('?')[0]; // Remove query parameters for route matching
    
    switch (path) {
      case '/facilities':
      case '/facilities/add':
      case '/facilities/edit':
        return hasPermission('manage:facilities') || hasPermission('view:facilities');
      
      case '/staff':
        return hasPermission('manage:staff') || hasPermission('manage:all');
      
      case '/patients':
        return hasPermission('manage:patients') || hasPermission('view:patients');
      
      case '/assessments':
        return hasPermission('manage:assessments');
      
      case '/audits':
        return hasPermission('manage:audits');
      
      case '/criteria':
        return hasPermission('manage:criteria');
      
      case '/reports':
        return hasPermission('view:reports');
      
      case '/user-management':
        return hasPermission('manage:users') || hasPermission('approve:users');
      
      default:
        // For nested routes like /facilities/1, /staff/edit, etc.
        if (path.startsWith('/facilities/')) return hasPermission('manage:facilities') || hasPermission('view:facilities');
        if (path.startsWith('/staff/')) return hasPermission('manage:staff') || hasPermission('manage:all');
        if (path.startsWith('/patients/')) return hasPermission('manage:patients') || hasPermission('view:patients');
        return false;
    }
  };

  const getUserPermissions = (): string[] => {
    if (!user) return [];
    return rolePermissions[user.role] || [];
  };

  const getAccessLevelLabel = (permission: string): string => {
    return accessLevelLabels[permission] || permission;
  };

  const getFormattedUserPermissions = (): {permission: string, label: string}[] => {
    const permissions = getUserPermissions();
    return permissions.map(permission => ({
      permission,
      label: getAccessLevelLabel(permission)
    }));
  };

  return {
    hasPermission,
    canAccessRoute,
    role: user?.role,
    getUserPermissions,
    getAccessLevelLabel,
    getFormattedUserPermissions
  };
};
