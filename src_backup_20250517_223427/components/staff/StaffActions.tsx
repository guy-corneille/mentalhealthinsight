
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, EyeIcon } from "lucide-react";
import { useDeleteStaffMember } from "@/services/staffService";
import { toast } from "sonner";

interface StaffActionsProps {
  staff: {
    id: string;
    name: string;
  };
  onEdit: (staffId: string) => void;
  onView: (staffId: string) => void;
}

const StaffActions: React.FC<StaffActionsProps> = ({ staff, onEdit, onView }) => {
  const deleteStaffMutation = useDeleteStaffMember();

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${staff.name}?`)) {
      try {
        await deleteStaffMutation.mutateAsync(staff.id);
        toast.success(`Staff member ${staff.name} deleted successfully`);
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error(`Failed to delete staff member: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(staff.id)}>
          <EyeIcon className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(staff.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={deleteStaffMutation.isPending} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          {deleteStaffMutation.isPending ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StaffActions;
