
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StaffMemberDisplay } from '@/services/staffService';
import { useStaffForm } from '../hooks/useStaffForm';
import StaffModalForm from './StaffModalForm';

interface StaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffData: StaffMemberDisplay | null;
  isEditing: boolean;
  onSave: (staffData: Partial<StaffMemberDisplay>) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({ 
  open, 
  onOpenChange, 
  staffData, 
  isEditing, 
  onSave 
}) => {
  const {
    formData,
    newQualification,
    setNewQualification,
    facilities,
    handleInputChange,
    handleFacilityChange,
    handleStatusChange,
    addQualification,
    removeQualification,
    validateForm,
    prepareDataForSubmission
  } = useStaffForm(staffData, open);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for backend and save
    const staffPayload = prepareDataForSubmission();
    onSave(staffPayload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details for this staff member.' : 'Fill in the details to add a new staff member.'}
            </DialogDescription>
          </DialogHeader>
          
          <StaffModalForm
            formData={formData}
            newQualification={newQualification}
            setNewQualification={setNewQualification}
            handleInputChange={handleInputChange}
            handleFacilityChange={handleFacilityChange}
            handleStatusChange={handleStatusChange}
            addQualification={addQualification}
            removeQualification={removeQualification}
            facilities={facilities}
          />
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffModal;
