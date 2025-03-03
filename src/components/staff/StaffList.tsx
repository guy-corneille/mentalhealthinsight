
import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  SearchIcon,
  PlusIcon,
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

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  facilityId: number;
  facilityName: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Former';
  qualifications: string[];
  contact: {
    email: string;
    phone: string;
  };
}

interface StaffListProps {
  showFacilityFilter?: boolean;
  facilityId?: number;
}

const StaffList: React.FC<StaffListProps> = ({ showFacilityFilter = false, facilityId }) => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState<string>(facilityId ? facilityId.toString() : 'all');
  
  // Mock facilities data
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Community Center' },
    { id: 4, name: 'Southern District Hospital' },
  ];
  
  // Mock staff data
  const [staff, setStaff] = useState<StaffMember[]>([
    { 
      id: 'S-1001', 
      name: 'Dr. Jean Mutabazi', 
      position: 'Lead Psychiatrist', 
      department: 'Psychiatry',
      facilityId: 1,
      facilityName: 'Central Hospital',
      joinDate: '2020-01-15',
      status: 'Active',
      qualifications: ['MD', 'Ph.D. Psychiatry', 'Clinical Psychology Cert.'],
      contact: {
        email: 'j.mutabazi@centralhospital.rw',
        phone: '+250 782 123 456'
      }
    },
    { 
      id: 'S-1002', 
      name: 'Dr. Marie Uwase', 
      position: 'Senior Psychologist', 
      department: 'Clinical Psychology',
      facilityId: 1,
      facilityName: 'Central Hospital',
      joinDate: '2021-03-22',
      status: 'Active',
      qualifications: ['Ph.D. Clinical Psychology', 'CBT Certification'],
      contact: {
        email: 'm.uwase@centralhospital.rw',
        phone: '+250 782 765 432'
      }
    },
    { 
      id: 'S-1003', 
      name: 'Joseph Ndayishimiye', 
      position: 'Mental Health Nurse', 
      department: 'Nursing',
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      joinDate: '2019-11-10',
      status: 'On Leave',
      qualifications: ['BSN', 'Mental Health Nursing Cert.'],
      contact: {
        email: 'j.ndayishimiye@eastern.rw',
        phone: '+250 788 234 567'
      }
    },
    { 
      id: 'S-1004', 
      name: 'Alice Mukamana', 
      position: 'Counselor', 
      department: 'Counseling',
      facilityId: 1,
      facilityName: 'Central Hospital',
      joinDate: '2022-05-18',
      status: 'Active',
      qualifications: ['Masters in Counseling', 'Trauma Therapy Cert.'],
      contact: {
        email: 'a.mukamana@centralhospital.rw',
        phone: '+250 788 123 789'
      }
    },
    { 
      id: 'S-1005', 
      name: 'Eric Mugisha', 
      position: 'Psychotherapist', 
      department: 'Therapy',
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      joinDate: '2021-08-12',
      status: 'Active',
      qualifications: ['Masters in Psychology', 'CBT Specialization'],
      contact: {
        email: 'e.mugisha@eastern.rw',
        phone: '+250 788 456 789'
      }
    },
  ]);

  // Filtered staff based on search and facility filter
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>(staff);

  // Apply filters when search query or facility filter changes
  useEffect(() => {
    let results = [...staff];
    
    // Apply facility filter
    if (facilityFilter !== 'all') {
      const facilityIdNum = parseInt(facilityFilter);
      results = results.filter(member => member.facilityId === facilityIdNum);
    }
    
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
  }, [staff, searchQuery, facilityFilter]);

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

  const handleEditStaff = (staff: StaffMember) => {
    setCurrentStaff(staff);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== staffId));
      toast({
        title: "Staff Removed",
        description: "The staff member has been removed successfully.",
      });
    }
  };

  const handleSaveStaff = (staffData: Partial<StaffMember>) => {
    if (isEditing && currentStaff) {
      // Update existing staff
      setStaff(staff.map(s => 
        s.id === currentStaff.id ? { ...currentStaff, ...staffData } as StaffMember : s
      ));
      toast({
        title: "Staff Updated",
        description: "Staff information has been updated successfully.",
      });
    } else {
      // Add new staff
      const newStaff: StaffMember = {
        id: `S-${1000 + staff.length + 1}`,
        name: staffData.name || '',
        position: staffData.position || '',
        department: staffData.department || '',
        facilityId: staffData.facilityId || 0,
        facilityName: staffData.facilityName || '',
        joinDate: staffData.joinDate || new Date().toISOString().split('T')[0],
        status: staffData.status || 'Active',
        qualifications: staffData.qualifications || [],
        contact: staffData.contact || { email: '', phone: '' },
      };
      
      setStaff([...staff, newStaff]);
      toast({
        title: "Staff Added",
        description: "New staff member has been added successfully.",
      });
    }
    
    setModalOpen(false);
  };

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
                  {facilities.map(facility => (
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
                          <DropdownMenuItem onClick={() => {
                            const newStatus = member.status === 'Active' ? 'On Leave' : 'Active';
                            setStaff(staff.map(s => 
                              s.id === member.id ? { ...s, status: newStatus } as StaffMember : s
                            ));
                          }}>
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
