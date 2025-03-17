
import React, { useState } from 'react';
import { useStaff } from '@/services/staffService';
import StaffTable from './StaffTable';
import StaffModal from './modals/StaffModal';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

const StaffList: React.FC = () => {
  const { data: staff, isLoading, isError, error } = useStaff();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [viewOnly, setViewOnly] = useState(false);

  if (isLoading) {
    return <LoadingState message="Loading staff members..." />;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return <ErrorState message={`Failed to load staff members: ${errorMessage}`} />;
  }

  const handleAddStaff = () => {
    setSelectedStaffId(null);
    setViewOnly(false);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    setViewOnly(false);
    setIsModalOpen(true);
  };

  const handleViewStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    setViewOnly(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = (success?: boolean, message?: string) => {
    setIsModalOpen(false);
    if (success && message) {
      toast.success(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Staff Members</h2>
        <Button onClick={handleAddStaff} className="bg-healthiq-600 hover:bg-healthiq-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <StaffTable 
        staff={staff || []} 
        onEdit={handleEditStaff} 
        onView={handleViewStaff} 
      />

      {isModalOpen && (
        <StaffModal
          staffId={selectedStaffId}
          viewOnly={viewOnly}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StaffList;
