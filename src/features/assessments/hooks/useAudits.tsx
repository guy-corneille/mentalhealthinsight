import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';
import { Audit, PaginatedResponse } from '../types';

export function useAudits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>('audit_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

      const response = await api.get<PaginatedResponse<Audit>>(`/api/audits/?${params.toString()}`);

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

  const totalCount = paginatedData?.count || 0;
  const audits = paginatedData?.results || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.delete(`/api/audits/${id}/`),
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
    setCurrentPage(1);
  }, []);

  const handleDeleteAudit = useCallback((id: number | string) => {
    if (window.confirm("Are you sure you want to delete this audit?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  return {
    audits,
    totalCount,
    currentPage,
    pageSize,
    totalPages,
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
    refetch
  };
} 