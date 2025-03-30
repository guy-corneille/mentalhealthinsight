
/**
 * Mock Data Module
 * 
 * This module contains deprecated mock data used for development and testing.
 * These mock data objects are only used when API data is unavailable.
 * 
 * @deprecated Use API services instead for real data
 */

import { toast } from 'sonner';

// Console warning about using mock data
const warnAboutMockData = () => {
  console.warn('Using mock data instead of API data. This is deprecated. Update your code to use the API services.');
};

// Mock users data
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    department: 'IT',
    status: 'active',
    lastLogin: '2023-05-15T10:30:00',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'evaluator',
    department: 'Clinical',
    status: 'active',
    lastLogin: '2023-05-14T14:45:00',
  },
];

// Mock staff data
export const mockStaff = [
  {
    id: 'S-1001',
    name: 'Dr. Alice Johnson',
    position: 'Psychiatrist',
    department: 'Psychiatry',
    facility: 1,
    facility_name: 'Northern Hospital 1',
    join_date: '2021-03-15',
    status: 'Active',
    email: 'alice.johnson@example.com',
    phone: '+1234567890',
    qualifications: [
      { id: 1, qualification: 'MD' },
      { id: 2, qualification: 'Board Certified in Psychiatry' }
    ]
  },
  {
    id: 'S-1002',
    name: 'Robert Wilson',
    position: 'Therapist',
    department: 'Therapy',
    facility: 1,
    facility_name: 'Northern Hospital 1',
    join_date: '2020-07-22',
    status: 'Active',
    email: 'robert.wilson@example.com',
    phone: '+1987654321',
    qualifications: [
      { id: 3, qualification: 'MSW' },
      { id: 4, qualification: 'Licensed Clinical Social Worker' }
    ]
  }
];

// Mock patients data
export const mockPatients = [
  {
    id: 'P-1001',
    first_name: 'Michael',
    last_name: 'Brown',
    date_of_birth: '1985-08-12',
    gender: 'M',
    address: '123 Main St, City A',
    phone: '+1122334455',
    email: 'michael.brown@example.com',
    national_id: 'ID12345678',
    status: 'Active',
    facility: 1,
    facility_name: 'Northern Hospital 1',
    registration_date: '2022-02-15',
    emergency_contact_name: 'Emma Brown',
    emergency_contact_phone: '+1567890123',
    notes: 'Regular therapy sessions'
  },
  {
    id: 'P-1002',
    first_name: 'Sarah',
    last_name: 'Davis',
    date_of_birth: '1990-04-25',
    gender: 'F',
    address: '456 Oak Ave, City B',
    phone: '+1213141516',
    email: 'sarah.davis@example.com',
    national_id: 'ID87654321',
    status: 'Active',
    facility: 2,
    facility_name: 'Eastern Clinic 1',
    registration_date: '2022-03-10',
    emergency_contact_name: 'James Davis',
    emergency_contact_phone: '+1617181920',
    notes: 'Monthly check-ins'
  }
];

// Helper functions to get mock data
export const getMockStaff = () => {
  warnAboutMockData();
  return Promise.resolve(mockStaff);
};

export const getMockPatients = () => {
  warnAboutMockData();
  return Promise.resolve(mockPatients);
};
