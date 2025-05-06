
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

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

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}

export function useAuditList() {
  const { toast } = useToast();
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('audit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Function to fetch audits
  const fetchAudits = useCallback(async () => {
    try {
      console.log(`Fetching audits: page=${currentPage}, size=${pageSize}, search=${searchQuery}, sort=${sortBy}, direction=${sortDirection}`);
      
      const ordering = sortDirection === 'desc' ? `-${sortBy}` : sortBy;
      
      const response = await api.get<PaginatedResponse>('/api/audits/', {
        params: {
          search: searchQuery || undefined,
          page: currentPage,
          page_size: pageSize,
          ordering
        }
      });
      
      console.log('Audit API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching audits:', error);
      throw error;
    }
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection]);

  // Query for fetching data
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['audits', searchQuery, currentPage, pageSize, sortBy, sortDirection],
    queryFn: fetchAudits,
    refetchOnWindowFocus: false
  });

  // Extract data from response
  const audits = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortBy, sortDirection]);

  // Actions for audits
  const handleViewAudit = useCallback((id: string) => {
    window.location.href = `/audits/review/${id}`;
  }, []);

  const handleContinueAudit = useCallback((audit: Audit) => {
    window.location.href = `/facilities/audit/${audit.facility}?auditId=${audit.id}`;
  }, []);

  return {
    audits,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    searchQuery,
    sortBy,
    sortDirection,
    isLoading,
    isFetching,
    error,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    handleViewAudit,
    handleContinueAudit,
    refetch
  };
}
