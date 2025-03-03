
import React from 'react';
import { ClipboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuditForm from './AuditForm';

interface NewAuditButtonProps {
  facilityId: number;
  facilityName: string;
}

const NewAuditButton: React.FC<NewAuditButtonProps> = ({ facilityId, facilityName }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-healthiq-600 hover:bg-healthiq-700">
          <ClipboardIcon className="h-4 w-4 mr-2" />
          New Audit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Facility Audit</DialogTitle>
          <DialogDescription>
            Complete an audit assessment for {facilityName}
          </DialogDescription>
        </DialogHeader>
        <AuditForm facilityId={facilityId} facilityName={facilityName} />
      </DialogContent>
    </Dialog>
  );
};

export default NewAuditButton;
