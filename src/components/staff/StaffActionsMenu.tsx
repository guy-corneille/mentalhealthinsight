
import React from 'react';
import { 
  MoreHorizontalIcon,
  PencilIcon,
  UserXIcon,
  UserCheckIcon,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaffMember } from './types';

interface StaffActionsMenuProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onToggleStatus: (staffId: string) => void;
  onDelete: (staffId: string) => void;
}

const StaffActionsMenu: React.FC<StaffActionsMenuProps> = ({
  staff,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(staff)}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(staff.id)}>
          <UserCheckIcon className="h-4 w-4 mr-2" />
          Toggle Status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(staff.id)}
          className="text-rose-600"
        >
          <UserXIcon className="h-4 w-4 mr-2" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StaffActionsMenu;
