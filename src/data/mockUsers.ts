
import { MockUser, PendingUser } from '../types/auth';

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    username: 'superuser',
    email: 'super.user@mentalhealthiq.com',
    password: 'password123',
    role: 'superuser',
    displayName: 'Super User'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@mentalhealthiq.com',
    password: 'password123',
    role: 'admin',
    displayName: 'Admin User'
  },
  {
    id: '3',
    username: 'evaluator',
    email: 'evaluator@mentalhealthiq.com',
    password: 'password123',
    role: 'evaluator',
    displayName: 'Health Evaluator'
  },
  {
    id: '4',
    username: 'viewer',
    email: 'viewer@mentalhealthiq.com',
    password: 'password123',
    role: 'viewer',
    displayName: 'Viewer User'
  }
];

export const INITIAL_PENDING_USERS: PendingUser[] = [
  {
    id: '101',
    username: 'newadmin',
    email: 'new.admin@mentalhealthiq.com',
    password: 'password123',
    role: 'admin',
    displayName: 'New Admin',
    phoneNumber: '+1 (555) 123-4567',
    status: 'pending',
    requestDate: new Date('2023-09-15')
  },
  {
    id: '102',
    username: 'newevaluator',
    email: 'new.evaluator@mentalhealthiq.com',
    password: 'password123',
    role: 'evaluator',
    displayName: 'New Evaluator',
    phoneNumber: '+1 (555) 987-6543',
    status: 'pending',
    requestDate: new Date('2023-09-16')
  }
];
