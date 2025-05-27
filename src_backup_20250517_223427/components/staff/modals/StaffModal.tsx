
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StaffModalForm from './StaffModalForm';
import { useStaffMember, useCreateStaffMember, useUpdateStaffMember, StaffMember } from '@/services/staffService';

interface StaffModalProps {
  staffId: string | null;
  viewOnly?: boolean;
  onClose: (success?: boolean, message?: string) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({ staffId, viewOnly = false, onClose }) => {
  const { data: staffMember, isLoading, isError, error } = useStaffMember(staffId || '');
  const createStaffMutation = useCreateStaffMember();
  const updateStaffMutation = useUpdateStaffMember(staffId || '');
  
  const isCreating = !staffId;
  const title = isCreating ? 'Add Staff Member' : viewOnly ? 'Staff Member Details' : 'Edit Staff Member';
  
  const handleSubmit = async (data: Partial<StaffMember>) => {
    try {
      if (isCreating) {
        await createStaffMutation.mutateAsync(data);
        onClose(true, 'Staff member added successfully');
      } else if (staffId) {
        await updateStaffMutation.mutateAsync(data);
        onClose(true, 'Staff member updated successfully');
      }
    } catch (error) {
      console.error('Error saving staff member:', error);
      onClose(false, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const isSubmitting = createStaffMutation.isPending || updateStaffMutation.isPending;

  // Show loading or error states when fetching staff data
  let content;
  if (isLoading && !isCreating) {
    content = <div className="py-10 text-center">Loading staff member data...</div>;
  } else if (isError && !isCreating) {
    content = (
      <div className="py-10 text-center text-red-600">
        Error loading staff data: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  } else {
    content = (
      <StaffModalForm
        staffMember={staffMember || null}
        viewOnly={viewOnly}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => onClose()}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default StaffModal;
