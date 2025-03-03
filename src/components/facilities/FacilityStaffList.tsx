
import React, { useState, useEffect } from 'react';
import { UserIcon, FilterIcon, PencilIcon, UserXIcon, UserCheckIcon } from 'lucide-react';
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

interface FacilityStaffListProps {
  facilityId: number;
}

const FacilityStaffList: React.FC<FacilityStaffListProps> = ({ facilityId }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [allStaff, setAllStaff] = useState<StaffMember[]>([
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
      name: 'Grace Ingabire', 
      position: 'Clinical Psychologist', 
      department: 'Psychiatry',
      facilityId: 1,
      facilityName: 'Central Hospital',
      joinDate: '2022-05-10',
      status: 'Active',
      qualifications: ['MA Clinical Psychology', 'Trauma Therapy Cert.'],
      contact: {
        email: 'g.ingabire@centralhospital.rw',
        phone: '+250 788 555 123'
      }
    },
  ]);

  // Filter staff by facility and search term
  const filteredStaff = allStaff.filter(s => 
    s.facilityId === facilityId && 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.position.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleStatus = (staffId: string) => {
    setAllStaff(allStaff.map(s => {
      if (s.id === staffId) {
        const newStatus = s.status === 'Active' ? 'On Leave' : 'Active';
        return { ...s, status: newStatus as 'Active' | 'On Leave' | 'Former' };
      }
      return s;
    }));
    
    toast({
      title: "Staff Status Updated",
      description: "The staff member's status has been updated successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <UserIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search staff..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="border-none bg-muted/50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department}</TableCell>
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
                            <UserIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                            <UserCheckIcon className="h-4 w-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No staff members found for this facility
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FacilityStaffList;
