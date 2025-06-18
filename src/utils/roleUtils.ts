export type UserRole = 'viewer' | 'evaluator' | 'admin' | 'superuser';

// Simple role hierarchy - higher number = more permissions
const roleHierarchy = {
  viewer: 1,
  evaluator: 2, 
  admin: 3,
  superuser: 4
};

/**
 * Check if user has required role or higher
 */
export const hasRequiredRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Get role hierarchy level
 */
export const getRoleLevel = (role: UserRole): number => {
  return roleHierarchy[role];
};

/**
 * Check if user can access a specific feature
 */
export const canAccessFeature = (userRole: UserRole, feature: string): boolean => {
  const featurePermissions: Record<string, UserRole> = {
    // Dashboard - everyone can access
    'dashboard': 'viewer',
    
    // View features
    'view:reports': 'viewer',
    'view:facilities': 'viewer', 
    'view:patients': 'viewer',
    'view:staff': 'viewer',
    'view:assessments': 'viewer',
    'view:audits': 'viewer',
    
    // Management features
    'manage:assessments': 'evaluator',
    'manage:audits': 'evaluator',
    'manage:patients': 'evaluator',
    
    // Admin features
    'manage:facilities': 'admin',
    'manage:staff': 'admin',
    'manage:users': 'admin',
    'manage:criteria': 'admin',
    
    // Superuser features
    'manage:all': 'superuser',
    'system:config': 'superuser'
  };
  
  const requiredRole = featurePermissions[feature];
  if (!requiredRole) return true; // If no permission defined, allow access
  
  return hasRequiredRole(userRole, requiredRole);
}; 