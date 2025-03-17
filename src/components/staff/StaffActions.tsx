
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontalIcon,
  UserXIcon,
  UserCheckIcon,
  PencilIcon 
} from "lucide-react";
import { StaffMemberDisplay, useDeleteStaff, useUpdateStaff } from '@/services/staffService';
import { useToast } from "@/hooks/use-toast";
import { useStaffListContext } from './StaffListContext';

interface StaffActionsProps {
  staff: StaffMemberDisplay;
}

const StaffActions: React.FC<StaffActionsProps> = ({ staff }) => {
  const { toast } = useToast();
  const { setCurrentStaff, setIsEditing, setModalOpen } = useStaffListContext();
  
  // Mutation for deleting a staff member
  const deleteStaffMutation = useDeleteStaff();

  const handleEditStaff = () => {
    setCurrentStaff(staff);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteStaff = () => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      deleteStaffMutation.mutate(staff.id, {
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
  
  const handleToggleStatus = () => {
    const newStatus = staff.status === 'Active' ? 'On Leave' : 'Active';
    
    // Create a new update mutation for this staff member
    const updateStaffMutation = useUpdateStaff(staff.id);
    
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
        <DropdownMenuItem onClick={handleEditStaff}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus}>
          <UserCheckIcon className="h-4 w-4 mr-2" />
          Toggle Status
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDeleteStaff}
          className="text-rose-600"
        >
          <UserXIcon className="h-4 w-4 mr-2" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StaffActions;
