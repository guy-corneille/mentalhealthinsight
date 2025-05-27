import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  SaveIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  BuildingIcon,
  FileTextIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { usePatient, useCreatePatient, useUpdatePatient, Patient } from '@/services/patientService';

interface PatientFormProps {
  isEdit?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const patientId = id || '';
  const { data: patientData, isLoading: isFetchingPatient } = usePatient(patientId);
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient(patientId);
  const { data: facilities = [] } = useFacilities();
  
  const isLoading = isFetchingPatient || createPatientMutation.isPending || updatePatientMutation.isPending;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    national_id: '',
    facility: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    notes: '',
  });

  useEffect(() => {
    if (isEdit && patientData) {
      setFormData({
        first_name: patientData.first_name || '',
        last_name: patientData.last_name || '',
        date_of_birth: patientData.date_of_birth || '',
        gender: patientData.gender || '',
        address: patientData.address || '',
        phone: patientData.phone || '',
        email: patientData.email || '',
        national_id: patientData.national_id || '',
        facility: patientData.facility?.toString() || '',
        emergency_contact_name: patientData.emergency_contact_name || '',
        emergency_contact_phone: patientData.emergency_contact_phone || '',
        notes: patientData.notes || '',
      });
    }
  }, [isEdit, patientData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.date_of_birth || !formData.gender) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const patientPayload = {
      ...formData,
      facility: parseInt(formData.facility) || null,
    };

    if (isEdit && id) {
      updatePatientMutation.mutate(patientPayload, {
        onSuccess: (data) => {
          toast({
            title: "Patient Updated",
            description: `${data.first_name} ${data.last_name} has been updated successfully.`,
          });
          navigate('/patients');
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
      createPatientMutation.mutate(patientPayload, {
        onSuccess: (data) => {
          toast({
            title: "Patient Created",
            description: `${data.first_name} ${data.last_name} has been added successfully.`,
          });
          navigate('/patients');
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/patients')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Edit Patient' : 'Add New Patient'}
        </h1>
      </div>

      {isFetchingPatient && isEdit ? (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="first_name" className="text-base">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="last_name" className="text-base">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date_of_birth" className="text-base">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-base">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange(value, 'gender')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="national_id" className="text-base">
                      National ID
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="national_id"
                        name="national_id"
                        value={formData.national_id}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
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

                  <div>
                    <Label htmlFor="address" className="text-base">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="emergency_contact_name" className="text-base">
                      Contact Name
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="emergency_contact_name"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emergency_contact_phone" className="text-base">
                      Contact Phone
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="emergency_contact_phone"
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <Label htmlFor="notes" className="text-base">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/patients')}
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
                      {isEdit ? 'Update Patient' : 'Create Patient'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
};

export default PatientForm; 