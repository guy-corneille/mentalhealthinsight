
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingIcon, MapPinIcon, EyeIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Facility {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: number;
  lastAudit: string;
  score: number;
}

interface FacilityListViewProps {
  facilities: Facility[];
  onDelete: (id: number, name: string) => void;
}

const FacilityListView: React.FC<FacilityListViewProps> = ({ facilities, onDelete }) => {
  const navigate = useNavigate();

  return (
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
              onClick={() => onDelete(facility.id, facility.name)}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilityListView;
