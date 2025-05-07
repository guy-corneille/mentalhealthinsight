import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart,
  BarChart3,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Gauge,
  Home,
  ListChecks,
  Settings,
  TrendingUp,
  Users,
  UserRound
} from "lucide-react";

interface SidebarProps {
  expanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ expanded, toggleSidebar }: SidebarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Navigation items with updated structure
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/facilities", label: "Facilities", icon: Building },
    { href: "/staff", label: "Staff", icon: Users },
    { href: "/patients", label: "Patients", icon: UserRound },
    { href: "/assessments", label: "Assessments", icon: ListChecks },
    { href: "/assessment-trends", label: "Assessment Trends", icon: TrendingUp },
    { href: "/audits", label: "Audits", icon: ClipboardCheck },
    { href: "/audit-trends", label: "Audit Trends", icon: BarChart },
    { href: "/benchmarks", label: "Benchmarks", icon: Gauge },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/criteria", label: "Criteria", icon: ClipboardCheck },
  ];

  return (
    <div className="fixed inset-y-0 z-50 flex flex-row">
      <aside className={cn(
        "flex flex-col h-screen bg-white border-r shadow-sm dark:bg-gray-950 dark:border-gray-800",
        expanded ? "w-60" : "w-16",
        isMenuOpen ? "translate-x-0" : "-translate-x-full",
        "transition-all duration-300 ease-in-out lg:translate-x-0 lg:w-60"
      )}>
        <div className="flex items-center justify-between py-3 px-3">
          <Link to="/" className="text-2xl font-semibold">
            {expanded && <span className="hidden lg:block">MentalHealthIQ</span>}
            {!expanded && <span className="hidden lg:block">MH-IQ</span>}
            <span className="lg:hidden">MH-IQ</span>
          </Link>
          <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
            {expanded ? (
              <ChevronLeft onClick={toggleSidebar} />
            ) : (
              <ChevronRight onClick={toggleSidebar} />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-hidden h-0">
          <Accordion type="single" collapsible className="flex-1 overflow-hidden h-0 divide-y-2 divide-gray-100 dark:divide-gray-800 flex flex-col justify-between">
            <div className="px-4 py-1">
              {navItems.map((item) => (
                <AccordionItem value={item.label} key={item.label}>
                  <Link to={item.href}>
                    <AccordionTrigger className="group hover:bg-gray-50 data-[state=open]:bg-gray-50 dark:hover:bg-gray-800 dark:data-[state=open]:bg-gray-800">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 shrink-0" />
                          {expanded && <span className="text-sm font-medium">{item.label}</span>}
                        </div>
                      </div>
                    </AccordionTrigger>
                  </Link>
                  <AccordionContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      This is the content of the {item.label} section.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
            <div className="px-4 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full text-left flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {expanded && <span>{authUser?.displayName || 'Profile'}</span>}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Accordion>
        </div>
      </aside>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 lg:hidden">
          <Settings />
        </SheetTrigger>
        <SheetContent side="left" className="w-60">
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
