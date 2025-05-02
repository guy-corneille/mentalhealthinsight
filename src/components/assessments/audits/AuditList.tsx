
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/common/PaginationControls';
import SearchInput from '@/components/common/SearchInput';
import { Input } from '@/components/ui/input';

interface AuditApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}

interface Audit {
  id: string;
  facility: number;
  facility_name: string;
  audit_date: string;
  overall_score: number;
  status: 'scheduled' | 'completed' | 'incomplete';
  notes: string;
  auditor_name?: string;
  auditor?: string;
  scheduled_date?: string;
}

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
  
  // State for search, pagination and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>('audit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch audits with pagination and sorting
  const fetchAudits = async () => {
    try {
      const response = await api.get<AuditApiResponse>('/api/audits/', {
        params: {
          search: searchQuery || undefined,
          page: currentPage,
          page_size: pageSize,
          ordering: sortBy ? (sortDirection === 'desc' ? `-${sortBy}` : sortBy) : '-audit_date'
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching audits:', error);
      throw error;
    }
  };

  // Query for audits data
  const {
    data: auditData,
    isLoading,
    isFetching,
    error
  } = useQuery({
    queryKey: ['audits', searchQuery, currentPage, pageSize, sortBy, sortDirection],
    queryFn: fetchAudits,
    refetchOnWindowFocus: false,
  });

  const audits = auditData?.results || [];
  const totalCount = auditData?.count || 0;

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // View audit details
  const handleViewAudit = (id: string) => {
    window.location.href = `/audits/review/${id}`;
  };

  // Continue audit
  const handleContinueAudit = (audit: Audit) => {
    window.location.href = `/facilities/audit/${audit.facility}?auditId=${audit.id}`;
  };

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

  return (
    <div className="space-y-6">
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
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
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
                  No audits found. Schedule or start a new audit to get started.
                </TableCell>
              </TableRow>
            ) : (
              audits.map((audit: Audit) => {
                const scoreColor =
                  audit.overall_score >= 80 ? 'bg-emerald-500' :
                  audit.overall_score >= 60 ? 'bg-amber-500' :
                  'bg-rose-500';
                
                const auditDate = audit.audit_date 
                  ? new Date(audit.audit_date).toLocaleDateString() 
                  : (audit.scheduled_date ? new Date(audit.scheduled_date).toLocaleDateString() : 'Not set');

                return (
                  <TableRow key={audit.id}>
                    <TableCell>{audit.facility_name}</TableCell>
                    <TableCell>{auditDate}</TableCell>
                    <TableCell>
                      {audit.status === 'completed' ? (
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={audit.overall_score}
                            className="h-2 w-16"
                            indicatorClassName={scoreColor}
                          />
                          <span className="text-sm font-medium">
                            {audit.overall_score}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(audit.status)}</TableCell>
                    <TableCell>{audit.auditor_name || audit.auditor || 'Not assigned'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {audit.notes || 'No notes'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {audit.status === 'scheduled' || audit.status === 'incomplete' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContinueAudit(audit)}
                          >
                            Continue
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAudit(audit.id)}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
              onChange={(e) => setPageSize(Number(e.target.value))}
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
