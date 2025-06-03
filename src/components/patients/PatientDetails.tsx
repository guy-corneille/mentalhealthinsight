import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreatePatient, useUpdatePatient, Patient } from '@/services/patientService';
import { useFacilities } from '@/services/facilityService';
import { useStaffByFacility } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';

// Define form schema with zod
const patientSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  national_id: z.string().optional().or(z.literal('')),
  status: z.string().min(1, 'Status is required'),
  facility: z.number().int().positive('Facility is required'),
  primary_staff: z.number().optional(),
  registration_date: z.string().min(1, 'Registration date is required'),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  notes: z.string().optional(),
});

interface PatientDetailsProps {
  patient: Patient | null;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: facilities, isLoading: isLoadingFacilities } = useFacilities();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const { data: staffMembers, isLoading: isLoadingStaff } = useStaffByFacility(
    selectedFacilityId ? parseInt(selectedFacilityId) : undefined
  );
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient(patient?.id || '');
  
  const isCreating = !patient;
  const title = isCreating ? 'Add Patient' : 'Edit Patient';
  
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ? {
      ...patient,
      facility: Number(patient.facility),
      primary_staff: patient.primary_staff ? Number(patient.primary_staff) : undefined,
    } : {
      first_name: '',
      last_name: '',
      date_of_birth: new Date().toISOString().split('T')[0],
      gender: 'M',
      address: '',
      phone: '',
      email: '',
      national_id: '',
      status: 'Active',
      registration_date: new Date().toISOString().split('T')[0],
      facility: undefined as unknown as number,
      primary_staff: undefined,
      emergency_contact_name: '',
      emergency_contact_phone: '',
      notes: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof patientSchema>) => {
    try {
      // Transform the data to match the API expectations
      const patientData = {
        ...data,
        facility: Number(data.facility),
        primary_staff: data.primary_staff ? Number(data.primary_staff) : undefined,
        national_id: data.national_id || undefined,
      };

      if (isCreating) {
        await createPatientMutation.mutateAsync(patientData);
        toast({
          title: "Success",
          description: "Patient added successfully"
        });
        navigate('/patients');
      } else if (patient) {
        await updatePatientMutation.mutateAsync({
          ...patientData,
          id: patient.id
        });
        toast({
          title: "Success",
          description: "Patient updated successfully"
        });
        navigate('/patients');
      }
    } catch (error: any) {
      console.error('Error saving patient:', error);
      let errorMessage = "Failed to save patient. Please try again.";
      
      // Handle specific error cases
      if (error.response?.data) {
        if (error.response.data.national_id) {
          errorMessage = "A patient with this National ID already exists.";
        } else if (typeof error.response.data === 'object') {
          errorMessage = Object.values(error.response.data).flat().join(', ');
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const isSubmitting = createPatientMutation.isPending || updatePatientMutation.isPending;

  // Update staff list when facility changes
  useEffect(() => {
    const facilityId = form.watch('facility');
    if (facilityId) {
      setSelectedFacilityId(facilityId.toString());
    } else {
      setSelectedFacilityId('');
      form.setValue('primary_staff', undefined);
    }
  }, [form.watch('facility')]);

  // Set initial values when patient data is loaded
  useEffect(() => {
    if (patient) {
      form.reset({
        ...patient,
        facility: Number(patient.facility),
        primary_staff: patient.primary_staff ? Number(patient.primary_staff) : undefined,
      });
      if (patient.facility) {
        setSelectedFacilityId(patient.facility.toString());
      }
    }
  }, [patient, form]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/patients')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Basic Information</h2>
                
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>First Name *</FormLabel>
                    <FormControl>
                          <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                          <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                          <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                          value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="national_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter national ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                        <FormLabel>Address *</FormLabel>
                  <FormControl>
                          <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                          <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                          <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              </div>

              {/* Facility and Staff Assignment */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Facility and Staff Assignment</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility *</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a facility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facilities?.map((facility) => (
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
                    name="primary_staff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Staff</FormLabel>
                        <Select
                          disabled={!selectedFacilityId}
                          onValueChange={(value) => {
                            const numValue = value ? Number(value) : undefined;
                            field.onChange(numValue);
                          }}
                          value={field.value?.toString() || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedFacilityId ? "Select primary staff" : "Select facility first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {staffMembers?.map((staff) => (
                              <SelectItem key={staff.id} value={staff.id.toString()}>
                                {staff.name} - {staff.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Discharged">Discharged</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="registration_date"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Registration Date *</FormLabel>
                    <FormControl>
                          <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Emergency Contact</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergency_contact_name"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                          <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emergency_contact_phone"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                          <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Additional Information</h2>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                        <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/patients')}
              disabled={isSubmitting}
            >
                Cancel
              </Button>
            <Button 
              type="submit"
              className="bg-healthiq-600 hover:bg-healthiq-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>{isCreating ? 'Creating...' : 'Updating...'}</span>
                </div>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isCreating ? 'Create Patient' : 'Update Patient'}
                </>
              )}
                </Button>
          </div>
          </form>
        </Form>
    </div>
  );
};

export default PatientDetails;
