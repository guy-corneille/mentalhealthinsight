
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StaffList from '@/components/staff/StaffList';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import StaffModal from '@/components/staff/StaffModal';
import { StaffMemberDisplay } from '@/services/staffService';

const Staff: React.FC = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [editStaffMember, setEditStaffMember] = useState<StaffMemberDisplay | null>(null);
  
  const handleEditStaff = (staff: StaffMemberDisplay) => {
    setEditStaffMember(staff);
  };
  
  const handleCloseModal = () => {
    setIsAddStaffModalOpen(false);
    setEditStaffMember(null);
  };

  const handleSaveStaff = (staffData: Partial<StaffMemberDisplay>) => {
    // This function will be implemented by StaffModal's internal logic
    // We just need to close the modal after saving
    handleCloseModal();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage healthcare staff members and their facility assignments.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsAddStaffModalOpen(true)}
            className="bg-healthiq-600 hover:bg-healthiq-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
        
        <StaffList 
          showFacilityFilter={true} 
        />
        
        {/* Staff Modal for Add/Edit */}
        {(isAddStaffModalOpen || editStaffMember) && (
          <StaffModal 
            open={isAddStaffModalOpen || !!editStaffMember}
            onOpenChange={handleCloseModal}
            staffData={editStaffMember}
            isEditing={!!editStaffMember}
            onSave={handleSaveStaff}
          />
        )}
      </div>
    </Layout>
  );
};

export default Staff;
