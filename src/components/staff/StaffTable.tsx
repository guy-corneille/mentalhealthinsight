
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StaffActions from './StaffActions';
import { StaffMember } from '@/services/staffService';

interface StaffTableProps {
  staff: StaffMember[];
  onEdit: (staffId: string) => void;
  onView: (staffId: string) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ staff, onEdit, onView }) => {
  return (
    <div className="rounded-md border">
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
          {staff.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No staff members found.
              </TableCell>
            </TableRow>
          ) : (
            staff.map((staffMember) => (
              <TableRow key={staffMember.id}>
                <TableCell className="font-medium">{staffMember.name}</TableCell>
                <TableCell>{staffMember.position}</TableCell>
                <TableCell>{staffMember.department}</TableCell>
                <TableCell>{staffMember.facility_name || `Facility ${staffMember.facility}`}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      staffMember.status === "Active" ? "default" :
                      staffMember.status === "On Leave" ? "secondary" : 
                      "outline"
                    }
                  >
                    {staffMember.status}
                  </Badge>
                </TableCell>
                <TableCell>{staffMember.email}</TableCell>
                <TableCell>{new Date(staffMember.join_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <StaffActions 
                    staff={staffMember} 
                    onEdit={onEdit} 
                    onView={onView} 
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffTable;
