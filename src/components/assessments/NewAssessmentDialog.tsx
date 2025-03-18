
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
import { Label } from '@/components/ui/label';
import { FileText, Search } from 'lucide-react';
import { usePatients, usePatient, useFacilities } from '@/services/patientService';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  facility: number;
  facility_name?: string;
}

interface Facility {
  id: number;
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Fetch patients and facilities
  const { data: patients, isLoading: isPatientsLoading } = usePatients();
  const { data: facilities, isLoading: isFacilitiesLoading } = useFacilities();
  const { data: selectedPatient } = usePatient(selectedPatientId);

  // Auto-select facility when patient is selected
  useEffect(() => {
    if (selectedPatient && selectedPatient.facility) {
      setSelectedFacilityId(selectedPatient.facility.toString());
    }
  }, [selectedPatient]);

  const handleStartAssessment = () => {
    if (selectedPatientId && selectedFacilityId) {
      onCreateAssessment(selectedPatientId, selectedFacilityId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedPatientId('');
    setSelectedFacilityId('');
    setSearchQuery('');
    onOpenChange(false);
  };

  // Filter patients based on search query
  const filteredPatients = patients?.filter(patient => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    
    return (
      patient.id.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      patient.first_name.toLowerCase().includes(query) ||
      patient.last_name.toLowerCase().includes(query)
    );
  });

  // Get facility name for display
  const getFacilityName = (facilityId: string) => {
    const facility = facilities?.find(f => f.id.toString() === facilityId);
    return facility ? facility.name : '';
  };

  const isLoading = isPatientsLoading || isFacilitiesLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Patient Assessment</DialogTitle>
          <DialogDescription>
            Select a patient to begin a new assessment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Spinner size="md" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Search Patient
                </Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Patient List
                </Label>
                {(!patients || patients.length === 0) ? (
                  <div className="text-sm text-muted-foreground">
                    No patients available. Please add patients first.
                  </div>
                ) : (
                  <ScrollArea className="h-[200px] rounded-md border">
                    <div className="p-1">
                      {filteredPatients?.length === 0 ? (
                        <div className="flex justify-center items-center h-20 text-muted-foreground">
                          No patients match your search
                        </div>
                      ) : (
                        filteredPatients?.map((patient) => (
                          <div
                            key={patient.id}
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                              selectedPatientId === patient.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setSelectedPatientId(patient.id)}
                          >
                            <div>
                              <div className="font-medium">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-xs opacity-70">
                                ID: {patient.id}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
              
              {selectedPatientId && selectedFacilityId && (
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
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartAssessment} 
            disabled={!selectedPatientId || isLoading}
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
