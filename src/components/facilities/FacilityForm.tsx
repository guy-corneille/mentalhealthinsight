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

interface FacilityFormProps {
  isEdit?: boolean;
}

const FacilityForm: React.FC<FacilityFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [facilityData, setFacilityData] = useState({
    name: '',
    type: '',
    location: '',
    capacity: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    leadDoctor: '',
    staffCount: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      setTimeout(() => {
        setFacilityData({
          name: 'Central Hospital',
          type: 'Hospital',
          location: 'Kigali, Rwanda',
          capacity: '250',
          description: 'A leading mental health facility providing comprehensive services to the community.',
          email: 'info@centralhospital.rw',
          phone: '+250 782 123 456',
          website: 'www.centralhospital.rw',
          leadDoctor: 'Dr. Jean Mutabazi',
          staffCount: '120',
        });
        setIsLoading(false);
      }, 800);
    }
  }, [isEdit, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFacilityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFacilityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!facilityData.name || !facilityData.type || !facilityData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (isEdit) {
        toast({
          title: "Facility Updated",
          description: `${facilityData.name} has been updated successfully.`,
        });
      } else {
        toast({
          title: "Facility Created",
          description: `${facilityData.name} has been added successfully.`,
        });
      }
      setIsLoading(false);
      navigate('/facilities');
    }, 1000);
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

      {isLoading && !isEdit ? (
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
                        value={facilityData.name}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="Enter facility name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-base">
                      Facility Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={facilityData.type}
                      onValueChange={(value) => handleSelectChange(value, 'type')}
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
                    <Label htmlFor="location" className="text-base">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <Input
                        id="location"
                        name="location"
                        value={facilityData.location}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capacity" className="text-base">
                        Capacity
                      </Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={facilityData.capacity}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Patient capacity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="staffCount" className="text-base">
                        Staff Count
                      </Label>
                      <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </span>
                        <Input
                          id="staffCount"
                          name="staffCount"
                          type="number"
                          value={facilityData.staffCount}
                          onChange={handleInputChange}
                          className="rounded-l-none"
                          placeholder="Number of staff"
                        />
                      </div>
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
                      value={facilityData.description}
                      onChange={handleInputChange}
                      className="mt-1 h-32"
                      placeholder="Describe the facility's services and specialties"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={facilityData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-base">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={facilityData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-base">
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={facilityData.website}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="leadDoctor" className="text-base">
                      Lead Doctor
                    </Label>
                    <Input
                      id="leadDoctor"
                      name="leadDoctor"
                      value={facilityData.leadDoctor}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Dr. Name"
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
