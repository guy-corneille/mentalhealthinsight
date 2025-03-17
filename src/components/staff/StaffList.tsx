
import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  SearchIcon,
  FilterIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  UserXIcon,
  UserCheckIcon,
  PencilIcon,
  BuildingIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StaffModal from './StaffModal';
import { useToast } from "@/hooks/use-toast";
import { 
  useStaff, 
  useStaffByFacility, 
  useDeleteStaff,
  useUpdateStaff, 
  useCreateStaff,
  StaffMemberDisplay
} from '@/services/staffService';
import { useFacilities } from '@/services/facilityService';
import { Spinner } from "@/components/ui/spinner";

interface StaffListProps {
  showFacilityFilter?: boolean;
  facilityId?: number;
}

const StaffList: React.FC<StaffListProps> = ({ showFacilityFilter = false, facilityId }) => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMemberDisplay | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>(facilityId ? facilityId.toString() : 'all');
  const [filteredStaff, setFilteredStaff] = useState<StaffMemberDisplay[]>([]);

  // Fetch staff using React Query
  const { data: allStaff, isLoading: isLoadingAllStaff, error: staffError } = useStaff();
  
  // If facilityId is provided, fetch staff for that facility
  const { data: facilityStaff, isLoading: isLoadingFacilityStaff } = useStaffByFacility(
    facilityId || (facilityFilter !== 'all' ? parseInt(facilityFilter) : 0)
  );

  // Fetch facilities for the filter dropdown
  const { data: facilities = [] } = useFacilities();
  
  // Mutation for deleting a staff member
  const deleteStaffMutation = useDeleteStaff();
  
  // Mutation for creating a staff member
  const createStaffMutation = useCreateStaff();

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
        member.facilityName.toLowerCase().includes(query)
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

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMemberDisplay) => {
    setCurrentStaff(staff);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteStaff = (staffId: number) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      deleteStaffMutation.mutate(staffId, {
        onSuccess: () => {
          toast({
            title: "Staff Removed",
            description: "The staff member has been removed successfully.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete staff member: ${(error as Error).message}`,
            variant: "destructive",
          });
        }
      });
    }
  };
  
  const handleToggleStatus = (member: StaffMemberDisplay) => {
    const newStatus = member.status === 'Active' ? 'On Leave' : 'Active';
    
    // Create a new update mutation for this staff member
    const updateStaffMutation = useUpdateStaff(member.id);
    
    // Update the staff member's status
    updateStaffMutation.mutate(
      { status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: "Status Updated",
            description: `Staff status changed to ${newStatus}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error", 
            description: `Failed to update status: ${(error as Error).message}`,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleSaveStaff = (staffData: Partial<StaffMemberDisplay>) => {
    if (isEditing && currentStaff) {
      // Update existing staff
      const updateStaffMutation = useUpdateStaff(currentStaff.id);
      updateStaffMutation.mutate(staffData, {
        onSuccess: () => {
          setModalOpen(false);
          toast({
            title: "Staff Updated",
            description: "Staff information has been updated successfully."
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update staff: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      });
    } else {
      // Create new staff
      createStaffMutation.mutate(staffData, {
        onSuccess: () => {
          setModalOpen(false);
          toast({
            title: "Staff Added",
            description: "New staff member has been added successfully."
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to add staff: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading staff...</p>
      </div>
    );
  }

  // Show error state
  if (staffError) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-500 mb-2">Error loading staff</p>
        <p className="text-muted-foreground">{(staffError as Error).message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex items-center relative w-full sm:w-64">
            <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
            <Input 
              placeholder="Search staff..." 
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {showFacilityFilter && (
            <div className="w-full sm:w-64">
              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger className="bg-muted/50 border-none focus-visible:ring-1">
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities?.map(facility => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="border-none bg-muted/50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button 
            className="bg-healthiq-600 hover:bg-healthiq-700"
            onClick={handleAddStaff}
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <UserIcon className="h-10 w-10 mb-2 opacity-20" />
                      <p>No staff members found</p>
                      {(searchQuery || facilityFilter !== 'all') && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchQuery('');
                            setFacilityFilter('all');
                          }}
                          className="mt-2"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BuildingIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                        {member.facilityName}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={
                        member.status === 'Active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                        member.status === 'On Leave' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                        'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      }>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditStaff(member)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(member)}>
                            <UserCheckIcon className="h-4 w-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStaff(member.id)}
                            className="text-rose-600"
                          >
                            <UserXIcon className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <StaffModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        staffData={currentStaff}
        isEditing={isEditing}
        onSave={handleSaveStaff}
      />
    </div>
  );
};

export default StaffList;
