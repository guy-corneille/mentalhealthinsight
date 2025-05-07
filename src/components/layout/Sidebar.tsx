
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/hooks/useAuthProvider';
import NotificationBell from '@/components/notifications/NotificationBell';
import { cn } from '@/lib/utils';
import {
  BarChartIcon, GanttChartIcon, ClipboardListIcon, 
  BuildingIcon, UsersIcon, ClipboardIcon, TrendingUpIcon,
  FileTextIcon, ActivityIcon, AwardIcon, BrainIcon
} from 'lucide-react';

export interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChartIcon className="h-5 w-5" /> },
    { name: 'Facilities', path: '/facilities', icon: <BuildingIcon className="h-5 w-5" /> },
    { name: 'Staff', path: '/staff', icon: <UsersIcon className="h-5 w-5" /> },
    { name: 'Patients', path: '/patients', icon: <ActivityIcon className="h-5 w-5" /> },
    { name: 'Assessments', path: '/assessments', icon: <ClipboardIcon className="h-5 w-5" /> },
    { name: 'Assessment Trends', path: '/assessment-trends', icon: <TrendingUpIcon className="h-5 w-5" /> },
    { name: 'Audits', path: '/audits', icon: <ClipboardListIcon className="h-5 w-5" /> },
    { name: 'Audit Trends', path: '/audit-trends', icon: <TrendingUpIcon className="h-5 w-5" /> },
    { name: 'Criteria', path: '/criteria', icon: <GanttChartIcon className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <FileTextIcon className="h-5 w-5" /> },
    { name: 'Benchmarks', path: '/benchmarks', icon: <AwardIcon className="h-5 w-5" /> },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-full w-64 pt-16 transition-all duration-300 ease-in-out border-r border-border/40",
      collapsed && "w-20"
    )}>
      <div className="flex flex-col h-full p-3 bg-background">
        <div className={cn(
          "flex items-center justify-between mb-6 mt-2",
          collapsed ? "flex-col" : "px-2"
        )}>
          <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {!collapsed && user && (
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {user.name || user.username || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email || "user@example.com"}
                </span>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <div className="flex items-center">
              <NotificationBell />
            </div>
          )}
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <Tooltip key={item.path} delayDuration={collapsed ? 100 : 1000}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center p-2 rounded-md transition-colors",
                    "hover:bg-muted/60",
                    isActive ? "bg-muted text-primary" : "text-muted-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {item.name}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
