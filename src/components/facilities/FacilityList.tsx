
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingIcon, 
  CalendarIcon,
  MapPinIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  ArrowUpDownIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Facility {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: number;
  lastAudit: string;
  score: number;
}

const FacilityList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  
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

  // Apply filters and sorting
  useEffect(() => {
    let results = [...facilities];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(facility => 
        facility.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(facility => 
        facility.name.toLowerCase().includes(query) ||
        facility.location.toLowerCase().includes(query) ||
        facility.type.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      // Get values to compare
      let valueA: string | number = a[sortColumn as keyof Facility];
      let valueB: string | number = b[sortColumn as keyof Facility];
      
      // Convert to strings for string comparison if applicable
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      // Compare values
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredFacilities(results);
  }, [facilities, searchQuery, typeFilter, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set as ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      // Delete logic would normally be an API call
      toast({
        title: "Facility Deleted",
        description: `${name} has been removed successfully.`,
      });
      
      // Filter out the deleted facility (this would normally be handled by refetching)
      const updatedFacilities = filteredFacilities.filter(f => f.id !== id);
      setFilteredFacilities(updatedFacilities);
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDownIcon className="h-4 w-4 text-foreground" /> 
      : <ArrowUpDownIcon className="h-4 w-4 text-foreground rotate-180" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search facilities..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select 
            value={typeFilter} 
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-32 bg-muted/50 border-none focus:ring-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="clinic">Clinic</SelectItem>
              <SelectItem value="community center">Community</SelectItem>
            </SelectContent>
          </Select>
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGridIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <ListIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <span className="text-xs">Table</span>
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Button className="bg-healthiq-600 hover:bg-healthiq-700" onClick={() => navigate('/facilities/add')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </div>
      </div>
      
      {filteredFacilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
          <BuildingIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No facilities found</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your search or filter criteria
          </p>
          {searchQuery || typeFilter !== 'all' ? (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button 
              className="mt-4 bg-healthiq-600 hover:bg-healthiq-700"
              onClick={() => navigate('/facilities/add')}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Facility
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
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
                        <DropdownMenuItem onClick={() => navigate(`/facilities/${facility.id}`)}>
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/facilities/edit/${facility.id}`)}>
                          <EditIcon className="h-4 w-4 mr-2" />
                          Edit Facility
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-rose-600"
                          onClick={() => handleDelete(facility.id, facility.name)}
                        >
                          <Trash2Icon className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredFacilities.map((facility) => (
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
              
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(`/facilities/${facility.id}`)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(`/facilities/edit/${facility.id}`)}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-rose-600"
                  onClick={() => handleDelete(facility.id, facility.name)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {getSortIcon('location')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('capacity')}
                >
                  <div className="flex items-center">
                    Capacity
                    {getSortIcon('capacity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center">
                    Score
                    {getSortIcon('score')}
                  </div>
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFacilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>
                    <div className="font-medium">{facility.name}</div>
                  </TableCell>
                  <TableCell>{facility.type}</TableCell>
                  <TableCell>{facility.location}</TableCell>
                  <TableCell>{facility.capacity}</TableCell>
                  <TableCell>
                    <Badge className={
                      facility.score >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                      facility.score >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                      'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }>
                      {facility.score}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/facilities/${facility.id}`)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/facilities/edit/${facility.id}`)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-rose-600"
                        onClick={() => handleDelete(facility.id, facility.name)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FacilityList;
