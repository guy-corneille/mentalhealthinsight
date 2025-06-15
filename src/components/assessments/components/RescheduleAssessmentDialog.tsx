import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import api from '@/services/api';
import { AxiosResponse } from 'axios';

interface RescheduleAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  onAssessmentRescheduled?: () => void;
}

interface Assessment {
  id: string;
  patient: string;
  facility: number;
  scheduled_date: string;
  notes?: string;
}

const formSchema = z.object({
  scheduledDate: z.string().min(1, "Scheduled date and time is required"),
  missedReason: z.string().min(1, "Missed reason is required"),
});

type FormValues = z.infer<typeof formSchema>;

const RescheduleAssessmentDialog: React.FC<RescheduleAssessmentDialogProps> = ({ 
  open, 
  onOpenChange,
  assessmentId,
  onAssessmentRescheduled
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledDate: "",
      missedReason: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Convert local datetime string to ISO string and ensure it's a full datetime
      const scheduledDate = new Date(data.scheduledDate);
      const isoString = scheduledDate.toISOString();
      
      // First mark the current assessment as missed
      await api.patch(`/api/assessments/${assessmentId}/`, {
        status: 'missed',
        missed_reason: data.missedReason
      });

      // Then create a new scheduled assessment
      const response: AxiosResponse<Assessment> = await api.get(`/api/assessments/${assessmentId}/`);
      const currentAssessment = response.data;

      const newAssessmentData = {
        patient: currentAssessment.patient,
        facility: currentAssessment.facility,
        scheduled_date: isoString,
        score: 0,
        status: 'scheduled',
        notes: currentAssessment.notes,
      };
      
      await api.post('/api/assessments/', newAssessmentData);
      
      toast({
        title: 'Assessment Rescheduled',
        description: `Assessment rescheduled for ${format(scheduledDate, 'MMMM d, yyyy h:mm a')}`,
      });
      
      // Close dialog and reset
      onOpenChange(false);
      if (onAssessmentRescheduled) onAssessmentRescheduled();
      form.reset();
      
    } catch (err: any) {
      console.error('Error rescheduling assessment:', err);
      console.error('Error response:', err.response?.data);
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to reschedule assessment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Assessment</DialogTitle>
          <DialogDescription>
            Provide a reason for missing the current assessment and select a new date.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="missedReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Missing</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the reason why the assessment was missed"
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>New Date & Time</FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                      className="input input-bordered w-full"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Rescheduling...</span>
                  </div>
                ) : (
                  "Reschedule Assessment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleAssessmentDialog; 