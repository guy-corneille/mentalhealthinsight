
import React, { useState } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NewAuditDialog from '@/components/assessments/audits/NewAuditDialog';

interface NewAuditButtonProps {
  facilityId: number;
  facilityName: string;
}

const NewAuditButton: React.FC<NewAuditButtonProps> = ({ facilityId, facilityName }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleStartAudit = () => {
    console.log("Starting audit for facility:", facilityId);
    navigate(`/facilities/audit/${facilityId}`);
  };

  return (
    <>
      <Button 
        className="bg-healthiq-600 hover:bg-healthiq-700" 
        onClick={handleStartAudit}
      >
        <ClipboardIcon className="h-4 w-4 mr-2" />
        New Audit
      </Button>
    </>
  );
};

export default NewAuditButton;
