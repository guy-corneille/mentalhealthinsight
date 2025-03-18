
import React, { useState } from 'react';
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
import { Check, ChevronsUpDown, Search } from 'lucide-react';
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
  // Safety check - ensure patients is always an array
  const patientsList = patients || [];
  const [searchQuery, setSearchQuery] = useState('');
  
  if (patientsList.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No patients available. Please add patients first.
      </div>
    );
  }

  // Find the selected patient for display
  const selectedPatient = patientsList.find((patient) => patient.id === selectedPatientId);
  
  // Filter patients based on search query
  const filteredPatients = patientsList.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const patientId = patient.id.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || patientId.includes(query);
  });
  
  // Limit the number of patients displayed initially to improve performance
  const displayLimit = 100;
  const patientsToDisplay = searchQuery ? filteredPatients : filteredPatients.slice(0, displayLimit);
  
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
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search patients by name or ID..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No patient found with that name or ID.</CommandEmpty>
            <CommandGroup>
              {patientsToDisplay.map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={patient.id}
                  onSelect={() => {
                    onSelect(patient.id);
                    onOpenChange(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-medium">{patient.first_name} {patient.last_name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">({patient.id})</span>
                </CommandItem>
              ))}
              {!searchQuery && patientsList.length > displayLimit && (
                <div className="py-2 px-2 text-xs text-muted-foreground text-center">
                  Showing {displayLimit} of {patientsList.length} patients. 
                  Type to search for more patients.
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
