
import React from 'react';
import { StaffMemberDisplay, useCreateStaff, useUpdateStaff } from '@/services/staffService';
import { useToast } from "@/hooks/use-toast";
import StaffModal from './modals/StaffModal';
import { StaffListProvider, useStaffListContext } from './StaffListContext';
import StaffFilters from './StaffFilters';
import StaffTable from './StaffTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

interface StaffListProps {
  showFacilityFilter?: boolean;
  facilityId?: number;
}

const StaffListContent: React.FC = () => {
  const { toast } = useToast();
  const { isLoading, error, currentStaff, isEditing, modalOpen, setModalOpen } = useStaffListContext();
  
  // Mutation for creating a staff member
  const createStaffMutation = useCreateStaff();

  const handleSaveStaff = (staffData: Partial<StaffMemberDisplay>) => {
    if (isEditing && currentStaff) {
      // Update existing staff
      const updateStaffMutation = useUpdateStaff(currentStaff.id);
      updateStaffMutation.mutate(staffData, {
        onSuccess: () => {
          setModalOpen(false);
          toast({
            title: "Staff Updated",
            description: "Staff information has been updated successfully."
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update staff: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      // Create new staff
      createStaffMutation.mutate(staffData, {
        onSuccess: () => {
          setModalOpen(false);
          toast({
            title: "Staff Added",
            description: "New staff member has been added successfully."
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to add staff: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <StaffFilters showFacilityFilter={true} />
      <StaffTable />
      
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

const StaffList: React.FC<StaffListProps> = ({ showFacilityFilter = false, facilityId }) => {
  return (
    <StaffListProvider facilityId={facilityId} showFacilityFilter={showFacilityFilter}>
      <StaffListContent />
    </StaffListProvider>
  );
};

export default StaffList;
