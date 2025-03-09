
export type UserRole = 'superuser' | 'admin' | 'evaluator' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  displayName?: string;
  phoneNumber?: string;
}

export interface PendingUser extends Omit<User, 'id'> {
  id: string;
  password?: string; // Make password optional
  status: 'pending';
  requestDate: Date;
}

export interface UserRegistration {
  displayName: string;
  username: string;
  email: string;
  role: UserRole;
  password: string;
  phoneNumber: string;
}

export interface MockUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  displayName: string;
}

export interface AuthContextType {
  user: User | null;
  pendingUsers: PendingUser[];
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  registerUser: (user: UserRegistration) => Promise<PendingUser>;
  approveUser: (userId: string) => Promise<PendingUser>;
  rejectUser: (userId: string) => Promise<PendingUser>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
