
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { FileText, Check, ChevronsUpDown } from 'lucide-react';
import { usePatients, usePatient, useFacilities } from '@/services/patientService';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

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
  const [patientComboOpen, setPatientComboOpen] = useState(false);
  
  // Fetch patients and facilities
  const { data: patientsData, isLoading: isPatientsLoading } = usePatients();
  const { data: facilities, isLoading: isFacilitiesLoading } = useFacilities();
  const { data: selectedPatient } = usePatient(selectedPatientId);

  // Ensure patients is always an array even if data is undefined
  const patients = patientsData || [];
  
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
    onOpenChange(false);
  };

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
        
        <div className="py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Spinner size="md" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Patient
                </Label>
                {(!patients || patients.length === 0) ? (
                  <div className="text-sm text-muted-foreground">
                    No patients available. Please add patients first.
                  </div>
                ) : (
                  <Popover open={patientComboOpen} onOpenChange={setPatientComboOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={patientComboOpen}
                        className="w-full justify-between"
                      >
                        {selectedPatientId ? 
                          patients.find((patient) => patient.id === selectedPatientId)
                            ? `${patients.find((patient) => patient.id === selectedPatientId)?.first_name} ${patients.find((patient) => patient.id === selectedPatientId)?.last_name}`
                            : "Select a patient" 
                          : "Select a patient"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search patients..." />
                        <CommandEmpty>No patient found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {patients.map((patient) => (
                            <CommandItem
                              key={patient.id}
                              value={`${patient.first_name} ${patient.last_name} (${patient.id})`}
                              onSelect={() => {
                                setSelectedPatientId(patient.id);
                                setPatientComboOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {patient.first_name} {patient.last_name} ({patient.id})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
