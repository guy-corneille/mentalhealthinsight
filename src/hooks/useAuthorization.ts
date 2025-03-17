
import { UserRole } from '../types/auth';

/**
 * Hook for handling user authorization
 * 
 * Currently simplified to allow all actions without restrictions.
 * Will be updated later with proper role-based authorization.
 */
export const useAuthorization = () => {
  // Permission checker - currently always returns true
  // Will be updated with proper role-based checks
  const hasPermission = (permission: string): boolean => {
    console.log(`Permission check for: ${permission} - Authorization checks disabled`);
    return true;
  };

  // Route access checker - currently always returns true
  // Will be updated with proper role-based checks
  const canAccessRoute = (route: string): boolean => {
    console.log(`Route access check for: ${route} - Authorization checks disabled`);
    return true;
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
    canAccessRoute,
    role: 'admin' as UserRole, // Always return admin role for now
    getUserPermissions,
    getAccessLevelLabel,
    getFormattedUserPermissions
  };
};
