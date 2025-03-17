
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facility } from '@/services/facilityService';
import { MapPinIcon, UsersIcon, CalendarIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface FacilityListViewProps {
  facilities: Facility[];
  onDelete: (id: number, name: string) => void;
  onEdit: (id: number) => void;
}

const FacilityListView: React.FC<FacilityListViewProps> = ({ facilities, onDelete, onEdit }) => {
  return (
    <div className="space-y-4">
      {facilities.map((facility) => (
        <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="font-semibold">{facility.name}</h3>
                  <Badge variant="outline" className="bg-healthiq-50 sm:ml-2 w-fit">
                    {facility.type || facility.facility_type}
                  </Badge>
                </div>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">
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
              
              <div className="flex items-center self-end sm:self-center gap-2">
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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityListView;
