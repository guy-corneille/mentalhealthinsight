import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { CheckIcon, XIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/utils/roleUtils';
import { Spinner } from '@/components/ui/spinner';
import { useNotifications } from '@/contexts/NotificationContext';

const UserManagementDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { pendingUsers, approveUser, rejectUser } = useAuth();
  const [processingUsers, setProcessingUsers] = useState<Record<string, boolean>>({});
  const { addNotification } = useNotifications();

  const handleApproveUser = async (userId: string) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      const user = await approveUser(userId);
      addNotification(
        "User approved",
        `${user.displayName || user.username} has been approved and can now access the system.`,
        "success"
      );
    } catch (error) {
      console.error("Error approving user:", error);
      addNotification(
        "Approval failed",
        error instanceof Error ? error.message : "Failed to approve user",
        "error"
      );
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      const user = await rejectUser(userId);
      addNotification(
        "User rejected",
        `${user.displayName || user.username}'s request has been rejected.`,
        "info"
      );
    } catch (error) {
      console.error("Error rejecting user:", error);
      addNotification(
        "Rejection failed",
        error instanceof Error ? error.message : "Failed to reject user",
        "error"
      );
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (!pendingUsers || pendingUsers.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Management</DialogTitle>
            <DialogDescription>
              No pending user requests at this time.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
          <DialogDescription>
            Review and manage user access requests.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.displayName || '-'}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleApproveUser(user.id)}
                        disabled={processingUsers[user.id]}
                      >
                        {processingUsers[user.id] ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <CheckIcon className="h-4 w-4" />
                        )} 
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleRejectUser(user.id)}
                        disabled={processingUsers[user.id]}
                      >
                        {processingUsers[user.id] ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <XIcon className="h-4 w-4" />
                        )} 
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
