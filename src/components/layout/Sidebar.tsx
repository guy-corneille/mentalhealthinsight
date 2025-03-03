
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, 
  BuildingIcon, 
  UsersIcon, 
  ClipboardIcon, 
  BarChartIcon, 
  BookOpenIcon, 
  SettingsIcon, 
  HelpCircleIcon,
  UserIcon,
  DatabaseIcon,
  ListChecksIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  BarChart2Icon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    'dataSetup': false,
    'evaluationFramework': false
  });
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isActiveParent = (children: MenuItem[]) => {
    return children.some(child => location.pathname === child.path);
  };
  
  const toggleDropdown = (key: string) => {
    if (!collapsed) {
      setOpenDropdowns(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };
  
  const menuItems: MenuItem[] = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard' },
    { 
      icon: DatabaseIcon, 
      label: 'Data Setup', 
      path: '#', 
      children: [
        { icon: BuildingIcon, label: 'Facilities', path: '/facilities' },
        { icon: UserIcon, label: 'Staff', path: '/staff' },
        { icon: UsersIcon, label: 'Patients', path: '/patients' },
        { icon: BarChartIcon, label: 'Criteria', path: '/criteria' }
      ]
    },
    { 
      icon: ListChecksIcon, 
      label: 'Evaluation Framework', 
      path: '#', 
      children: [
        { icon: ClipboardIcon, label: 'Assessments', path: '/assessments' },
        { icon: ClipboardListIcon, label: 'Audits', path: '/audits' }
      ]
    },
    { icon: FileTextIcon, label: 'Reports', path: '/reports' }
  ];
  
  const secondaryItems = [
    { icon: BookOpenIcon, label: 'Knowledge Base', path: '/knowledge' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    { icon: HelpCircleIcon, label: 'Help', path: '/help' },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.children && !collapsed) {
      const isOpen = openDropdowns[item.label.toLowerCase().replace(/\s/g, '')];
      const isParentActive = isActiveParent(item.children);
      
      return (
        <div key={index} className="space-y-1">
          <button
            onClick={() => toggleDropdown(item.label.toLowerCase().replace(/\s/g, ''))}
            className={cn(
              "flex items-center w-full py-3 px-4 rounded-lg transition-all",
              isParentActive 
                ? "bg-healthiq-50 text-healthiq-600" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isParentActive ? "text-healthiq-600" : "text-muted-foreground")} />
            <span className="ml-3 font-medium text-sm flex-1 text-left">{item.label}</span>
            {isOpen ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
          
          {isOpen && (
            <div className="pl-10 space-y-1">
              {item.children.map((child, childIndex) => (
                <Link
                  key={childIndex}
                  to={child.path}
                  className={cn(
                    "flex items-center py-2 px-4 rounded-lg transition-all",
                    isActive(child.path) 
                      ? "bg-healthiq-50 text-healthiq-600" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <child.icon className={cn("h-4 w-4", isActive(child.path) ? "text-healthiq-600" : "text-muted-foreground")} />
                  <span className="ml-3 font-medium text-sm">{child.label}</span>
                  {isActive(child.path) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-healthiq-500"></div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
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
    );
  };

  return (
    <aside className={cn(
      "h-screen fixed top-0 left-0 z-40 pt-16 border-r border-border/40 transition-all duration-300 ease-in-out",
      collapsed ? "w-20" : "w-64",
      "bg-background/95 backdrop-blur-md"
    )}>
      <div className="h-full flex flex-col justify-between overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
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
