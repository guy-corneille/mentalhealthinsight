import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffListProvider, useStaffListContext } from './StaffListContext';
import { Spinner } from "@/components/ui/spinner";

// Inner component that uses the context
const StaffListContent: React.FC = () => {
  const navigate = useNavigate();
  const { 
    filteredStaff, 
    isLoading, 
    error,
    searchQuery,
    setSearchQuery,
    facilityFilter,
    setFacilityFilter
  } = useStaffListContext();
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  
  // Calculate pagination
  const totalPages = Math.ceil((filteredStaff?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStaff = filteredStaff?.slice(startIndex, endIndex) || [];

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
  const handleFacilityChange = (facilityId: string) => {
    setFacilityFilter(facilityId);
    setCurrentPage(1); // Reset to first page when changing facility
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading staff members...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-500 mb-2">Error loading staff members</p>
        <p className="text-muted-foreground">{(error as Error).message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  // Show empty state
  if (!filteredStaff?.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search staff members..."
            />
            <Select
              value={facilityFilter}
              onValueChange={handleFacilityChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {/* Facility options will be populated by the context */}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => navigate('/staff/add')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No staff members found</p>
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
            placeholder="Search staff members..."
          />
          <Select
            value={facilityFilter}
            onValueChange={handleFacilityChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {/* Facility options will be populated by the context */}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => navigate('/staff/add')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Facility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.facility_name || 'Unknown'}</TableCell>
                <TableCell>
                  <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{new Date(staff.join_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/staff/${staff.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/staff/edit/${staff.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(staff.id)}>
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

// Wrapper component that provides the context
const StaffList: React.FC = () => {
  return (
    <StaffListProvider showFacilityFilter={true}>
      <StaffListContent />
    </StaffListProvider>
  );
};

export default StaffList;
