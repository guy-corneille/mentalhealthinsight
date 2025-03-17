
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

  // Fetch facilities for the filter dropdown
  const { data: facilities = [], isLoading: facilitiesLoading } = useFacilities();
  
  // Determine which staff data to use based on filter
  const { data: allStaff, isLoading: isLoadingAllStaff, error: allStaffError } = useStaff();
  
  // If a specific facility is selected, fetch staff for that facility
  const selectedFacilityId = facilityFilter !== 'all' ? parseInt(facilityFilter) : undefined;
  const { 
    data: facilityStaff, 
    isLoading: isLoadingFacilityStaff,
    error: facilityStaffError
  } = useStaffByFacility(selectedFacilityId as number, {
    // Only run this query if we have a facility selected
    enabled: facilityFilter !== 'all',
  });
  
  // Determine which staff data to use
  const staffData = facilityFilter !== 'all' ? facilityStaff : allStaff;
  const isLoading = (facilityFilter !== 'all' ? isLoadingFacilityStaff : isLoadingAllStaff) || facilitiesLoading;
  const error = facilityFilter !== 'all' ? facilityStaffError : allStaffError;

  // Apply filters when data or search query changes
  useEffect(() => {
    if (!staffData) {
      setFilteredStaff([]);
      return;
    }
    
    // Apply search filter
    let results = [...staffData];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(member => 
        (member.name && member.name.toLowerCase().includes(query)) || 
        (member.position && member.position.toLowerCase().includes(query)) || 
        (member.department && member.department.toLowerCase().includes(query)) ||
        (member.facility_name && member.facility_name.toLowerCase().includes(query)) ||
        (member.email && member.email.toLowerCase().includes(query))
      );
    }
    
    console.log("Filtered staff:", results.length, "from total:", staffData.length);
    setFilteredStaff(results);
  }, [staffData, searchQuery]);

  // Debug when facility filter changes
  useEffect(() => {
    console.log("Facility filter changed to:", facilityFilter);
  }, [facilityFilter]);

  const value = {
    staffData,
    filteredStaff,
    isLoading,
    error: error as Error | null,
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
