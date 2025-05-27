import React from 'react';
import { useAuditList } from '@/features/assessments/hooks/useAuditList';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, MoreVertical } from 'lucide-react';
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
    handleContinueAudit
  } = useAuditList();

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'incomplete':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Incomplete</Badge>;
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

  return (
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
                  label="Date"
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
                  column="status"
                  label="Status"
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
                <TableCell colSpan={7} className="h-24 text-center">
                  <Spinner size="lg" />
                  <span className="ml-2">Loading audits...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-rose-500">
                  <p>Error loading audits</p>
                  <p className="text-sm text-muted-foreground mt-1">Please try again later</p>
                </TableCell>
              </TableRow>
            ) : audits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No audits found
                  {searchQuery && <p className="text-sm mt-1">Try adjusting your search</p>}
                </TableCell>
              </TableRow>
            ) : (
              audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.facility_name}</TableCell>
                  <TableCell>{new Date(audit.audit_date).toLocaleDateString()}</TableCell>
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
                  <TableCell>{getStatusBadge(audit.status)}</TableCell>
                  <TableCell>{audit.auditor_name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {audit.notes || '-'}
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
                        {audit.status === 'scheduled' || audit.status === 'incomplete' ? (
                          <DropdownMenuItem onClick={() => handleContinueAudit(audit)}>
                            Continue
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleViewAudit(audit.id)}>
                            View
                          </DropdownMenuItem>
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
      {!isLoading && totalCount > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} - {Math.min(currentPage * pageSize, totalCount)} of {totalCount} audits
          </div>
          
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <select 
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="text-sm bg-muted/50 border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditList;
