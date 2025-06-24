import React, { useState } from 'react';
import { useAuditList } from '@/features/assessments/hooks/useAuditList';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import PaginationControls from '@/components/common/PaginationControls';
import SearchInput from '@/components/common/SearchInput';
import AuditActions from './AuditActions';
import RescheduleAuditDialog from './RescheduleAuditDialog';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface SortableHeaderProps {
  column: string;
  label: string;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label, sortBy, sortDirection, onSort }) => {
  return (
    <Button 
      variant="ghost" 
      className="p-0 h-auto font-semibold flex items-center text-xs"
      onClick={() => onSort(column)}
    >
      {label}
      {sortBy === column ? (
        sortDirection === 'asc' ? 
          <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
          <ArrowDownIcon className="h-3 w-3 ml-1" />
      ) : (
        <ArrowUpDownIcon className="h-3 w-3 ml-1" />
      )}
    </Button>
  );
};

const AuditList: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  const {
    audits,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    isFetching,
    error,
    searchQuery,
    sortBy,
    sortDirection,
    totalPages,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    refetch
  } = useAuditList();

  // Action handlers
  const handleViewAudit = (audit: any) => {
    navigate(`/audits/view/${audit.id}`);
  };
  // ?auditId=${audit.id}
  const handleTakeAudit = (audit: any) => {
    // Navigate to audit form with auditId
    window.location.href = `/facilities/audit/${audit.facility}`;
  };

  const handleReschedule = (audit: any) => {
    setSelectedAudit(audit);
    setIsRescheduleDialogOpen(true);
  };

  const handleDeleteAudit = async (id: string) => {
    try {
      await api.delete(`/api/audits/${id}/`);
      toast({
        title: 'Audit Deleted',
        description: 'The audit has been successfully deleted.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the audit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>;
      case 'missed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Missed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500';  // Green for 75 and above
    if (score >= 69) return 'bg-yellow-500';   // Yellow for 69-74
    if (score >= 50) return 'bg-orange-500';   // Orange for 50-68
    return 'bg-red-500';                       // Red for below 50
  };

  // Get date display
  const getDateDisplay = (audit: any) => {
    const isScheduled = audit.status === 'scheduled';
    const date = isScheduled ? audit.scheduled_date : audit.audit_date;
    if (!date) return '—';
    
    try {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const formattedTime = dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formattedDate}</span>
          <span className="text-sm text-muted-foreground">{formattedTime}</span>
        </div>
      );
    } catch (err) {
      console.error('Error formatting date:', err);
      return '—';
    }
  };

  return (
    <TooltipProvider>
    <div className="space-y-6 w-[90%] mx-auto">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchInput
            placeholder="Search facilities, auditors..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isFetching && !isLoading && (
        <div className="text-sm text-muted-foreground text-center py-2 bg-muted/30 rounded">
          Loading audit data...
        </div>
      )}

      {/* Audits table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  column="facility_name"
                  label="Facility"
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  column="audit_date"
                    label="Status & Date"
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  column="overall_score"
                  label="Score"
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  column="auditor_name"
                  label="Auditor"
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Spinner className="w-8 h-8" />
                  <span className="ml-2">Loading audits...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-rose-500">
                  <p>Error loading audits</p>
                  <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
                </TableCell>
              </TableRow>
            ) : audits.length === 0 ? (
              <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No audits found
                  {searchQuery && <p className="text-sm mt-1">Try adjusting your search</p>}
                </TableCell>
              </TableRow>
            ) : (
              audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.facility_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(audit.status)}
                        {getDateDisplay(audit)}
                      </div>
                    </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={audit.overall_score} 
                        className="w-16 h-2"
                        indicatorClassName={getScoreColor(audit.overall_score)}
                      />
                      <span className="text-sm">{audit.overall_score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{audit.auditor_name}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="line-clamp-2 text-sm text-muted-foreground">
                            {audit.notes || 'No notes'}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs whitespace-normal">{audit.notes || 'No notes'}</p>
                        </TooltipContent>
                      </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">
                      <AuditActions
                        audit={audit}
                        onViewDetails={handleViewAudit}
                        onTakeAudit={handleTakeAudit}
                        onReschedule={handleReschedule}
                        onDeleteAudit={handleDeleteAudit}
                      />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
        {!isLoading && audits.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} audits
            </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Reschedule Dialog */}
      {selectedAudit && (
        <RescheduleAuditDialog
          open={isRescheduleDialogOpen}
          onOpenChange={setIsRescheduleDialogOpen}
          auditId={selectedAudit.id}
          onAuditRescheduled={() => {
            refetch();
            setSelectedAudit(null);
          }}
          />
      )}
    </TooltipProvider>
  );
};

export default AuditList;
