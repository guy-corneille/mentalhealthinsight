
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import QualificationsSection from './QualificationsSection';
import { StaffMember, useCreateStaffMember, useUpdateStaffMember } from '@/services/staffService';
import { useFacilities } from '@/services/facilityService';

// Define form schema with zod
const staffSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  facility: z.number().int().positive('Facility is required'),
  join_date: z.string().min(1, 'Join date is required'),
  status: z.string().min(1, 'Status is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  qualifications: z.array(z.object({
    id: z.number().optional(),
    qualification: z.string().min(1, 'Qualification is required'),
  })).optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffModalFormProps {
  staffMember: StaffMember | null;
  viewOnly?: boolean;
  onSubmit: (data: StaffFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const StaffModalForm: React.FC<StaffModalFormProps> = ({ 
  staffMember, 
  viewOnly = false, 
  onSubmit, 
  isSubmitting, 
  onCancel 
}) => {
  const { data: facilities, isLoading: isLoadingFacilities } = useFacilities();
  
  const defaultValues: Partial<StaffFormValues> = staffMember ? {
    ...staffMember,
    facility: Number(staffMember.facility),
    qualifications: staffMember.qualifications || []
  } : {
    name: '',
    position: '',
    department: '',
    facility: undefined as unknown as number,
    join_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    email: '',
    phone: '',
    qualifications: []
  };

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues
  });

  const isCreating = !staffMember;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={viewOnly} />
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
                  <Input type="email" {...field} disabled={viewOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} disabled={viewOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input {...field} disabled={viewOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="facility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility</FormLabel>
                <Select
                  disabled={viewOnly || isLoadingFacilities}
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingFacilities ? "Loading..." : "Select facility"} />
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} disabled={viewOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="join_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Join Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={viewOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  disabled={viewOnly}
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
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Former">Former</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <QualificationsSection control={form.control} disabled={viewOnly} />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {!viewOnly && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isCreating ? 'Add Staff Member' : 'Update Staff Member'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default StaffModalForm;
