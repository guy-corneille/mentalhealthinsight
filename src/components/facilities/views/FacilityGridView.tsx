
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facility } from '@/services/facilityService';
import { MapPinIcon, UsersIcon, CalendarIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface FacilityGridViewProps {
  facilities: Facility[];
  onDelete: (id: number, name: string) => void;
  onEdit: (id: number) => void;
}

const FacilityGridView: React.FC<FacilityGridViewProps> = ({ facilities, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-healthiq-100 to-healthiq-50 h-2" />
          <CardContent className="p-6 pb-0">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold line-clamp-2">{facility.name}</h3>
                <Badge variant="outline" className="bg-healthiq-50">
                  {facility.type || facility.facility_type}
                </Badge>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {facility.location || `${facility.city || facility.district}, ${facility.province}, ${facility.country}`}
                  </span>
                </div>
                
                {facility.capacity && (
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Capacity: {facility.capacity}
                    </span>
                  </div>
                )}
                
                {facility.lastAudit && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last audit: {facility.lastAudit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 pt-4 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(facility.id)}
            >
              <Edit2Icon className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
              onClick={() => onDelete(facility.id, facility.name)}
            >
              <Trash2Icon className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FacilityGridView;
