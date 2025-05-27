
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
    console.log(`Fetching assessments, page: ${currentPage}, size: ${pageSize}, search: ${searchQuery || 'none'}, sort: ${sortBy || 'none'}, direction: ${sortDirection}`);
    
    try {
      // Make sure we're using the correct endpoint structure
      const response = await api.get<PaginatedResponse<Assessment>>('/api/assessments/', {
        params: {
          search: searchQuery || undefined,
          page: currentPage,
          page_size: pageSize,
          ordering: sortBy ? (sortDirection === 'desc' ? `-${sortBy}` : sortBy) : '-assessment_date'
        }
      });
      
      console.log(`API Success - Count: ${response.count}, Results: ${response.results?.length}`);
      return response;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection]);

  // Query for assessment data
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

  // Ensure we have the correct total count and results extraction
  const totalCount = paginatedData?.count || 0;
  const assessments = paginatedData?.results || [];
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Mutation for deleting assessments
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => {
      console.log(`Deleting assessment with ID: ${id} (type: ${typeof id})`);
      return api.delete(`/api/assessments/${id}/`);
    },
    onSuccess: () => {
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
      });
      
      // Invalidate and refetch to ensure we have the latest data
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
    console.log("Search query changed to:", value);
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleDeleteAssessment = useCallback((id: number | string) => {
    if (window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      console.log(`Confirming deletion of assessment ID: ${id} (type: ${typeof id})`);
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handlePageChange = useCallback((page: number) => {
    console.log(`Changing to page ${page}`);
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    console.log(`Changing page size to ${size}`);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

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
    refetch,
    totalPages
  };
}
