
import React, { useState, useEffect } from 'react';
import { usePatients, Patient, useDeletePatient, useFacilities } from '@/services/patientService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusIcon, Edit, Trash, Eye, FilterIcon } from "lucide-react";
import { toast } from "sonner";
import PatientDetails from './PatientDetails';
import SearchInput from '@/components/common/SearchInput';
import PaginationControls from '@/components/common/PaginationControls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientListProps {
  facilityId?: number;
}

const PatientList: React.FC<PatientListProps> = ({ facilityId }) => {
  // Data fetching
  const { data: allPatients, isLoading, isError, error } = usePatients();
  const { data: facilities = [] } = useFacilities();
  const deletePatientMutation = useDeletePatient();

  // Modal state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>(facilityId ? facilityId.toString() : 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [paginatedPatients, setPaginatedPatients] = useState<Patient[]>([]);

  // Pagination settings
  const itemsPerPage = 10;

  // Apply facility filter and search query
  useEffect(() => {
    if (!allPatients) return;

    // First filter by facility if facilityFilter is provided
    let patients = facilityFilter !== 'all'
      ? allPatients.filter(patient => patient.facility === parseInt(facilityFilter))
      : allPatients;

    // Then apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      patients = patients.filter(patient =>
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.gender.toLowerCase().includes(query) ||
        patient.status.toLowerCase().includes(query) ||
        (patient.facility_name && patient.facility_name.toLowerCase().includes(query))
      );
    }

    setFilteredPatients(patients);

    // Reset to first page when filter changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [allPatients, searchQuery, facilityFilter]);

  // Update paginated data when filtered data or page changes
  useEffect(() => {
    if (!filteredPatients) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

    setPaginatedPatients(paginatedItems);
  }, [filteredPatients, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil((filteredPatients?.length || 0) / itemsPerPage);

  // Modal handlers
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsViewOnly(false);
    setIsDetailsOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewOnly(false);
    setIsDetailsOpen(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewOnly(true);
    setIsDetailsOpen(true);
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (confirm(`Are you sure you want to delete patient ${patient.first_name} ${patient.last_name}?`)) {
      try {
        await deletePatientMutation.mutateAsync(patient.id);
        toast.success(`Patient deleted successfully`);
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error(`Failed to delete patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleCloseDetails = (success?: boolean, message?: string) => {
    setIsDetailsOpen(false);
    if (success && message) {
      toast.success(message);
    }
  };

  // Loading and error states
  if (isLoading) {
    return <div className="flex justify-center p-8">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-healthiq-600 border-t-transparent"></div>
        <p>Loading patients...</p>
      </div>
    </div>;
  }

  if (isError) {
    return <div className="bg-red-50 p-4 rounded-md text-red-800">
      <p>Error loading patients: {error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Patients</h2>
        <Button onClick={handleAddPatient} className="bg-healthiq-600 hover:bg-healthiq-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search patients..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="w-full sm:w-64">
          <Select value={facilityFilter} onValueChange={setFacilityFilter}>
            <SelectTrigger className="bg-muted/50 border-none focus-visible:ring-1">
              <SelectValue placeholder="Filter by facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities.map(facility => (
                <SelectItem key={facility.id} value={facility.id.toString()}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedPatients.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell className="font-medium">{`${patient.first_name} ${patient.last_name}`}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                    <Badge variant={
                      patient.status === 'Active' ? 'default' :
                        patient.status === 'Discharged' ? 'secondary' :
                          'outline'
                    }>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.facility_name || `Facility ${patient.facility}`}</TableCell>
                  <TableCell>{new Date(patient.registration_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePatient(patient)}
                          disabled={deletePatientMutation.isPending}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          {deletePatientMutation.isPending ? 'Deleting...' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Show pagination controls if we have enough items */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {isDetailsOpen && (
        <PatientDetails
          patient={selectedPatient}
          viewOnly={isViewOnly}
          onClose={handleCloseDetails}
          isOpen={isDetailsOpen}
        />
      )}
    </div>
  );
};

export default PatientList;
