
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserIcon, BuildingIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StaffActions from './StaffActions';
import { useStaffListContext } from './StaffListContext';

const StaffTable: React.FC = () => {
  const { filteredStaff, searchQuery, facilityFilter, setSearchQuery, setFacilityFilter } = useStaffListContext();

  return (
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
                    <StaffActions staff={member} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffTable;
