
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, XIcon } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  facilityId: number;
  facilityName: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Former';
  qualifications: string[];
  contact: {
    email: string;
    phone: string;
  };
}

interface StaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffData: StaffMember | null;
  isEditing: boolean;
  onSave: (staffData: Partial<StaffMember>) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({ 
  open, 
  onOpenChange, 
  staffData, 
  isEditing, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    position: '',
    department: '',
    facilityId: 1,
    facilityName: 'Central Hospital',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    qualifications: [],
    contact: {
      email: '',
      phone: ''
    }
  });
  
  const [newQualification, setNewQualification] = useState('');
  
  // Mock facilities data - In a real app, this would come from an API
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Western Mental Health Center' },
    { id: 4, name: 'Northern Community Center' },
    { id: 5, name: 'Southern District Hospital' },
  ];

  // Reset form when opening or changing staff to edit
  useEffect(() => {
    if (staffData) {
      setFormData({
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        facilityId: staffData.facilityId,
        facilityName: staffData.facilityName,
        joinDate: staffData.joinDate,
        status: staffData.status,
        qualifications: [...staffData.qualifications],
        contact: { ...staffData.contact }
      });
    } else {
      setFormData({
        name: '',
        position: '',
        department: '',
        facilityId: 1,
        facilityName: 'Central Hospital',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active' as const,
        qualifications: [],
        contact: {
          email: '',
          phone: ''
        }
      });
    }
    setNewQualification('');
  }, [staffData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as Record<string, unknown>,
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFacilityChange = (value: string) => {
    const facilityId = parseInt(value);
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      setFormData({
        ...formData,
        facilityId,
        facilityName: facility.name
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as 'Active' | 'On Leave' | 'Former'
    });
  };

  const addQualification = () => {
    if (newQualification.trim() && formData.qualifications) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, newQualification.trim()]
      });
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    if (formData.qualifications) {
      const updatedQualifications = [...formData.qualifications];
      updatedQualifications.splice(index, 1);
      setFormData({
        ...formData,
        qualifications: updatedQualifications
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details for this staff member.' : 'Fill in the details to add a new staff member.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facility" className="text-right">
                Facility
              </Label>
              <Select 
                onValueChange={handleFacilityChange} 
                defaultValue={formData.facilityId?.toString()}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map(facility => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate" className="text-right">
                Join Date
              </Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                onValueChange={handleStatusChange} 
                defaultValue={formData.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="contact.email"
                type="email"
                value={formData.contact?.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="contact.phone"
                value={formData.contact?.phone}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Qualifications
              </Label>
              <div className="col-span-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="Add qualification"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={addQualification}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.qualifications?.map((qual, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {qual}
                      <XIcon 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeQualification(idx)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffModal;
