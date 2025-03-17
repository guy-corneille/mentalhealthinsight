
import { UserRole } from '../types/auth';

// This hook handles user authorization logic
// It's been simplified to allow all actions without restrictions
export const useAuthorization = () => {
  // Mock permission checker - always returns true
  const hasPermission = (permission: string): boolean => {
    console.log(`Permission check for: ${permission} - Always allowed`);
    return true;
  };

  // Mock route access checker - always returns true
  const canAccessRoute = (route: string): boolean => {
    console.log(`Route access check for: ${route} - Always allowed`);
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
    role: 'admin' as UserRole, // Always return admin role
    getUserPermissions,
    getAccessLevelLabel,
    getFormattedUserPermissions
  };
};
