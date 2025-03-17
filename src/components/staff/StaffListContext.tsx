
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffMember, useStaff, useStaffByFacility } from '@/services/staffService';
import { useFacilities } from '@/services/facilityService';

interface StaffListContextType {
  staffData: StaffMember[] | undefined;
  filteredStaff: StaffMember[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  facilityFilter: string;
  setFacilityFilter: (facilityId: string) => void;
  facilities: Array<{ id: number; name: string }>;
  currentStaff: StaffMember | null;
  setCurrentStaff: (staff: StaffMember | null) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const StaffListContext = createContext<StaffListContextType | undefined>(undefined);

export const useStaffListContext = () => {
  const context = useContext(StaffListContext);
  if (!context) {
    throw new Error('useStaffListContext must be used within a StaffListProvider');
  }
  return context;
};

interface StaffListProviderProps {
  children: React.ReactNode;
  facilityId?: number;
  showFacilityFilter?: boolean;
}

export const StaffListProvider: React.FC<StaffListProviderProps> = ({ 
  children, 
  facilityId,
  showFacilityFilter = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>(facilityId ? facilityId.toString() : 'all');
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch staff using React Query
  const { data: allStaff, isLoading: isLoadingAllStaff, error: staffError } = useStaff();
  
  // If facilityId is provided, fetch staff for that facility
  const { data: facilityStaff, isLoading: isLoadingFacilityStaff } = useStaffByFacility(
    facilityId || (facilityFilter !== 'all' ? parseInt(facilityFilter) : 0)
  );

  // Fetch facilities for the filter dropdown
  const { data: facilities = [] } = useFacilities();
  
  // Determine which staff data to use
  const staffData = facilityId || facilityFilter !== 'all' ? facilityStaff : allStaff;
  const isLoading = facilityId || facilityFilter !== 'all' ? isLoadingFacilityStaff : isLoadingAllStaff;

  // Apply filters when search query changes
  useEffect(() => {
    if (!staffData) return;
    
    let results = [...staffData];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        (member.facility_name && member.facility_name.toLowerCase().includes(query))
      );
    }
    
    setFilteredStaff(results);
  }, [staffData, searchQuery]);

  // Initialize facility filter from prop if provided
  useEffect(() => {
    if (facilityId) {
      setFacilityFilter(facilityId.toString());
    }
  }, [facilityId]);

  const value = {
    staffData,
    filteredStaff,
    isLoading,
    error: staffError as Error | null,
    searchQuery,
    setSearchQuery,
    facilityFilter,
    setFacilityFilter,
    facilities,
    currentStaff,
    setCurrentStaff,
    isEditing,
    setIsEditing,
    modalOpen,
    setModalOpen
  };

  return (
    <StaffListContext.Provider value={value}>
      {children}
    </StaffListContext.Provider>
  );
};
