
import React from 'react';
import { BellIcon, SearchIcon, UserIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header: React.FC = () => {
  return (
    <header className="h-16 px-6 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-healthiq-600 to-healthiq-800 mr-6">
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
        <div className="h-8 w-8 rounded-full bg-healthiq-100 flex items-center justify-center overflow-hidden">
          <UserIcon className="h-5 w-5 text-healthiq-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;
