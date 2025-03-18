
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

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
  if (!patients || patients.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No patients available. Please add patients first.
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
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
                {patient.first_name} {patient.last_name} ({patient.id})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PatientSelector;
