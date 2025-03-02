
import React from 'react';
import { 
  BuildingIcon, 
  CalendarIcon,
  MapPinIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  SearchIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FacilityList: React.FC = () => {
  const [viewMode, setViewMode] = React.useState('grid');
  
  const facilities = [
    { 
      id: 1, 
      name: 'Central Hospital', 
      location: 'Kigali, Rwanda', 
      type: 'Hospital', 
      capacity: 250, 
      lastAudit: '2023-04-15',
      score: 92
    },
    { 
      id: 2, 
      name: 'Eastern District Clinic', 
      location: 'Rwamagana, Rwanda', 
      type: 'Clinic', 
      capacity: 75, 
      lastAudit: '2023-03-22',
      score: 78
    },
    { 
      id: 3, 
      name: 'Northern Community Center', 
      location: 'Musanze, Rwanda', 
      type: 'Community Center', 
      capacity: 45, 
      lastAudit: '2023-05-10',
      score: 65
    },
    { 
      id: 4, 
      name: 'Southern District Hospital', 
      location: 'Huye, Rwanda', 
      type: 'Hospital', 
      capacity: 180, 
      lastAudit: '2023-02-28',
      score: 84
    },
    { 
      id: 5, 
      name: 'Western Mental Health Center', 
      location: 'Rubavu, Rwanda', 
      type: 'Clinic', 
      capacity: 60, 
      lastAudit: '2023-04-05',
      score: 71
    },
    { 
      id: 6, 
      name: 'Nyagatare Health Clinic', 
      location: 'Nyagatare, Rwanda', 
      type: 'Clinic', 
      capacity: 40, 
      lastAudit: '2023-05-18',
      score: 88
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search facilities..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-32 bg-muted/50 border-none focus:ring-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGridIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <ListIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Button className="bg-healthiq-600 hover:bg-healthiq-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden transition-all duration-200 hover:shadow-md animate-scale-in">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-healthiq-100 flex items-center justify-center">
                        <BuildingIcon className="h-5 w-5 text-healthiq-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{facility.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {facility.location}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      facility.score >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                      facility.score >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                      'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }>
                      {facility.score}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{facility.type}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-medium">{facility.capacity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Last audit: {new Date(facility.lastAudit).toLocaleDateString()}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Facility Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Audit</DropdownMenuItem>
                        <DropdownMenuItem>Edit Facility</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {facilities.map((facility) => (
            <div key={facility.id} className="p-4 bg-card rounded-lg border shadow-sm flex flex-wrap md:flex-nowrap items-center justify-between gap-4 animate-slide-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-healthiq-100 flex items-center justify-center">
                  <BuildingIcon className="h-5 w-5 text-healthiq-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{facility.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    {facility.location}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="px-3 py-1 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium">{facility.type}</p>
                </div>
                <div className="px-3 py-1 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="font-medium">{facility.capacity}</p>
                </div>
                <div className="px-3 py-1 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">Last Audit</p>
                  <p className="font-medium">{new Date(facility.lastAudit).toLocaleDateString()}</p>
                </div>
                <Badge className={
                  facility.score >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                  facility.score >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                  'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }>
                  {facility.score}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Facility Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Audit</DropdownMenuItem>
                    <DropdownMenuItem>Edit Facility</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-rose-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityList;
