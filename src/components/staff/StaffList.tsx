
import React, { useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StaffModal from './StaffModal';
import StaffSearchFilters from './StaffSearchFilters';
import StaffTable from './StaffTable';
import { StaffMember, Facility } from './types';

const StaffList: React.FC = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  
  // Mock staff data
  const [staff, setStaff] = useState<StaffMember[]>([
    { 
      id: 'S-1001', 
      name: 'Dr. Jean Mutabazi', 
      position: 'Lead Psychiatrist', 
      department: 'Psychiatry',
      facilityId: 1,
      facilityName: 'Central Hospital',
      joinDate: '2020-01-15',
      status: 'Active',
      qualifications: ['MD', 'Ph.D. Psychiatry', 'Clinical Psychology Cert.'],
      contact: {
        email: 'j.mutabazi@centralhospital.rw',
        phone: '+250 782 123 456'
      }
    },
    { 
      id: 'S-1002', 
      name: 'Dr. Marie Uwase', 
      position: 'Senior Psychologist', 
      department: 'Clinical Psychology',
      facilityId: 1,
      facilityName: 'Central Hospital',
      joinDate: '2021-03-22',
      status: 'Active',
      qualifications: ['Ph.D. Clinical Psychology', 'CBT Certification'],
      contact: {
        email: 'm.uwase@centralhospital.rw',
        phone: '+250 782 765 432'
      }
    },
    { 
      id: 'S-1003', 
      name: 'Joseph Ndayishimiye', 
      position: 'Mental Health Nurse', 
      department: 'Nursing',
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      joinDate: '2019-11-10',
      status: 'On Leave',
      qualifications: ['BSN', 'Mental Health Nursing Cert.'],
      contact: {
        email: 'j.ndayishimiye@eastern.rw',
        phone: '+250 788 234 567'
      }
    },
    { 
      id: 'S-1004', 
      name: 'Grace Ingabire', 
      position: 'Clinical Psychologist', 
      department: 'Psychiatry',
      facilityId: 3,
      facilityName: 'Northern Health Center',
      joinDate: '2022-02-15',
      status: 'Active',
      qualifications: ['MA Clinical Psychology', 'Trauma Therapy Cert.'],
      contact: {
        email: 'g.ingabire@northern.rw',
        phone: '+250 788 345 678'
      }
    },
    { 
      id: 'S-1005', 
      name: 'Emmanuel Hakizimana', 
      position: 'Psychiatric Nurse', 
      department: 'Nursing',
      facilityId: 4,
      facilityName: 'Southern Community Clinic',
      joinDate: '2021-05-10',
      status: 'Active',
      qualifications: ['BSN', 'Mental Health Nursing Diploma'],
      contact: {
        email: 'e.hakizimana@southern.rw',
        phone: '+250 788 456 789'
      }
    },
  ]);

  // Get unique facilities for filter dropdown
  const facilities: Facility[] = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Health Center' },
    { id: 4, name: 'Southern Community Clinic' },
    { id: 5, name: 'Western Regional Hospital' },
  ];

  // Filter staff by search term and facility
  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFacility = facilityFilter === 'all' || s.facilityId.toString() === facilityFilter;
    
    return matchesSearch && matchesFacility;
  });

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setCurrentStaff(staff);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== staffId));
      toast({
        title: "Staff Removed",
        description: "The staff member has been removed successfully.",
      });
    }
  };

  const handleToggleStatus = (staffId: string) => {
    setStaff(staff.map(s => {
      if (s.id === staffId) {
        const newStatus = s.status === 'Active' ? 'On Leave' : 'Active';
        return { ...s, status: newStatus as 'Active' | 'On Leave' | 'Former' };
      }
      return s;
    }));
  };

  const handleSaveStaff = (staffData: Partial<StaffMember>) => {
    if (isEditing && currentStaff) {
      // Update existing staff
      setStaff(staff.map(s => 
        s.id === currentStaff.id ? { ...currentStaff, ...staffData } as StaffMember : s
      ));
      toast({
        title: "Staff Updated",
        description: "Staff information has been updated successfully.",
      });
    } else {
      // Add new staff
      const newStaff: StaffMember = {
        id: `S-${1000 + staff.length + 1}`,
        name: staffData.name || '',
        position: staffData.position || '',
        department: staffData.department || '',
        facilityId: staffData.facilityId || 0,
        facilityName: staffData.facilityName || '',
        joinDate: staffData.joinDate || new Date().toISOString().split('T')[0],
        status: staffData.status || 'Active',
        qualifications: staffData.qualifications || [],
        contact: staffData.contact || { email: '', phone: '' },
      };
      
      setStaff([...staff, newStaff]);
      toast({
        title: "Staff Added",
        description: "New staff member has been added successfully.",
      });
    }
    
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <StaffSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          facilityFilter={facilityFilter}
          setFacilityFilter={setFacilityFilter}
          facilities={facilities}
        />
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            className="bg-healthiq-600 hover:bg-healthiq-700"
            onClick={handleAddStaff}
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>
      
      <StaffTable
        staff={filteredStaff}
        onEdit={handleEditStaff}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteStaff}
      />

      <StaffModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        staffData={currentStaff}
        isEditing={isEditing}
        onSave={handleSaveStaff}
      />
    </div>
  );
};

export default StaffList;
