
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  MailIcon,
  PhoneIcon,
  ExternalLinkIcon 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FacilityStaffListProps {
  facilityId: number;
}

const FacilityStaffList: React.FC<FacilityStaffListProps> = ({ facilityId }) => {
  // This would typically come from an API or context
  // For now, we'll use mock data filtered by the facilityId
  const allStaff = [
    { 
      id: 'S-1001', 
      name: 'Dr. Jean Mutabazi', 
      position: 'Lead Psychiatrist', 
      department: 'Psychiatry',
      facilityId: 1,
      status: 'Active',
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
      status: 'Active',
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
      status: 'On Leave',
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
      status: 'Active',
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
      status: 'Active',
      contact: {
        email: 'e.mugisha@eastern.rw',
        phone: '+250 788 456 789'
      }
    },
  ];
  
  // Filter staff by facility ID
  const facilityStaff = allStaff.filter(staff => staff.facilityId === facilityId);

  if (facilityStaff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <UserIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No Staff Members</h3>
        <p className="text-muted-foreground mb-4">
          There are no staff members assigned to this facility yet.
        </p>
        <Button asChild className="bg-healthiq-600 hover:bg-healthiq-700">
          <Link to="/staff">Manage Staff</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {facilityStaff.length} staff members assigned to this facility
        </p>
        <Button asChild className="bg-healthiq-600 hover:bg-healthiq-700">
          <Link to="/staff">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            Manage Staff
          </Link>
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilityStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>
                  <Badge className={
                    staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                    staff.status === 'On Leave' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                    'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  }>
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <a href={`mailto:${staff.contact.email}`} className="text-muted-foreground hover:text-foreground">
                      <MailIcon className="h-4 w-4" />
                    </a>
                    <a href={`tel:${staff.contact.phone}`} className="text-muted-foreground hover:text-foreground">
                      <PhoneIcon className="h-4 w-4" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacilityStaffList;
