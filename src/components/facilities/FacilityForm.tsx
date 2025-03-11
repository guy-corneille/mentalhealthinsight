
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BuildingIcon,
  MapPinIcon,
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
    facility_type: '',
    address: '',
    district: '',
    province: '',
    capacity: '',
    contact_name: '',
    contact_phone: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      setIsLoading(true);
      setTimeout(() => {
        setFacilityData({
          name: 'Central Hospital',
          facility_type: 'Hospital',
          address: 'KN 5 Ave, Kigali',
          district: 'Nyarugenge',
          province: 'Kigali',
          capacity: '250',
          contact_name: 'Dr. Jean Mutabazi',
          contact_phone: '+250 782 123 456',
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

    if (!facilityData.name || !facilityData.facility_type || !facilityData.address) {
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
                    <Label htmlFor="facility_type" className="text-base">
                      Facility Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={facilityData.facility_type}
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
                </div>

                <div className="space-y-4">
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
                        value={facilityData.address}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        placeholder="Enter address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district" className="text-base">
                        District
                      </Label>
                      <Input
                        id="district"
                        name="district"
                        value={facilityData.district}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="District"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province" className="text-base">
                        Province
                      </Label>
                      <Input
                        id="province"
                        name="province"
                        value={facilityData.province}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_name" className="text-base">
                        Contact Person
                      </Label>
                      <Input
                        id="contact_name"
                        name="contact_name"
                        value={facilityData.contact_name}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone" className="text-base">
                        Contact Phone
                      </Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={facilityData.contact_phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Phone number"
                      />
                    </div>
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
