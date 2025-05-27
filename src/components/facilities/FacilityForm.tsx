import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  SaveIcon,
  GlobeIcon,
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
import { useCreateFacility } from '@/services/facilityService';

const FacilityForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createFacility = useCreateFacility();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    facility_type: '',
    address: '',
    city: '',
    district: '',
    province: '',
    country: 'Rwanda',
    postal_code: '',
    capacity: '',
    status: 'Active',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    established_date: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only name and facility_type are required
    const requiredFields = ['name', 'facility_type'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : 0,
      };

      await createFacility.mutateAsync(payload);

      toast({
        title: "Success",
        description: "Facility created successfully"
      });
      
      navigate('/facilities');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create facility. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = ['name', 'facility_type'].every(
    field => formData[field as keyof typeof formData]
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Facility</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              
              <div>
                <Label htmlFor="name">Facility Name *</Label>
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
                <Label htmlFor="facility_type">Facility Type *</Label>
                <Select
                  value={formData.facility_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, facility_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="Clinic">Clinic</SelectItem>
                    <SelectItem value="Community Center">Community Center</SelectItem>
                    <SelectItem value="Specialized Unit">Specialized Unit</SelectItem>
                    <SelectItem value="Treatment Center">Treatment Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter facility description"
                  rows={4}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Location</h2>
              
              <div>
                <Label htmlFor="address">Address</Label>
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
                    placeholder="Enter facility address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Enter district"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="Enter province"
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* Facility Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Facility Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="0"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                      placeholder="Enter capacity"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="established_date">Established Date</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <Input
                      id="established_date"
                      name="established_date"
                      type="date"
                      value={formData.established_date}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                    <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="rounded-l-none"
                    placeholder="www.example.com"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter without http:// or https:// (e.g., example.com)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/facilities')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-healthiq-600 hover:bg-healthiq-700"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Creating...</span>
              </div>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Create Facility
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FacilityForm;
