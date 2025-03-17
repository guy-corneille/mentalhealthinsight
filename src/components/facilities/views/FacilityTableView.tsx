
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EditIcon, Trash2Icon, ArrowUpDownIcon } from 'lucide-react';
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
import { Facility } from '@/services/facilityService';

interface FacilityTableViewProps {
  facilities: Facility[];
  onDelete: (id: number, name: string) => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

/**
 * Table view for facilities
 * Displays facilities in a tabular format with sortable columns
 */
const FacilityTableView: React.FC<FacilityTableViewProps> = ({ 
  facilities, 
  onDelete, 
  onSort,
  sortColumn,
  sortDirection
}) => {
  const navigate = useNavigate();

  // Helper to render the appropriate sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDownIcon className="h-4 w-4 text-foreground" /> 
      : <ArrowUpDownIcon className="h-4 w-4 text-foreground rotate-180" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center">
                Type
                {getSortIcon('type')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('location')}
            >
              <div className="flex items-center">
                Location
                {getSortIcon('location')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('capacity')}
            >
              <div className="flex items-center">
                Capacity
                {getSortIcon('capacity')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('score')}
            >
              <div className="flex items-center">
                Score
                {getSortIcon('score')}
              </div>
            </TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id}>
              <TableCell>
                <div className="font-medium">{facility.name}</div>
              </TableCell>
              <TableCell>{facility.type}</TableCell>
              <TableCell>{facility.location}</TableCell>
              <TableCell>{facility.capacity}</TableCell>
              <TableCell>
                <Badge className={
                  (facility.score || 0) >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                  (facility.score || 0) >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                  'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }>
                  {facility.score || 0}%
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(`/facilities/${facility.id}`)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(`/facilities/edit/${facility.id}`)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-rose-600"
                    onClick={() => onDelete(facility.id, facility.name)}
                  >
                    <Trash2Icon className="h-4 w-4" />
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
