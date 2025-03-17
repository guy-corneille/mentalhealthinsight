
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Facility } from '@/services/facilityService';
import { ChevronUpIcon, ChevronDownIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface FacilityTableViewProps {
  facilities: Facility[];
  onDelete: (id: number, name: string) => void;
  onEdit: (id: number) => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const FacilityTableView: React.FC<FacilityTableViewProps> = ({ 
  facilities, 
  onDelete, 
  onEdit,
  onSort, 
  sortColumn, 
  sortDirection 
}) => {
  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 ml-1" /> 
      : <ChevronDownIcon className="h-4 w-4 ml-1" />;
  };
  
  // Create sortable column header
  const SortableHeader = ({ column, label }: { column: string, label: string }) => (
    <div 
      className="flex items-center cursor-pointer hover:text-healthiq-600"
      onClick={() => onSort(column)}
    >
      {label}
      {renderSortIndicator(column)}
    </div>
  );
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><SortableHeader column="name" label="Name" /></TableHead>
            <TableHead><SortableHeader column="type" label="Type" /></TableHead>
            <TableHead className="hidden md:table-cell">
              <SortableHeader column="location" label="Location" />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <SortableHeader column="capacity" label="Capacity" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortableHeader column="lastAudit" label="Last Audit" />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortableHeader column="score" label="Score" />
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell className="font-medium">{facility.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-healthiq-50">
                  {facility.type || facility.facility_type}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {facility.location || `${facility.city || facility.district}, ${facility.province}`}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {facility.capacity || '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {facility.lastAudit || facility.last_inspection_date || '-'}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {facility.score ? `${facility.score}/100` : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(facility.id)}
                  >
                    <Edit2Icon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => onDelete(facility.id, facility.name)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FacilityTableView;
