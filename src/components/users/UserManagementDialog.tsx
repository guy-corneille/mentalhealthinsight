
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { CheckIcon, XIcon } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface UserRequest {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'pending';
  phoneNumber: string;
  displayName: string;
  requestDate: Date;
}

const UserManagementDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { pendingUsers, approveUser, rejectUser } = useAuth();

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
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                        onClick={() => approveUser(user.id)}
                      >
                        <CheckIcon className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                        onClick={() => rejectUser(user.id)}
                      >
                        <XIcon className="h-4 w-4 mr-1" /> Reject
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
