
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthorization } from '@/hooks/useAuthorization';
import { Spinner } from '@/components/ui/spinner';
import { CheckIcon, XIcon, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

const UserManagement: React.FC = () => {
  const { pendingUsers, approveUser, rejectUser } = useAuth();
  const { hasPermission } = useAuthorization();
  const [processingUsers, setProcessingUsers] = useState<Record<string, boolean>>({});
  
  const canApprove = hasPermission('approve:users') || hasPermission('manage:users');

  const handleApproveUser = async (userId: string) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      await approveUser(userId);
      toast.success("User approved successfully");
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      await rejectUser(userId);
      toast.success("User request rejected");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    } finally {
      setProcessingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="system">System Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending User Approvals</CardTitle>
                <CardDescription>
                  Review and manage user access requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Pending Requests</h3>
                    <p className="text-muted-foreground mt-1">
                      There are no pending user registration requests at this time.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                              {canApprove ? (
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                                    onClick={() => handleApproveUser(user.id)}
                                    disabled={processingUsers[user.id]}
                                  >
                                    {processingUsers[user.id] ? (
                                      <Spinner className="h-4 w-4 mr-1" />
                                    ) : (
                                      <CheckIcon className="h-4 w-4 mr-1" />
                                    )} 
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                                    onClick={() => handleRejectUser(user.id)}
                                    disabled={processingUsers[user.id]}
                                  >
                                    {processingUsers[user.id] ? (
                                      <Spinner className="h-4 w-4 mr-1" />
                                    ) : (
                                      <XIcon className="h-4 w-4 mr-1" />
                                    )} 
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <Badge variant="outline">Awaiting Approval</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Complete list of system users and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">User Management</h3>
                  <p className="text-muted-foreground mt-1">
                    This feature will be implemented in the next phase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Access & Permissions</CardTitle>
                <CardDescription>
                  Configure system-wide access controls and role permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Permission Management</h3>
                  <p className="text-muted-foreground mt-1">
                    This feature will be implemented in the next phase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserManagement;
