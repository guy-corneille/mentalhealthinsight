
import React, { useState, useEffect } from 'react';
import { useStaff } from '@/services/staffService';
import StaffTable from './StaffTable';
import StaffModal from './modals/StaffModal';
import { Spinner } from '@/components/ui/spinner';
import SearchInput from '@/components/common/SearchInput';
import PaginationControls from '@/components/common/PaginationControls';
import { StaffListProvider } from './StaffListContext';
import StaffFilters from './StaffFilters';

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
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading staff members...</p>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return <div className="text-red-500 py-10 text-center">Failed to load staff members: {errorMessage}</div>;
  }

  return (
    <StaffListProvider showFacilityFilter={true}>
      <div className="space-y-4">
        <StaffFilters showFacilityFilter={true} />

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
    </StaffListProvider>
  );
};

export default StaffList;
