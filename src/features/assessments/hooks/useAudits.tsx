import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Assessment } from '../types';
import { PaginatedResponse } from '@/types/common';
import { AxiosResponse } from 'axios';

export function useAudits() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>('audit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Data fetching with pagination and sorting
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

      const { data } = await api.get<AxiosResponse<PaginatedResponse<Assessment>>>(`/api/audits/?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching audits:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch audits. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection, toast]);

  // Query for audits data
  const { 
    data: paginatedData, 
    isLoading, 
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['audits', searchQuery, currentPage, pageSize, sortBy, sortDirection],
    queryFn: fetchAudits,
    refetchOnWindowFocus: false,
  });

  // Extract data from response
  const totalCount = paginatedData?.count || 0;
  const audits = paginatedData?.results || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Mutation for deleting audits
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/audits/${id}/`),
    onSuccess: () => {
      toast({
        title: "Audit deleted",
        description: "The audit has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
    onError: (error) => {
      console.error('Error deleting audit:', error);
      toast({
        title: "Error",
        description: "Failed to delete audit. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleDeleteAudit = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this audit?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortBy]);

  // Handle view audit details
  const handleViewAudit = useCallback((id: string) => {
    navigate(`/audits/view/${id}`);
  }, [navigate]);

  // Handle continue audit
  const handleContinueAudit = useCallback((audit: Assessment) => {
    navigate(`/facilities/audit/${audit.facility}?auditId=${audit.id}`);
  }, [navigate]);

  return {
    audits,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    error,
    isFetching,
    searchQuery,
    handleSearchChange,
    handleDeleteAudit,
    handlePageChange,
    handlePageSizeChange,
    sortBy,
    sortDirection,
    handleSort,
    handleViewAudit,
    handleContinueAudit,
    refetch,
    totalPages
  };
} 