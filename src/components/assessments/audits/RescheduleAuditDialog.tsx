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

interface RescheduleAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditId: string;
  onAuditRescheduled?: () => void;
}

interface Audit {
  id: string;
  facility: number;
  facility_name: string;
  auditor?: string;
  auditor_name?: string;
  status: 'scheduled' | 'completed' | 'missed';
  audit_date?: string;
  scheduled_date: string;
  overall_score: number;
  criteria_scores?: Array<{
    criteria_name: string;
    score: number;
    notes?: string;
  }>;
  notes?: string;
  missed_reason?: string;
}

const formSchema = z.object({
  scheduledDate: z.string().min(1, "Scheduled date and time is required"),
  missedReason: z.string().min(1, "Missed reason is required"),
});

type FormValues = z.infer<typeof formSchema>;

const RescheduleAuditDialog: React.FC<RescheduleAuditDialogProps> = ({ 
  open, 
  onOpenChange,
  auditId,
  onAuditRescheduled
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
      // Convert local datetime string to ISO string
      const scheduledDate = new Date(data.scheduledDate);
      const isoString = scheduledDate.toISOString();

      // Update only the necessary fields
      await api.patch(`/api/audits/${auditId}/`, {
        scheduled_date: isoString,
        missed_reason: data.missedReason || '',
        status: 'scheduled'
      });
      
      toast({
        title: 'Audit Rescheduled',
        description: `Audit rescheduled for ${format(scheduledDate, 'MMMM d, yyyy h:mm a')}`,
      });
      
      // Close dialog and reset
      onOpenChange(false);
      if (onAuditRescheduled) onAuditRescheduled();
      form.reset();
      
    } catch (err: any) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        selectedDate: data.scheduledDate
      });
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to reschedule audit. Please try again.',
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
          <DialogTitle>Reschedule Audit</DialogTitle>
          <DialogDescription>
            Provide a reason for missing the current audit and select a new date.
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
                      placeholder="Enter the reason why the audit was missed"
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
                  "Reschedule Audit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleAuditDialog; 