import { useAuth, UserRole } from '@/contexts/AuthContext';

type Permission = 'view_dashboard' | 'view_analytics' | 'manage_evaluations' | 'manage_data';

const rolePermissions: Record<UserRole, Permission[]> = {
  viewer: ['view_dashboard', 'view_analytics'],
  evaluator: ['view_dashboard', 'view_analytics', 'manage_evaluations'],
  admin: ['view_dashboard', 'view_analytics', 'manage_data'],
  superuser: ['view_dashboard', 'view_analytics', 'manage_evaluations', 'manage_data'],
};

/**
 * Hook for handling user authorization
 * 
 * Currently simplified to allow all actions without restrictions.
 * Will be updated later with proper role-based authorization.
 */
export const useAuthorization = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) ?? false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const canAccessRoute = (path: string): boolean => {
    if (!user) return false;

    // Always allow these routes
    if (path === '/dashboard' || path === '/profile') return true;

    // Route-based permissions
    const routePermissions: Record<string, Permission> = {
      '/analytics': 'view_analytics',
      '/evaluation-framework': 'manage_evaluations',
      '/evaluation-setup': 'manage_evaluations',
      '/data-setup': 'manage_data',
    };

    const requiredPermission = routePermissions[path];
    if (!requiredPermission) return true; // If no permission required, allow access

    return hasPermission(requiredPermission);
  };

  // Returns all possible permissions for display purposes
  const getUserPermissions = (): string[] => {
    return [
      'manage:all',
      'manage:facilities',
      'manage:staff', 
      'manage:configurations',
      'manage:users',
      'approve:users',
      'manage:assessments',
      'manage:audits', 
      'manage:criteria',
      'manage:patients',
      'view:dashboard',
      'view:reports',
      'view:facilities',
      'view:patients'
    ];
  };

  // Returns user-friendly permission labels
  const getAccessLevelLabel = (permission: string): string => {
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
    
    return accessLevelLabels[permission] || permission;
  };

  // Returns formatted permissions for UI display
  const getFormattedUserPermissions = (): {permission: string, label: string}[] => {
    const permissions = getUserPermissions();
    return permissions.map(permission => ({
      permission,
      label: getAccessLevelLabel(permission)
    }));
  };

  return {
    hasPermission,
    hasRole,
    canAccessRoute,
    role: 'admin' as UserRole, // Always return admin role for now
    getUserPermissions,
    getAccessLevelLabel,
    getFormattedUserPermissions
  };
};
