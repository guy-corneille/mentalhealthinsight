
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
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ClipboardEdit } from 'lucide-react';

interface Facility {
  id: number;
  name: string;
}

interface NewAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facilities: Facility[];
  onFacilitySelect: (facilityId: number) => void;
}

const NewAuditDialog: React.FC<NewAuditDialogProps> = ({ 
  open, 
  onOpenChange,
  facilities,
  onFacilitySelect
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');

  const handleStartAudit = () => {
    if (selectedFacilityId) {
      onFacilitySelect(Number(selectedFacilityId));
    }
  };

  const handleClose = () => {
    setSelectedFacilityId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Start New Audit</DialogTitle>
          <DialogDescription>
            Select a facility to begin a new audit assessment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Facility
              </label>
              <Select
                value={selectedFacilityId}
                onValueChange={setSelectedFacilityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id.toString()}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartAudit} 
            disabled={!selectedFacilityId}
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
