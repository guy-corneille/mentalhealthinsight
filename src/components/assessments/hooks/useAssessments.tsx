
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

  // Data fetching with pagination
  const fetchAssessments = useCallback(async () => {
    console.log(`Fetching assessments, page: ${currentPage}, size: ${pageSize}, search: ${searchQuery || 'none'}`);
    
    try {
      const response = await api.get<PaginatedResponse<Assessment>>('/assessments/', {
        params: {
          search: searchQuery || undefined,
          page: currentPage,
          page_size: pageSize
        }
      });
      
      console.log(`API Success - Results count: ${response.results?.length}, Total: ${response.count}`);
      return response;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }, [searchQuery, currentPage, pageSize]);

  // Query for assessment data
  const { 
    data: paginatedData, 
    isLoading, 
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['assessments', searchQuery, currentPage, pageSize],
    queryFn: fetchAssessments,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always refetch when needed
  });

  // Ensure we have the correct total count
  const totalCount = paginatedData?.count || 0;
  const assessments = paginatedData?.results || [];

  // Log pagination details for debugging
  console.log(`Current page: ${currentPage}, Page size: ${pageSize}, Total count: ${totalCount}`);
  console.log(`Number of assessments displayed: ${assessments.length}`);
  
  // Mutation for deleting assessments
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => {
      console.log(`Deleting assessment with ID: ${id} (type: ${typeof id})`);
      return api.delete(`/assessments/${id}/`);
    },
    onSuccess: () => {
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
      });
      
      // Invalidate and refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      refetch();
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleDeleteAssessment = (id: number | string) => {
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      console.log(`Confirming deletion of assessment ID: ${id} (type: ${typeof id})`);
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    console.log(`Changing to page ${page}`);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    console.log(`Changing page size to ${size}`);
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

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
  };
}
