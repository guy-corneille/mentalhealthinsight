import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  facilityId: string;
}

interface Facility {
  id: string;
  name: string;
}

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAssessment: (patientId: string, facilityId: string) => void;
}

const NewAssessmentDialog: React.FC<NewAssessmentDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreateAssessment
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');

  // Mock data for development purposes
  const patients: Patient[] = [
    { id: 'P-1001', name: 'John Doe', facilityId: '1' },
    { id: 'P-1002', name: 'Jane Smith', facilityId: '2' },
    { id: 'P-1003', name: 'Michael Johnson', facilityId: '3' },
    { id: 'P-1005', name: 'Emily Davis', facilityId: '4' },
    { id: 'P-1006', name: 'Robert Wilson', facilityId: '5' },
  ];

  const facilities: Facility[] = [
    { id: '1', name: 'Central Hospital' },
    { id: '2', name: 'Eastern District Clinic' },
    { id: '3', name: 'Northern Community Center' },
    { id: '4', name: 'Southern District Hospital' },
    { id: '5', name: 'Western Health Center' },
  ];

  // Auto-select facility when patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find(p => p.id === selectedPatientId);
      if (patient) {
        setSelectedFacilityId(patient.facilityId);
      }
    }
  }, [selectedPatientId]);

  const handleStartAssessment = () => {
    if (selectedPatientId && selectedFacilityId) {
      onCreateAssessment(selectedPatientId, selectedFacilityId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedPatientId('');
    setSelectedFacilityId('');
    onOpenChange(false);
  };

  // Get facility name for display
  const getFacilityName = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    return facility ? facility.name : '';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Patient Assessment</DialogTitle>
          <DialogDescription>
            Select a patient to begin a new assessment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Patient
              </Label>
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {selectedPatientId && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Facility
                </Label>
                <div className="px-3 py-2 border rounded-md bg-muted/50">
                  {getFacilityName(selectedFacilityId)}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartAssessment} 
            disabled={!selectedPatientId}
            className="bg-healthiq-600 hover:bg-healthiq-700"
          >
            <FileText className="mr-2 h-4 w-4" />
            Start Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAssessmentDialog;
