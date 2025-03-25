
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ClipboardEdit, Search } from 'lucide-react';
import { useFacilities } from '@/services/facilityService';
import { Spinner } from "@/components/ui/spinner";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchInput from '@/components/common/SearchInput';

interface Facility {
  id: number;
  name: string;
  location?: string;
  city?: string;
  province?: string;
}

interface NewAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFacilitySelect: (facilityId: number) => void;
  facilities?: Facility[]; // Added this prop to fix the TypeScript error
}

const NewAuditDialog: React.FC<NewAuditDialogProps> = ({ 
  open, 
  onOpenChange,
  onFacilitySelect,
  facilities: propFacilities // Renamed to avoid conflict with the hook result
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Fetch facilities using API if not provided via props
  const { data: apiFacilities, isLoading } = useFacilities({
    enabled: !propFacilities // Only fetch from API if facilities weren't provided via props
  });

  // Use facilities from props if provided, otherwise use from API
  const facilities = propFacilities || apiFacilities;

  const handleStartAudit = () => {
    if (selectedFacilityId) {
      onFacilitySelect(Number(selectedFacilityId));
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFacilityId('');
    setSearchQuery('');
    onOpenChange(false);
  };

  // Filter facilities based on search query
  const filteredFacilities = facilities?.filter(facility => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      facility.name.toLowerCase().includes(query) ||
      facility.location?.toLowerCase().includes(query) ||
      facility.city?.toLowerCase().includes(query) ||
      facility.province?.toLowerCase().includes(query)
    );
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Start New Audit</DialogTitle>
          <DialogDescription>
            Select a facility to begin a new audit assessment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Spinner size="md" />
              <span className="ml-2">Loading facilities...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Search Facility
                </Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or location..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Facility List
                </Label>
                {(!facilities || facilities.length === 0) ? (
                  <div className="text-sm text-muted-foreground">
                    No facilities available. Please add facilities first.
                  </div>
                ) : (
                  <ScrollArea className="h-[200px] rounded-md border">
                    <div className="p-1">
                      {filteredFacilities?.length === 0 ? (
                        <div className="flex justify-center items-center h-20 text-muted-foreground">
                          No facilities match your search
                        </div>
                      ) : (
                        filteredFacilities?.map((facility) => (
                          <div
                            key={facility.id}
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                              selectedFacilityId === facility.id.toString()
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedFacilityId(facility.id.toString())}
                          >
                            <div>
                              <div className="font-medium">
                                {facility.name}
                              </div>
                              <div className="text-xs opacity-70">
                                {facility.location || facility.city || facility.province || 'No location'}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartAudit} 
            disabled={!selectedFacilityId || isLoading}
            className="bg-healthiq-600 hover:bg-healthiq-700"
          >
            <ClipboardEdit className="mr-2 h-4 w-4" />
            Start Audit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAuditDialog;
