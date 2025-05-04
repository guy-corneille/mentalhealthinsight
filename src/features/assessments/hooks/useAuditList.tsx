
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useToast } from "@/hooks/use-toast";

export interface Audit {
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

export interface AuditApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}

export function useAuditList() {
  const { toast } = useToast();
  
  // State for search, pagination and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>('audit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Function to handle search query changes
  const handleSearchChange = useCallback((value: string) => {
    console.log("Search query changed to:", value);
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);
  
  // Function to handle page changes
  const handlePageChange = useCallback((page: number) => {
    console.log(`Changing to page ${page}`);
    setCurrentPage(page);
  }, []);
  
  // Function to handle page size changes
  const handlePageSizeChange = useCallback((size: number) => {
    console.log(`Changing page size to ${size}`);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);
  
  // Function to handle sorting
  const handleSort = useCallback((column: string) => {
    console.log(`Sorting by column: ${column}`);
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortBy, sortDirection]);

  // Fetch audits data from API
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
    error,
    refetch
  } = useQuery({
    queryKey: ['audits', searchQuery, currentPage, pageSize, sortBy, sortDirection],
    queryFn: fetchAudits,
    refetchOnWindowFocus: false,
  });

  // Extract data from response
  const audits = auditData?.results || [];
  const totalCount = auditData?.count || 0;

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Handle view audit details
  const handleViewAudit = useCallback((id: string) => {
    window.location.href = `/audits/review/${id}`;
  }, []);

  // Handle continue audit
  const handleContinueAudit = useCallback((audit: Audit) => {
    window.location.href = `/facilities/audit/${audit.facility}?auditId=${audit.id}`;
  }, []);

  return {
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
    handleContinueAudit,
    refetch
  };
}
