
import React from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NewAuditButtonProps {
  facilityId: number;
  facilityName?: string;
  className?: string;
}

const NewAuditButton: React.FC<NewAuditButtonProps> = ({ facilityId, facilityName, className }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log("Starting new audit for facility:", facilityId, facilityName);
    navigate(`/facilities/audit/${facilityId}`);
  };
  
  return (
    <Button 
      className={`bg-healthiq-600 hover:bg-healthiq-700 ${className || ''}`} 
      onClick={handleClick}
    >
      <ClipboardIcon className="h-4 w-4 mr-2" />
      Start Audit
    </Button>
  );
};

export default NewAuditButton;
