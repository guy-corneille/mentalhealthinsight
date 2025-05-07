
import React, { useState } from 'react';
import { PanelLeftIcon, PanelLeftCloseIcon } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Sidebar collapsed={sidebarCollapsed} />
      
      <main className={cn(
        "flex-1 pt-16 transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="p-6 max-w-screen-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="fixed bottom-6 left-6 z-50 rounded-full bg-background shadow-md border border-border/40 hover:bg-background/90"
          >
            {sidebarCollapsed ? (
              <PanelLeftIcon className="h-5 w-5" />
            ) : (
              <PanelLeftCloseIcon className="h-5 w-5" />
            )}
          </Button>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
