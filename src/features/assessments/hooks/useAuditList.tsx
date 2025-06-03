import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { Audit } from '../types';
import { useAuditReportActions } from '@/components/assessments/utils/auditReportUtils';

export interface AuditApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Audit[];
}

export function useAuditList() {
  const { toast } = useToast();
  const { handlePrintAuditReport } = useAuditReportActions();
  
  // State for search, pagination and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>('audit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Function to handle search query changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);
  
  // Function to handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // Function to handle page size changes
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);
  
  // Function to handle sorting
  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortBy]);

  // Fetch audits data from API
  const fetchAudits = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString()
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (sortBy) {
        const orderingValue = sortDirection === 'desc' ? `-${sortBy}` : sortBy;
        params.append('ordering', orderingValue);
      }

      const response = await api.get<AuditApiResponse>(`/api/audits/?${params.toString()}`);

      if (!response || typeof response.count !== 'number') {
        throw new Error('Invalid response format from server');
      }

      return {
        count: response.count,
        results: response.results || [],
        next: response.next,
        previous: response.previous
      };
    } catch (error) {
      console.error('Error fetching audits:', error);
      throw error;
    }
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection]);

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
    refetchOnWindowFocus: false
  });

  // Extract data from response
  const audits = auditData?.results || [];
  const totalCount = auditData?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Handle view audit details
  const handleViewAudit = useCallback((audit: Audit) => {
    if (audit.status === 'scheduled') {
      // For scheduled audits, redirect to evaluation page
      window.location.href = `/audits/${audit.id}/evaluate`;
    } else {
      // For completed/missed audits, show details
      window.location.href = `/audits/${audit.id}`;
    }
  }, []);

  // Handle print audit report
  const handlePrintAudit = useCallback((audit: Audit) => {
    handlePrintAuditReport(audit);
  }, [handlePrintAuditReport]);

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
    handlePrintAudit,
    refetch
  };
}
