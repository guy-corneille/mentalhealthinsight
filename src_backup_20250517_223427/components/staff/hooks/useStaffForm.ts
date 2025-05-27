
import { useState, useEffect } from 'react';
import { StaffMember, StaffQualification } from '@/services/staff/types';
import { useFacilities } from '@/services/facilityService';
import { useToast } from '@/hooks/use-toast';

export const useStaffForm = (
  staffData: StaffMember | null,
  isOpen: boolean
) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    position: '',
    department: '',
    facility: 1,
    facility_name: '',
    join_date: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    qualifications: [],
    email: '',
    phone: ''
  });
  
  const [newQualification, setNewQualification] = useState('');
  
  // Get facilities from API
  const { data: facilities = [] } = useFacilities();

  // Reset form when opening or changing staff to edit
  useEffect(() => {
    if (staffData) {
      setFormData({
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        facility: staffData.facility,
        facility_name: staffData.facility_name,
        join_date: staffData.join_date,
        status: staffData.status,
        qualifications: [...(staffData.qualifications || [])],
        email: staffData.email,
        phone: staffData.phone
      });
    } else {
      // Use first facility from the API if available
      const defaultFacility = facilities.length > 0 ? facilities[0] : { id: 1, name: 'Unknown Facility' };
      
      setFormData({
        name: '',
        position: '',
        department: '',
        facility: defaultFacility.id,
        facility_name: defaultFacility.name,
        join_date: new Date().toISOString().split('T')[0],
        status: 'Active' as const,
        qualifications: [],
        email: '',
        phone: ''
      });
    }
    setNewQualification('');
  }, [staffData, isOpen, facilities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFacilityChange = (value: string) => {
    const facilityId = parseInt(value);
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      setFormData({
        ...formData,
        facility: facilityId,
        facility_name: facility.name
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
      const newQual: StaffQualification = { qualification: newQualification.trim() };
      setFormData({
        ...formData,
        qualifications: [...(formData.qualifications || []), newQual]
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

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.position?.trim()) {
      toast({
        title: "Validation Error",
        description: "Position is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.department?.trim()) {
      toast({
        title: "Validation Error",
        description: "Department is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.phone) {
      toast({
        title: "Validation Error",
        description: "Phone is required",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // Prepare data for backend
  const prepareDataForSubmission = (): Partial<StaffMember> => {
    return {
      ...formData,
    };
  };

  return {
    formData,
    newQualification,
    setNewQualification,
    facilities,
    handleInputChange,
    handleFacilityChange,
    handleStatusChange,
    addQualification,
    removeQualification,
    validateForm,
    prepareDataForSubmission
  };
};
