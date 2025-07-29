import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserIcon,
  BuildingIcon,
  PhoneIcon,
  MailIcon,
  SaveIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { useFacilities } from '@/services/facilityService';
import { useStaffMember, useCreateStaffMember, useUpdateStaffMember, StaffMember, StaffQualification } from '@/services/staffService';
import Layout from '../layout/Layout';

interface StaffFormProps {
  isEdit?: boolean;
}

const StaffForm: React.FC<StaffFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const staffId = id || '';
  const { data: staffData, isLoading: isFetchingStaff } = useStaffMember(staffId);
  const createStaffMutation = useCreateStaffMember();
  const updateStaffMutation = useUpdateStaffMember(staffId);
  const { data: facilities = [] } = useFacilities();
  
  const isLoading = isFetchingStaff || createStaffMutation.isPending || updateStaffMutation.isPending;

  const [formData, setFormData] = useState<{
    name: string;
    position: string;
    department: string;
    facility: string;
    join_date: string;
    status: StaffMember['status'];
    email: string;
    phone: string;
    qualifications: StaffQualification[];
  }>({
    name: '',
    position: '',
    department: '',
    facility: '',
    join_date: '',
    status: 'Active',
    email: '',
    phone: '',
    qualifications: [],
  });

  useEffect(() => {
    if (isEdit && staffData) {
      setFormData({
        name: staffData.name || '',
        position: staffData.position || '',
        department: staffData.department || '',
        facility: staffData.facility?.toString() || '',
        join_date: staffData.join_date || '',
        status: staffData.status || 'Active',
        email: staffData.email || '',
        phone: staffData.phone || '',
        qualifications: staffData.qualifications || [],
      });
    }
  }, [isEdit, staffData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.position || !formData.department || !formData.facility) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const staffPayload = {
      ...formData,
      facility: parseInt(formData.facility),
    };

    if (isEdit && id) {
      updateStaffMutation.mutate(staffPayload, {
        onSuccess: (data) => {
          toast({
            title: "Staff Updated",
            description: `${data.name} has been updated successfully.`,
          });
          navigate('/staff');
        },
        onError: (error) => {
          toast({
            title: "Update Failed",
            description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      });
    } else {
      createStaffMutation.mutate(staffPayload, {
        onSuccess: (data) => {
          toast({
            title: "Staff Created",
            description: `${data.name} has been added successfully.`,
          });
          navigate('/staff');
        },
        onError: (error) => {
          toast({
            title: "Creation Failed",
            description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      });
    }
  };
  return (
    <Layout>

    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/staff')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h1>
      </div>

      {isFetchingStaff && isEdit ? (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading staff data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-base">
                      Position <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-base">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facility" className="text-base">
                      Facility <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.facility}
                      onValueChange={(value) => handleSelectChange(value, 'facility')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id.toString()}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact and Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base">Phone</Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="join_date" className="text-base">
                      Join Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="join_date"
                        name="join_date"
                        type="date"
                        value={formData.join_date}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-base">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange(value, 'status')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Former">Former</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/staff')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" />
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      {isEdit ? 'Update Staff' : 'Create Staff'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
    </Layout>

  );
};

export default StaffForm; 