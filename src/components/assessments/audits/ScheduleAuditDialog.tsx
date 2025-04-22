
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import api from '@/services/api';

interface Facility {
  id: number;
  name: string;
}

interface ScheduleAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  facilityId: z.string().min(1, "Facility is required"),
  auditDate: z.date({ required_error: "Audit date is required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleAuditDialog: React.FC<ScheduleAuditDialogProps> = ({ 
  open, 
  onOpenChange
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityId: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await api.get('/api/facilities/');
        if (Array.isArray(response)) {
          setFacilities(response);
        } else if (response && 'results' in response && Array.isArray(response.results)) {
          setFacilities(response.results);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load facilities',
          variant: 'destructive',
        });
      }
    };

    if (open) {
      fetchFacilities();
    }
  }, [open, toast]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      const selectedDate = new Date(data.auditDate);
      
      // Create an audit with status "scheduled"
      const auditData = {
        facility: parseInt(data.facilityId),
        audit_date: selectedDate.toISOString(),
        scheduled_date: selectedDate.toISOString().split('T')[0],
        overall_score: 0, // Initial score of 0
        status: 'scheduled',
        notes: data.notes || '',
      };
      
      const response = await api.post('/api/audits/', auditData);
      
      toast({
        title: 'Audit Scheduled',
        description: `Audit scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
      });
      
      // Close dialog
      onOpenChange(false);
      
      // Reset form
      form.reset();
      
      // Redirect to audits page
      navigate('/audits');
    } catch (err) {
      console.error('Error scheduling audit:', err);
      toast({
        title: 'Error',
        description: 'Failed to schedule audit',
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
          <DialogTitle>Schedule New Audit</DialogTitle>
          <DialogDescription>
            Set up a new facility audit by selecting a facility and scheduling a date.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a facility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id.toString()}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="auditDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Audit Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes or instructions for this audit"
                      className="resize-none"
                      {...field} 
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
                    <span>Scheduling...</span>
                  </div>
                ) : (
                  "Schedule Audit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAuditDialog;
