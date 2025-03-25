
import React, { useState } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NewAuditButtonProps {
  facilityId: number;
  facilityName: string;
}

const NewAuditButton: React.FC<NewAuditButtonProps> = ({ facilityId, facilityName }) => {
  const navigate = useNavigate();
  
  const handleStartAudit = () => {
    navigate(`/facilities/audit/${facilityId}`);
  };

  return (
    <Button 
      className="bg-healthiq-600 hover:bg-healthiq-700" 
      onClick={handleStartAudit}
    >
      <ClipboardIcon className="h-4 w-4 mr-2" />
      New Audit
    </Button>
  );
};

export default NewAuditButton;
