import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffTable from './StaffTable';
import { Spinner } from '@/components/ui/spinner';
import PaginationControls from '@/components/common/PaginationControls';
import { StaffListProvider, useStaffListContext } from './StaffListContext';
import StaffFilters from './StaffFilters';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

// Inner component that uses the context
const StaffListContent: React.FC = () => {
  const navigate = useNavigate();
  const { 
    filteredStaff, 
    isLoading, 
    error
  } = useStaffListContext();
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedStaff, setPaginatedStaff] = useState<Array<any>>([]);
  
  // Pagination settings
  const itemsPerPage = 10;
  
  // Update paginated data when filtered data or page changes
  useEffect(() => {
    if (!filteredStaff) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredStaff.slice(startIndex, startIndex + itemsPerPage);
    
    setPaginatedStaff(paginatedItems);
  }, [filteredStaff, currentPage]);
  
  // Calculate total pages
  const totalPages = Math.ceil((filteredStaff?.length || 0) / itemsPerPage);

  // Handle staff actions
  const handleEditStaff = (staffId: string) => {
    navigate(`/staff/edit/${staffId}`);
  };

  const handleViewStaff = (staffId: string) => {
    navigate(`/staff/edit/${staffId}`);
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

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return <div className="text-red-500 py-10 text-center">Failed to load staff members: {errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      <StaffFilters showFacilityFilter={true} />
        <Button onClick={() => navigate('/staff/add')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
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
    </div>
  );
};

// Wrapper component that provides the context
const StaffList: React.FC = () => {
  return (
    <StaffListProvider showFacilityFilter={true}>
      <StaffListContent />
    </StaffListProvider>
  );
};

export default StaffList;
