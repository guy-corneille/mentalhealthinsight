
import React, { useState, useEffect } from 'react';
import { useStaff } from '@/services/staffService';
import StaffTable from './StaffTable';
import StaffModal from './modals/StaffModal';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import SearchInput from '@/components/common/SearchInput';
import PaginationControls from '@/components/common/PaginationControls';

const StaffList: React.FC = () => {
  // Fetch staff data
  const { data: allStaff, isLoading, isError, error } = useStaff();
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  
  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStaff, setFilteredStaff] = useState<Array<any>>([]);
  const [paginatedStaff, setPaginatedStaff] = useState<Array<any>>([]);
  
  // Pagination settings
  const itemsPerPage = 10;
  
  // Filter and paginate staff when data changes
  useEffect(() => {
    if (!allStaff) return;
    
    // Apply search filter
    const filtered = allStaff.filter(staff => 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.facility_name && staff.facility_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredStaff(filtered);
    
    // Reset to first page when filter changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [allStaff, searchQuery]);
  
  // Update paginated data when filtered data or page changes
  useEffect(() => {
    if (!filteredStaff) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredStaff.slice(startIndex, startIndex + itemsPerPage);
    
    setPaginatedStaff(paginatedItems);
  }, [filteredStaff, currentPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil((filteredStaff?.length || 0) / itemsPerPage);

  // Handle modal actions
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

  // Loading and error states
  if (isLoading) {
    return <div className="py-10 text-center">Loading staff members...</div>;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return <div className="text-red-500 py-10 text-center">Failed to load staff members: {errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Staff Members</h2>
        <Button onClick={handleAddStaff} className="bg-healthiq-600 hover:bg-healthiq-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
      
      {/* Search input */}
      <div className="w-full max-w-sm">
        <SearchInput
          placeholder="Search staff members..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Staff table with pagination */}
      <StaffTable 
        staff={paginatedStaff || []} 
        onEdit={handleEditStaff} 
        onView={handleViewStaff} 
      />
      
      {/* Show pagination controls if we have enough items */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Staff modal */}
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
