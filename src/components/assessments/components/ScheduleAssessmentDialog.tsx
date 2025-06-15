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
import { usePatients, usePatientsByFacility, Patient } from '@/services/patientService';
import { getFacilities } from '@/services/facilityService';
import { AxiosResponse } from 'axios';

interface Facility {
  id: number;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
}

interface PatientDetails extends Omit<Patient, 'primary_staff'> {
  primary_staff?: string | null;
}

interface ScheduleAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssessmentScheduled?: () => void;
}

const formSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  facilityId: z.string().min(1, "Facility is required"),
  scheduledDate: z.string().min(1, "Scheduled date and time is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleAssessmentDialog: React.FC<ScheduleAssessmentDialogProps> = ({ 
  open, 
  onOpenChange,
  onAssessmentScheduled
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

  // Fetch patients for the selected facility
  const { data: patients } = usePatientsByFacility(selectedFacilityId ? Number(selectedFacilityId) : undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      facilityId: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesResponse = await getFacilities();
        setFacilities(facilitiesResponse);
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

  // Reset patient selection when facility changes
  useEffect(() => {
    form.setValue('patientId', '');
  }, [selectedFacilityId]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Convert local datetime string to ISO string and ensure it's a full datetime
      const scheduledDate = new Date(data.scheduledDate);
      // Format as YYYY-MM-DDTHH:mm:ss.sssZ for proper datetime handling
      const isoString = scheduledDate.toISOString();
      
      // Get patient details to include primary staff
      const patientResponse: AxiosResponse<PatientDetails> = await api.get(`/api/patients/${data.patientId}/`);
      const patient = patientResponse.data;
      
      const assessmentData = {
        patient: data.patientId,
        facility: Number(data.facilityId),
        scheduled_date: isoString,
        score: 0,
        status: 'scheduled',
        notes: data.notes || '',
      };
      
      // Add primary staff info to notes if available
      try {
        if (patient?.primary_staff) {
          const staffResponse: AxiosResponse<StaffMember> = await api.get(`/api/staff/${patient.primary_staff}/`);
          const staffMember = staffResponse.data;
          if (staffMember?.name) {
            assessmentData.notes = `${assessmentData.notes}\n\nPrimary Staff: ${staffMember.name}`.trim();
          }
        }
      } catch (staffError) {
        console.error('Error fetching staff details:', staffError);
        // Continue with assessment creation even if staff details fetch fails
      }
      
      console.log('Sending assessment data:', assessmentData);
      
      const response = await api.post('/api/assessments/', assessmentData);
      
      toast({
        title: 'Assessment Scheduled',
        description: `Assessment scheduled for ${format(scheduledDate, 'MMMM d, yyyy h:mm a')}`,
      });
      
      // Close dialog and reset
      onOpenChange(false);
      if (onAssessmentScheduled) onAssessmentScheduled();
      form.reset();
      setSelectedFacilityId("");
      
      // Redirect to assessments page
      navigate('/assessments');
    } catch (err: any) {
      console.error('Error scheduling assessment:', err);
      console.error('Error response:', err.response?.data);
      toast({
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to schedule assessment',
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
            Schedule a new patient assessment by selecting a patient, facility, and date.
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedFacilityId(value);
                    }}
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
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedFacilityId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedFacilityId ? "Select a patient" : "Select a facility first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients?.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {`${patient.first_name} ${patient.last_name}`}
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
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Scheduled Date & Time</FormLabel>
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
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes or instructions for this assessment"
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