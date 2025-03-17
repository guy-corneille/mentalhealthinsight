
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  SaveIcon,
  ArrowLeftIcon,
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
import { useFacility, useCreateFacility, useUpdateFacility, Facility } from '@/services/facilityService';

interface FacilityFormProps {
  isEdit?: boolean;
}

const FacilityForm: React.FC<FacilityFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use React Query hooks for API operations
  const facilityId = id ? parseInt(id) : 0;
  const { data: facilityData, isLoading: isFetchingFacility } = useFacility(facilityId);
  const createFacilityMutation = useCreateFacility();
  const updateFacilityMutation = useUpdateFacility(facilityId);
  
  const isLoading = isFetchingFacility || createFacilityMutation.isPending || updateFacilityMutation.isPending;

  const [formData, setFormData] = useState({
    name: '',
    facility_type: '',
    address: '',
    city: '',
    district: '',
    province: '',
    country: 'Rwanda',
    capacity: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    contact_name: '',
  });

  useEffect(() => {
    // If editing mode and facility data loaded, populate form
    if (isEdit && facilityData) {
      console.log('Loading facility data into form:', facilityData);
      setFormData({
        name: facilityData.name || '',
        facility_type: facilityData.facility_type || '',
        address: facilityData.address || '',
        city: facilityData.city || '',
        district: facilityData.district || '',
        province: facilityData.province || '',
        country: facilityData.country || 'Rwanda',
        capacity: facilityData.capacity?.toString() || '',
        description: facilityData.description || '',
        contact_email: facilityData.contact_email || '',
        contact_phone: facilityData.contact_phone || '',
        website: facilityData.website || '',
        contact_name: facilityData.contact_name || '',
      });
    }
  }, [isEdit, facilityData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.facility_type || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Prepare facility data with proper types
    const facilityPayload: Partial<Facility> = {
      ...formData,
      capacity: parseInt(formData.capacity) || 0,
    };

    console.log('Submitting facility data:', facilityPayload);

    if (isEdit && id) {
      // Update existing facility
      updateFacilityMutation.mutate(facilityPayload, {
        onSuccess: (data) => {
          console.log('Facility updated successfully:', data);
          toast({
            title: "Facility Updated",
            description: `${data.name} has been updated successfully.`,
          });
          navigate('/facilities');
        },
        onError: (error) => {
          console.error('Error updating facility:', error);
          toast({
            title: "Update Failed",
            description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      });
    } else {
      // Create new facility
      createFacilityMutation.mutate(facilityPayload, {
        onSuccess: (data) => {
          console.log('Facility created successfully:', data);
          toast({
            title: "Facility Created",
            description: `${data.name} has been added successfully.`,
          });
          navigate('/facilities');
        },
        onError: (error) => {
          console.error('Error creating facility:', error);
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
          onClick={() => navigate('/facilities')}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Edit Facility' : 'Add New Facility'}
        </h1>
      </div>

      {isFetchingFacility && isEdit ? (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading facility data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base">
                      Facility Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="Enter facility name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facility_type" className="text-base">
                      Facility Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.facility_type}
                      onValueChange={(value) => handleSelectChange(value, 'facility_type')}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Clinic">Clinic</SelectItem>
                        <SelectItem value="Community Center">Community Center</SelectItem>
                        <SelectItem value="Rehabilitation Center">Rehabilitation Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-base">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="Street address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-base">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district" className="text-base">
                        District <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="District"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="province" className="text-base">
                        Province <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Province"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-base">
                        Country
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Country"
                      />
                    </div>
                  </div>

                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description" className="text-base">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 h-32"
                      placeholder="Describe the facility's services and specialties"
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity" className="text-base">
                      Capacity
                    </Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Patient capacity"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_name" className="text-base">
                      Contact Person
                    </Label>
                    <Input
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Primary contact name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_email" className="text-base">
                        Email
                      </Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone" className="text-base">
                        Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-base">
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/facilities')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-healthiq-600 hover:bg-healthiq-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {isEdit ? 'Update Facility' : 'Create Facility'}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FacilityForm;
