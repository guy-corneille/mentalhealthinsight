import React from 'react';
import { useAuditList } from '@/features/assessments/hooks/useAuditList';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, MoreVertical, Eye, FileText, ClipboardCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationControls from '@/components/common/PaginationControls';
import SearchInput from '@/components/common/SearchInput';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

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
    handleViewAudit,
    handlePrintAudit
  } = useAuditList();

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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          {audit.status === 'scheduled' ? (
                            <DropdownMenuItem onClick={() => handleViewAudit(audit)} className="text-blue-600">
                              <ClipboardCheck className="mr-2 h-4 w-4" />
                              Continue Audit
                          </DropdownMenuItem>
                        ) : (
                            <>
                              <DropdownMenuItem onClick={() => handleViewAudit(audit)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintAudit(audit)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Print Report
                          </DropdownMenuItem>
                            </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
        {!isLoading && audits.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
      )}
    </div>
    </TooltipProvider>
  );
};

export default AuditList;
