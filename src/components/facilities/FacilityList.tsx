
import React, { useState, useEffect } from 'react';
import { BuildingIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

import FacilityGridView from './views/FacilityGridView';
import FacilityListView from './views/FacilityListView';
import FacilityTableView from './views/FacilityTableView';
import FacilitySearchFilters from './FacilitySearchFilters';
import EmptyFacilityState from './EmptyFacilityState';

interface Facility {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: number;
  lastAudit: string;
  score: number;
}

const FacilityList: React.FC = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  
  const facilities = [
    { 
      id: 1, 
      name: 'Central Hospital', 
      location: 'Kigali, Rwanda', 
      type: 'Hospital', 
      capacity: 250, 
      lastAudit: '2023-04-15',
      score: 92
    },
    { 
      id: 2, 
      name: 'Eastern District Clinic', 
      location: 'Rwamagana, Rwanda', 
      type: 'Clinic', 
      capacity: 75, 
      lastAudit: '2023-03-22',
      score: 78
    },
    { 
      id: 3, 
      name: 'Northern Community Center', 
      location: 'Musanze, Rwanda', 
      type: 'Community Center', 
      capacity: 45, 
      lastAudit: '2023-05-10',
      score: 65
    },
    { 
      id: 4, 
      name: 'Southern District Hospital', 
      location: 'Huye, Rwanda', 
      type: 'Hospital', 
      capacity: 180, 
      lastAudit: '2023-02-28',
      score: 84
    },
    { 
      id: 5, 
      name: 'Western Mental Health Center', 
      location: 'Rubavu, Rwanda', 
      type: 'Clinic', 
      capacity: 60, 
      lastAudit: '2023-04-05',
      score: 71
    },
    { 
      id: 6, 
      name: 'Nyagatare Health Clinic', 
      location: 'Nyagatare, Rwanda', 
      type: 'Clinic', 
      capacity: 40, 
      lastAudit: '2023-05-18',
      score: 88
    },
  ];

  // Apply filters and sorting
  useEffect(() => {
    let results = [...facilities];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(facility => 
        facility.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(facility => 
        facility.name.toLowerCase().includes(query) ||
        facility.location.toLowerCase().includes(query) ||
        facility.type.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      // Get values to compare
      let valueA: string | number = a[sortColumn as keyof Facility];
      let valueB: string | number = b[sortColumn as keyof Facility];
      
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

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      // Delete logic would normally be an API call
      toast({
        title: "Facility Deleted",
        description: `${name} has been removed successfully.`,
      });
      
      // Filter out the deleted facility (this would normally be handled by refetching)
      const updatedFacilities = filteredFacilities.filter(f => f.id !== id);
      setFilteredFacilities(updatedFacilities);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
  };

  const hasFilters = searchQuery !== '' || typeFilter !== 'all';

  return (
    <div className="space-y-6 animate-fade-in">
      <FacilitySearchFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onClearFilters={handleClearFilters}
      />
      
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
