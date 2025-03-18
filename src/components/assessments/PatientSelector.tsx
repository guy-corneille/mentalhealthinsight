
import React from 'react';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  facility: number;
}

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (patientId: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  isOpen,
  onOpenChange,
  onSelect,
}) => {
  // Safety check - ensure patients is always an array even if undefined is passed
  const patientsList = patients || [];
  
  if (patientsList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No patients available. Please add patients first.
      </div>
    );
  }

  // Find the selected patient for display
  const selectedPatient = patientsList.find((patient) => patient.id === selectedPatientId);
  
  // Handle large patient lists by limiting displayed results initially
  const displayLimit = 100; // Limit to prevent performance issues with very large lists
  
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {selectedPatient 
            ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
            : "Select a patient"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search patients..." />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No patient found.</CommandEmpty>
            <CommandGroup>
              {patientsList.slice(0, displayLimit).map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={`${patient.first_name} ${patient.last_name}`}
                  onSelect={() => {
                    onSelect(patient.id);
                    onOpenChange(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {patient.first_name} {patient.last_name}
                </CommandItem>
              ))}
              {patientsList.length > displayLimit && (
                <div className="py-2 px-2 text-xs text-muted-foreground text-center">
                  Showing {displayLimit} of {patientsList.length} patients. 
                  Please use search to find specific patients.
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PatientSelector;
