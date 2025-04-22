
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, FileEdit, Trash2, Calendar, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuditData {
  id: number;
  facility: number;
  facility_name: string;
  auditor: number;
  auditor_name: string;
  audit_date: string;
  overall_score: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  results?: AuditData[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

const AuditList: React.FC = () => {
  const [audits, setAudits] = useState<AuditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse | AuditData[]>('/api/audits/');
      
      if (response && 'results' in response && Array.isArray(response.results)) {
        setAudits(response.results);
      } else if (Array.isArray(response)) {
        setAudits(response);
      } else {
        setError('Received unexpected data format from API');
        setAudits([]);
      }
    } catch (err) {
      console.error('Error fetching audits:', err);
      setError('Failed to load audits');
      toast({
        title: 'Error',
        description: 'Failed to load audits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this audit?')) {
      try {
        await api.delete(`/api/audits/${id}/`);
        setAudits(audits.filter(audit => audit.id !== id));
        toast({
          title: 'Success',
          description: 'Audit deleted successfully',
        });
      } catch (err) {
        console.error('Error deleting audit:', err);
        toast({
          title: 'Error',
          description: 'Failed to delete audit',
          variant: 'destructive',
        });
      }
    }
  };

  const handleStatusChange = async (auditId: number, newStatus: string) => {
    try {
      await api.patch(`/api/audits/${auditId}/`, {
        status: newStatus
      });
      
      // Update local state
      setAudits(prevAudits => 
        prevAudits.map(audit => 
          audit.id === auditId ? { ...audit, status: newStatus } : audit
        )
      );
      
      toast({
        title: 'Status Updated',
        description: `Audit status changed to ${newStatus}`,
      });
    } catch (err) {
      console.error('Error updating audit status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update audit status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-emerald-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'incomplete':
        return <Badge className="bg-red-500">Incomplete</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['scheduled', 'completed', 'incomplete'];
    return allStatuses.filter(status => status !== currentStatus.toLowerCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
        <span className="ml-2">Loading audits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline" 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No audits found. Complete an audit evaluation to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Auditor</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell>
                {audit.audit_date 
                  ? format(new Date(audit.audit_date), 'MMM d, yyyy') 
                  : 'N/A'}
              </TableCell>
              <TableCell className="font-medium">{audit.facility_name}</TableCell>
              <TableCell>{audit.auditor_name || 'System'}</TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant="outline" 
                  className={
                    audit.overall_score >= 80 ? "bg-emerald-50 text-emerald-700" :
                    audit.overall_score >= 60 ? "bg-amber-50 text-amber-700" :
                    "bg-red-50 text-red-700"
                  }
                >
                  {audit.overall_score}%
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {getStatusBadge(audit.status)}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Change status to:
                    </div>
                    <DropdownMenuSeparator />
                    {getStatusOptions(audit.status).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(audit.id, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="float-right">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => navigate(`/facilities/${audit.facility}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Facility
                    </DropdownMenuItem>
                    {audit.status === 'completed' && (
                      <DropdownMenuItem 
                        onClick={() => navigate(`/audits/review/${audit.id}`)}
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Review Audit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => navigate(`/facilities/audit/${audit.facility}`)}
                    >
                      <FileEdit className="h-4 w-4 mr-2" />
                      New Audit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(audit.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditList;
