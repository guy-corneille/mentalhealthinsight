
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Assessment } from '../types';
import { useAuth } from '@/contexts/AuthContext';

interface AssessmentDetailsDialogProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrintReport: (assessment: Assessment) => void;
}

const AssessmentDetailsDialog: React.FC<AssessmentDetailsDialogProps> = ({
  assessment,
  isOpen,
  onOpenChange,
  onPrintReport
}) => {
  const { user } = useAuth();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

  if (!assessment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
          <DialogDescription>
            View detailed information about this assessment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Patient ID</h4>
              <p>{assessment.patient}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Patient Name</h4>
              <p>{assessment.patient_name || 'Unknown'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Facility</h4>
              <p>{assessment.facility_name || assessment.facility}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
              <p>{new Date(assessment.assessment_date).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Score</h4>
              <p className={
                assessment.score >= 80 ? 'text-emerald-600' : 
                assessment.score >= 60 ? 'text-amber-600' : 
                'text-rose-600'
              }>
                {assessment.score}%
              </p>
            </div>
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Evaluator</h4>
              <p>{assessment.evaluator_name || assessment.evaluator || user?.displayName || user?.username || 'Current User'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Completed On</h4>
              <p className="text-sm">{formatDate(assessment.created_at)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Updated On</h4>
              <p className="text-sm">{formatDate(assessment.updated_at)}</p>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="whitespace-pre-wrap">{assessment.notes || 'No notes provided.'}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => assessment && onPrintReport(assessment)}>
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDetailsDialog;
