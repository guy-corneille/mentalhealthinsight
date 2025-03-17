
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

import FacilityGridView from './views/FacilityGridView';
import FacilityListView from './views/FacilityListView';
import FacilityTableView from './views/FacilityTableView';
import FacilitySearchFilters from './FacilitySearchFilters';
import EmptyFacilityState from './EmptyFacilityState';
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { useFacilities, useDeleteFacility, Facility } from '@/services/facilityService';

const FacilityList: React.FC = () => {
  // Hook for displaying toast notifications
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for view and filtering options
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  
  // Fetch facilities using React Query
  const { data: facilities, isLoading, error } = useFacilities();
  
  // Mutation for deleting a facility
  const deleteFacilityMutation = useDeleteFacility();

  // Apply filters and sorting when facilities, search query, or filters change
  useEffect(() => {
    if (!facilities) return;
    
    let results = [...facilities];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(facility => 
        facility.type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(facility => 
        facility.name.toLowerCase().includes(query) ||
        facility.location?.toLowerCase().includes(query) ||
        facility.type?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      // Get values to compare
      let valueA: string | number = a[sortColumn as keyof Facility] as string | number || '';
      let valueB: string | number = b[sortColumn as keyof Facility] as string | number || '';
      
      // Convert to strings for string comparison if applicable
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      // Compare values
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredFacilities(results);
  }, [facilities, searchQuery, typeFilter, sortColumn, sortDirection]);

  // Handle sorting when column header is clicked
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set as ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle facility deletion
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      // Call the delete mutation
      deleteFacilityMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Facility Deleted",
            description: `${name} has been removed successfully.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete ${name}. Please try again.`,
            variant: "destructive",
          });
          console.error("Delete error:", error);
        }
      });
    }
  };

  // Clear all applied filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
  };

  // Check if any filters are applied
  const hasFilters = searchQuery !== '' || typeFilter !== 'all';

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading facilities...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-500 mb-2">Error loading facilities</p>
        <p className="text-muted-foreground">{(error as Error).message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <FacilitySearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onClearFilters={handleClearFilters}
        />
        
        <Button 
          onClick={() => navigate('/facilities/add')}
          className="bg-healthiq-600 hover:bg-healthiq-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>
      
      {filteredFacilities.length === 0 ? (
        <EmptyFacilityState 
          hasFilters={hasFilters} 
          onClearFilters={handleClearFilters} 
        />
      ) : viewMode === 'grid' ? (
        <FacilityGridView 
          facilities={filteredFacilities} 
          onDelete={handleDelete} 
        />
      ) : viewMode === 'list' ? (
        <FacilityListView 
          facilities={filteredFacilities} 
          onDelete={handleDelete} 
        />
      ) : (
        <FacilityTableView 
          facilities={filteredFacilities} 
          onDelete={handleDelete}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      )}
    </div>
  );
};

export default FacilityList;
