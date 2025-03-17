
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffMemberDisplay } from '@/services/staffService';
import QualificationsSection from './QualificationsSection';

interface StaffModalFormProps {
  formData: Partial<StaffMemberDisplay>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFacilityChange: (value: string) => void;
  handleStatusChange: (value: string) => void;
  newQualification: string;
  setNewQualification: (value: string) => void;
  addQualification: () => void;
  removeQualification: (index: number) => void;
  facilities: Array<{ id: number; name: string }>;
}

const StaffModalForm: React.FC<StaffModalFormProps> = ({
  formData,
  handleInputChange,
  handleFacilityChange,
  handleStatusChange,
  newQualification,
  setNewQualification,
  addQualification,
  removeQualification,
  facilities
}) => {
  return (
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
          value={formData.facilityId?.toString()}
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
          value={formData.status}
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
      
      <QualificationsSection
        qualifications={formData.qualifications || []}
        newQualification={newQualification}
        setNewQualification={setNewQualification}
        addQualification={addQualification}
        removeQualification={removeQualification}
      />
    </div>
  );
};

export default StaffModalForm;
