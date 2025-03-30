
/**
 * Facilities Module
 * 
 * This module exports all facility-related components, services, and utilities.
 * It serves as the main entry point for importing facility functionality.
 */

// Export view components
export { default as FacilityGridView } from './views/FacilityGridView';
export { default as FacilityListView } from './views/FacilityListView';
export { default as FacilityTableView } from './views/FacilityTableView';

// Export facility components
export { default as FacilityList } from '@/components/facilities/FacilityList';
export { default as FacilitySearchFilters } from '@/components/facilities/FacilitySearchFilters';
export { default as FacilityForm } from '@/components/facilities/FacilityForm';
export { default as EmptyFacilityState } from '@/components/facilities/EmptyFacilityState';

// Re-export services and hooks from facilityService
export * from '@/services/facilityService';
