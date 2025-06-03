import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Printer, User, Building2, ClipboardCheck } from 'lucide-react';

interface AssessmentDetailsDialogProps {
  assessment: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrintReport: (assessment: any) => void;
}

const AssessmentDetailsDialog: React.FC<AssessmentDetailsDialogProps> = ({
  assessment,
  isOpen,
  onOpenChange,
  onPrintReport
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 69) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Excellent';
    if (score >= 69) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  if (!assessment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
          <DialogDescription>
            View detailed information about this assessment.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
            <div>
                  <h1 className="text-2xl font-bold mb-2">Assessment Details</h1>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(assessment.assessment_date)}
                    </span>
                  </div>
                </div>
                <Button onClick={() => onPrintReport(assessment)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Patient Information
                  </h2>
                  <div className="space-y-2">
            <div>
                      <span className="text-sm text-muted-foreground">Patient ID:</span>
                      <p className="font-medium">{assessment.patient}</p>
            </div>
            <div>
                      <span className="text-sm text-muted-foreground">Patient Name:</span>
                      <p className="font-medium">{assessment.patient_name || 'Unknown'}</p>
            </div>
            <div>
                      <span className="text-sm text-muted-foreground">Primary Staff:</span>
                      <p className="font-medium">{assessment.patient?.primary_staff?.display_name || 'Not Assigned'}</p>
            </div>
            </div>
            </div>

                {/* Facility Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Facility Information
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Facility:</span>
                      <p className="font-medium">{assessment.facility_name || assessment.facility}</p>
                    </div>
            <div>
                      <span className="text-sm text-muted-foreground">Assessment Type:</span>
                      <p className="font-medium">{assessment.criteria_name || 'Standard Assessment'}</p>
            </div>
            <div>
                      <span className="text-sm text-muted-foreground">Evaluator:</span>
                      <p className="font-medium">{assessment.evaluator_name || 'Not Assigned'}</p>
                    </div>
            </div>
            </div>
          </div>
            </Card>

            {/* Score Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Overall Score
              </h2>
              <div className="flex flex-col items-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(assessment.score)}`}>
                  {assessment.score}%
                </div>
                <Badge className={getStatusColor(getScoreLabel(assessment.score).toLowerCase())}>
                  {getScoreLabel(assessment.score)}
                </Badge>
                <Progress value={assessment.score} className="w-full max-w-md h-2 mt-4" />
              </div>
            </Card>

            {/* Indicator Scores */}
            {assessment.indicator_scores && assessment.indicator_scores.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <ClipboardCheck className="w-5 h-5 mr-2" />
                  Indicator Scores
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assessment.indicator_scores.map((score: any) => (
                    <Card key={score.id} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{score.indicator_name}</span>
                        <span className={`font-bold ${getScoreColor(score.score)}`}>
                          {score.score}%
                        </span>
                      </div>
                      <Progress value={score.score} className="h-2" />
                      {score.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{score.notes}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Notes */}
            {assessment.notes && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Notes
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{assessment.notes}</p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDetailsDialog;
