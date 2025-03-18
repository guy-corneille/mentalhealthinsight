
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
import { Input } from '@/components/ui/input';
import { FileText, Search } from 'lucide-react';
import { usePatients, usePatient, useFacilities } from '@/services/patientService';
import { Spinner } from '@/components/ui/spinner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [patientComboOpen, setPatientComboOpen] = useState(false);
  
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

  // Filter patients based on search query
  const filteredPatients = React.useMemo(() => {
    if (!patients) return [];
    
    if (!searchQuery.trim()) return patients;
    
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (patient) => 
        patient.id.toLowerCase().includes(query) ||
        patient.first_name.toLowerCase().includes(query) ||
        patient.last_name.toLowerCase().includes(query) ||
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

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
    setPatientComboOpen(false);
    onOpenChange(false);
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setPatientComboOpen(false);
  };

  // Get facility name for display
  const getFacilityName = (facilityId: string) => {
    const facility = facilities?.find(f => f.id.toString() === facilityId);
    return facility ? facility.name : '';
  };

  const getPatientDisplayName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    if (!patient) return "Select a patient";
    return `${patient.first_name} ${patient.last_name} (${patient.id})`;
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
                        {selectedPatientId ? getPatientDisplayName(selectedPatientId) : "Select a patient..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search patients..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList className="max-h-[300px]">
                          <CommandEmpty>No patients found.</CommandEmpty>
                          <CommandGroup>
                            {filteredPatients.map((patient) => (
                              <CommandItem
                                key={patient.id}
                                value={patient.id}
                                onSelect={() => handlePatientSelect(patient.id)}
                              >
                                {patient.first_name} {patient.last_name} ({patient.id})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
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
