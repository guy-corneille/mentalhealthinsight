
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, 
  BuildingIcon, 
  UsersIcon, 
  ClipboardIcon, 
  BarChartIcon, 
  BookOpenIcon, 
  SettingsIcon, 
  HelpCircleIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard' },
    { icon: BuildingIcon, label: 'Facilities', path: '/facilities' },
    { icon: UsersIcon, label: 'Patients', path: '/patients' },
    { icon: ClipboardIcon, label: 'Assessments', path: '/assessments' },
    { icon: BarChartIcon, label: 'Criteria', path: '/criteria' },
  ];
  
  const secondaryItems = [
    { icon: BookOpenIcon, label: 'Knowledge Base', path: '/knowledge' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    { icon: HelpCircleIcon, label: 'Help', path: '/help' },
  ];

  return (
    <aside className={cn(
      "h-screen fixed top-0 left-0 z-40 pt-16 border-r border-border/40 transition-all duration-300 ease-in-out",
      collapsed ? "w-20" : "w-64",
      "bg-background/95 backdrop-blur-md"
    )}>
      <div className="h-full flex flex-col justify-between overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center py-3 px-4 rounded-lg transition-all",
                isActive(item.path) 
                  ? "bg-healthiq-50 text-healthiq-600" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive(item.path) ? "text-healthiq-600" : "text-muted-foreground")} />
              {!collapsed && (
                <span className={cn("ml-3 font-medium text-sm", { 
                  'opacity-0 w-0': collapsed,
                })}>
                  {item.label}
                </span>
              )}
              {isActive(item.path) && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-healthiq-500"></div>
              )}
            </Link>
          ))}
        </nav>
        
        <nav className="space-y-2 px-4 mt-auto">
          {secondaryItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center py-3 px-4 rounded-lg transition-all",
                isActive(item.path) 
                  ? "bg-healthiq-50 text-healthiq-600" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && (
                <span className={cn("ml-3 font-medium text-sm", { 
                  'opacity-0 w-0': collapsed,
                })}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
