
import React, { useState } from 'react';
import { BellIcon, SearchIcon, UserIcon, LogOutIcon, UsersIcon, UserCogIcon, SettingsIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import UserManagementDialog from '../users/UserManagementDialog';
import { useAuthorization } from '@/hooks/useAuthorization';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, pendingUsers } = useAuth();
  const { hasPermission } = useAuthorization();
  const navigate = useNavigate();
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hasManagementAccess = hasPermission('approve:users') || hasPermission('manage:users');
  const pendingCount = hasManagementAccess ? pendingUsers.length : 0;

  return (
    <header className="h-16 px-6 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-healthiq-600 to-healthiq-800 mr-6 cursor-pointer"
          onClick={() => navigate('/dashboard')}>
          MentalHealthIQ
        </h1>
        <div className="hidden sm:flex items-center relative w-72">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellIcon className="h-5 w-5" />
        </Button>
        
        {isAuthenticated && user ? (
          <div className="flex items-center">
            <div className="mr-4 text-right hidden sm:block">
              <p className="text-sm font-medium">{user.displayName || user.username}</p>
              <Badge variant="outline" className="text-xs capitalize">
                {user.role}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-healthiq-100 flex items-center justify-center overflow-hidden cursor-pointer">
                  <UserIcon className="h-5 w-5 text-healthiq-600" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p>{user.displayName || user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account-settings')}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                
                {hasManagementAccess && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/user-management')}>
                      <UserCogIcon className="h-4 w-4 mr-2" />
                      User Management
                      {pendingCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {pendingCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserManagementOpen(true)}>
                      <UsersIcon className="h-4 w-4 mr-2" />
                      Quick Approvals
                      {pendingCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {pendingCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button variant="default" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
      </div>
      
      <UserManagementDialog 
        open={userManagementOpen} 
        onOpenChange={setUserManagementOpen} 
      />
    </header>
  );
};

export default Header;
