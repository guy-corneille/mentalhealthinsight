
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
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import api from '@/services/api';
import { getFacilities } from '@/services/facilityService';
import { getPatients } from '@/services/patientService';

interface Facility {
  id: number;
  name: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface ScheduleAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  facilityId: z.string().min(1, "Facility is required"),
  assessmentDate: z.date({ required_error: "Assessment date is required" }),
  criteria: z.string().min(1, "Assessment criteria is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleAssessmentDialog: React.FC<ScheduleAssessmentDialogProps> = ({ 
  open, 
  onOpenChange
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [criteria, setCriteria] = useState<{id: number, name: string}[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      facilityId: "",
      criteria: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilitiesResponse, patientsResponse, criteriaResponse] = await Promise.all([
          getFacilities(),
          getPatients(),
          api.get('/api/criteria/?purpose=Assessment')
        ]);
        
        setFacilities(facilitiesResponse);
        setPatients(patientsResponse);
        setCriteria(criteriaResponse.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load required data',
          variant: 'destructive',
        });
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, toast]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      const selectedDate = new Date(data.assessmentDate);
      
      // Create an assessment with status "scheduled"
      const assessmentData = {
        patient: data.patientId,
        facility: parseInt(data.facilityId),
        criteria: parseInt(data.criteria),
        assessment_date: selectedDate.toISOString(),
        scheduled_date: selectedDate.toISOString().split('T')[0],
        score: 0, // Initial score of 0
        status: 'scheduled',
        notes: data.notes || '',
      };
      
      const response = await api.post('/api/assessments/', assessmentData);
      
      toast({
        title: 'Assessment Scheduled',
        description: `Assessment scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`,
      });
      
      // Close dialog
      onOpenChange(false);
      
      // Reset form
      form.reset();
      
      // Redirect to assessments page
      navigate('/assessments');
    } catch (err) {
      console.error('Error scheduling assessment:', err);
      toast({
        title: 'Error',
        description: 'Failed to schedule assessment',
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
          <DialogTitle>Schedule New Assessment</DialogTitle>
          <DialogDescription>
            Schedule a new patient assessment by selecting a patient and scheduling a date.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.first_name} {patient.last_name}
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
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Criteria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment criteria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {criteria.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
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
              name="assessmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assessment Date</FormLabel>
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
                      placeholder="Add any additional notes for this assessment"
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
                  "Schedule Assessment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAssessmentDialog;
