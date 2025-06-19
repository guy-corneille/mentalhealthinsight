import React, { useState, useEffect, useMemo } from 'react';
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
import { useNotifications } from '@/contexts/NotificationContext';
import { usePageAuth } from '@/hooks/usePageAuth';
import Register from './Register';
import SearchInput from '@/components/common/SearchInput';

const UserManagement: React.FC = () => {
  // Protect at admin level
  usePageAuth('admin');

  const { pendingUsers, approveUser, rejectUser, systemUsers, fetchSystemUsers, toggleUserStatus } = useAuth();
  const { hasPermission } = useAuthorization();
  const [processingUsers, setProcessingUsers] = useState<Record<string, boolean>>({});
  const { addNotification } = useNotifications();
  
  const canApprove = hasPermission('approve:users') || hasPermission('manage:users');

  /* ------------------------------------------------------------------
   * Search state
   * ------------------------------------------------------------------ */
  const [pendingSearch, setPendingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const filteredPending = useMemo(() => {
    const term = pendingSearch.toLowerCase();
    return pendingUsers.filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.displayName || '').toLowerCase().includes(term)
    );
  }, [pendingSearch, pendingUsers]);

  const filteredUsers = useMemo(() => {
    const term = userSearch.toLowerCase();
    return systemUsers.filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      ((u as any).display_name || u.displayName || '').toLowerCase().includes(term)
    );
  }, [userSearch, systemUsers]);

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

  const handleToggleStatus = async (userId: string) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: true }));
      await toggleUserStatus(userId);
      addNotification('User status updated', 'The user\'s status has been updated.', 'success');
    } catch (error) {
      console.error('Error updating user status:', error);
      addNotification('Update failed', error instanceof Error ? error.message : 'Failed to update user', 'error');
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
            <TabsTrigger value="register">Register User</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <SearchInput value={pendingSearch} onChange={setPendingSearch} placeholder="Search pending users..." className="mb-4 max-w-sm" />
            <Card>
              <CardHeader>
                <CardTitle>Pending User Approvals</CardTitle>
                <CardDescription>
                  Review and manage user access requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPending.length === 0 ? (
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
                        {filteredPending.map((user) => (
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
            <SearchInput value={userSearch} onChange={setUserSearch} placeholder="Search users..." className="mb-4 max-w-sm" />
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
                <CardDescription>
                  Activate or deactivate user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">No users found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map(u => {
                          const inactive = (u as any).status === 'inactive' || (u as any).is_active === false || u.isActive === false;
                          const badgeClasses = inactive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
                          const statusLabel = (u as any).status ?? (inactive ? 'inactive' : 'active');
                          return (
                            <TableRow key={u.id}>
                              <TableCell>{(u as any).display_name ?? u.displayName ?? u.username}</TableCell>
                              <TableCell>{u.username}</TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell>{u.role}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`capitalize ${badgeClasses}`}>{statusLabel}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(u.id)}>
                                  {inactive ? 'Activate' : 'Deactivate'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register New User</CardTitle>
                <CardDescription>Create a user registration request.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto">
                  <Register />
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
