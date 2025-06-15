import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  EyeIcon, 
  ClipboardIcon,
  CalendarIcon,
  Trash2Icon,
  MoreHorizontalIcon 
} from 'lucide-react';

interface Audit {
  id: string;
  facility: number;
  status: 'scheduled' | 'completed' | 'missed';
  audit_date?: string;
  scheduled_date: string;
  overall_score: number;
  missed_reason?: string;
  notes?: string;
}

interface AuditActionsProps {
  audit: Audit;
  onViewDetails: (audit: Audit) => void;
  onTakeAudit: (audit: Audit) => void;
  onReschedule: (audit: Audit) => void;
  onDeleteAudit: (id: string) => void;
}

const AuditActions: React.FC<AuditActionsProps> = ({
  audit,
  onViewDetails,
  onTakeAudit,
  onReschedule,
  onDeleteAudit
}) => {
  const handleDelete = () => {
    onDeleteAudit(audit.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Audit Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {audit.status === 'scheduled' ? (
          <>
            <DropdownMenuItem onClick={() => onTakeAudit(audit)}>
              <ClipboardIcon className="h-4 w-4 mr-2" />
              Take Audit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReschedule(audit)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Reschedule
            </DropdownMenuItem>
          </>
        ) : audit.status === 'completed' && (
          <DropdownMenuItem onClick={() => onViewDetails(audit)}>
            <EyeIcon className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-rose-600"
          onClick={handleDelete}
        >
          <Trash2Icon className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuditActions; 