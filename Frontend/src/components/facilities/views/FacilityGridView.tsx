import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingIcon, CalendarIcon, MapPinIcon, EyeIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Facility {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: number;
  lastAudit: string;
  score: number;
}

interface FacilityGridViewProps {
  facilities: Facility[];
  onDelete: (id: number, name: string) => void;
}

const FacilityGridView: React.FC<FacilityGridViewProps> = ({ facilities, onDelete }) => {
  const navigate = useNavigate();

  return (
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
                      onClick={() => onDelete(facility.id, facility.name)}
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
  );
};

export default FacilityGridView;
