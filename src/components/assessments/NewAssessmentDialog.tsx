
import React from 'react';
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
import { FileText } from 'lucide-react';
import PatientSelector from './PatientSelector';
import FacilityDisplay from './FacilityDisplay';
import DialogLoadingState from './DialogLoadingState';
import { useNewAssessmentDialog } from '@/hooks/useNewAssessmentDialog';

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
  const {
    state,
    data,
    actions
  } = useNewAssessmentDialog(onCreateAssessment, () => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => isOpen ? onOpenChange(true) : actions.handleClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Patient Assessment</DialogTitle>
          <DialogDescription>
            Select a patient to begin a new assessment. You can search by name or ID.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {data.isLoading ? (
            <DialogLoadingState />
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Patient
                </Label>
                <PatientSelector 
                  patients={data.patients}
                  selectedPatientId={state.selectedPatientId}
                  isOpen={state.patientComboOpen}
                  onOpenChange={actions.setPatientComboOpen}
                  onSelect={actions.setSelectedPatientId}
                />
              </div>
              
              {state.selectedPatientId && state.selectedFacilityId && (
                <FacilityDisplay 
                  facilityName={actions.getFacilityName(state.selectedFacilityId)} 
                />
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={actions.handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={actions.handleStartAssessment} 
            disabled={!state.selectedPatientId || data.isLoading}
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
