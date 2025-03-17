
import { useState, useEffect } from 'react';
import { StaffMemberDisplay } from '@/services/staffService';
import { useFacilities } from '@/services/facilityService';
import { useToast } from '@/hooks/use-toast';

export const useStaffForm = (
  staffData: StaffMemberDisplay | null,
  isOpen: boolean
) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<StaffMemberDisplay>>({
    name: '',
    position: '',
    department: '',
    facilityId: 1,
    facilityName: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    qualifications: [],
    contact: {
      email: '',
      phone: ''
    }
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
        facilityId: staffData.facilityId,
        facilityName: staffData.facilityName,
        joinDate: staffData.joinDate,
        status: staffData.status,
        qualifications: [...staffData.qualifications],
        contact: { ...staffData.contact }
      });
    } else {
      // Use first facility from the API if available
      const defaultFacility = facilities.length > 0 ? facilities[0] : { id: 1, name: 'Unknown Facility' };
      
      setFormData({
        name: '',
        position: '',
        department: '',
        facilityId: defaultFacility.id,
        facilityName: defaultFacility.name,
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
  }, [staffData, isOpen, facilities]);

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
    
    if (!formData.contact?.email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.contact?.phone) {
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
  const prepareDataForSubmission = (): Partial<StaffMemberDisplay> => {
    return {
      ...formData,
      // Set facility to facilityId for the backend
      facility: formData.facilityId,
      // Map frontend fields to backend field names
      contact_email: formData.contact?.email,
      contact_phone: formData.contact?.phone,
      join_date: formData.joinDate
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
