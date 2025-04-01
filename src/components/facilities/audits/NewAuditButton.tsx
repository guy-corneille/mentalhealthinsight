
import React, { useState } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewAuditDialog from '@/components/assessments/audits/NewAuditDialog';

interface NewAuditButtonProps {
  facilityId: number;
  facilityName: string;
}

const NewAuditButton: React.FC<NewAuditButtonProps> = ({ facilityId, facilityName }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        className="bg-healthiq-600 hover:bg-healthiq-700" 
        onClick={() => setIsDialogOpen(true)}
      >
        <ClipboardIcon className="h-4 w-4 mr-2" />
        New Audit
      </Button>

      <NewAuditDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onFacilitySelect={(selectedFacilityId) => {
          console.log("Selected facility for audit:", selectedFacilityId);
        }}
      />
    </>
  );
};

export default NewAuditButton;
