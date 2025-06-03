import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';
import { Assessment, PaginatedResponse } from '../types';

export function useAssessments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>('assessment_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Data fetching with pagination and sorting
  const fetchAssessments = useCallback(async () => {
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

      console.log('Fetching assessments with params:', params.toString());
      const response = await api.get<PaginatedResponse<Assessment>>(`/api/assessments/?${params.toString()}`);

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
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection]);

  // Query for assessments data
  const { 
    data: paginatedData, 
    isLoading, 
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['assessments', searchQuery, currentPage, pageSize, sortBy, sortDirection],
    queryFn: fetchAssessments,
    refetchOnWindowFocus: false,
  });

  // Extract data from response
  const totalCount = paginatedData?.count || 0;
  const assessments = paginatedData?.results || [];
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Mutation for deleting assessments
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.delete(`/api/assessments/${id}/`),
    onSuccess: () => {
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
    onError: (error) => {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assessment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleDeleteAssessment = useCallback((id: number | string) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
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

  // Handle view assessment details
  const handleViewAssessment = useCallback((id: string) => {
    window.location.href = `/assessments/${id}`;
  }, []);

  // Handle continue assessment
  const handleContinueAssessment = useCallback((assessment: Assessment) => {
    window.location.href = `/patients/assess/${assessment.patient}?assessmentId=${assessment.id}`;
  }, []);

  return {
    assessments,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    error,
    isFetching,
    searchQuery,
    handleSearchChange,
    handleDeleteAssessment,
    handlePageChange,
    handlePageSizeChange,
    sortBy,
    sortDirection,
    handleSort,
    handleViewAssessment,
    handleContinueAssessment,
    refetch,
    totalPages
  };
}
