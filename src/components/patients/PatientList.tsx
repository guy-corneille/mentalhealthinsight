import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients, Patient, useDeletePatient } from '@/services/patientService';
import { useFacilities } from '@/services/facilityService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusIcon, Edit, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import SearchInput from '@/components/common/SearchInput';
import PaginationControls from '@/components/common/PaginationControls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FacilityFilter from '@/components/common/FacilityFilter';
import { ScrollArea } from "@/components/ui/scroll-area";

interface PatientListProps {
  facilityId?: number;
}

const PatientList: React.FC<PatientListProps> = ({ facilityId }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<number | undefined>(facilityId);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  // Fetch all patients and facilities
  const { data: patientsData, isLoading, error } = usePatients(1, 1000); // Fetch all patients
  const { data: facilities } = useFacilities();

  // Delete patient mutation
  const deletePatientMutation = useDeletePatient();

  // Apply filters when data or search query changes
  useEffect(() => {
    if (!patientsData?.results) return;

    let results = [...patientsData.results];

    // Apply facility filter
    if (selectedFacility) {
      results = results.filter(patient => patient.facility === selectedFacility);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(patient => 
        patient.id.toLowerCase().includes(query) ||
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(query) ||
        patient.gender.toLowerCase().includes(query) ||
        patient.status.toLowerCase().includes(query) ||
        (patient.facility_name && patient.facility_name.toLowerCase().includes(query))
      );
    }

    setFilteredPatients(results);
  }, [patientsData, searchQuery, selectedFacility]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle facility filter change
  const handleFacilityChange = (facilityId: number | undefined) => {
    setSelectedFacility(facilityId);
    setCurrentPage(1); // Reset to first page when changing facility
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle patient deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatientMutation.mutateAsync(id);
        toast.success('Patient deleted successfully');
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-500 mb-2">Error loading patients</p>
        <p className="text-muted-foreground">{(error as Error).message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  // Show empty state
  if (!filteredPatients.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search patients..."
            />
            <FacilityFilter
              selectedFacility={selectedFacility}
              onFacilityChange={handleFacilityChange}
            />
          </div>
          <Button onClick={() => navigate('/patients/add')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No patients found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SearchInput
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search patients..."
          />
          <FacilityFilter
            selectedFacility={selectedFacility}
            onFacilityChange={handleFacilityChange}
          />
        </div>
        <Button onClick={() => navigate('/patients/add')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
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
                  <TableCell>{`${patient.first_name} ${patient.last_name}`}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                <TableCell>{patient.facility_name || 'Unknown'}</TableCell>
                <TableCell>{new Date(patient.registration_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/patients/${patient.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/patients/edit/${patient.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(patient.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </ScrollArea>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PatientList;
