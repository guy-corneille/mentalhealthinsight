
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';
import { Assessment, PaginatedResponse } from '../types';

export function useAssessments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Data fetching without pagination
  const fetchAssessments = useCallback(async () => {
    console.log(`Fetching all assessments, search: ${searchQuery || 'none'}`);
    
    try {
      // Setting a large page_size to effectively get all items
      const response = await api.get<PaginatedResponse<Assessment>>('/assessments/', {
        params: {
          search: searchQuery || undefined,
          page_size: 1000 // Request a large number to get all items
        }
      });
      
      console.log(`API Success - Results count: ${response.results?.length}, Total: ${response.count}`);
      return response.results || [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }, [searchQuery]);

  // Query for assessment data
  const { 
    data: assessments, 
    isLoading, 
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['assessments', searchQuery],
    queryFn: fetchAssessments,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always refetch when needed
  });

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
  };

  const handleDeleteAssessment = (id: number | string) => {
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      console.log(`Confirming deletion of assessment ID: ${id} (type: ${typeof id})`);
      deleteMutation.mutate(id);
    }
  };

  return {
    assessments,
    isLoading,
    error,
    isFetching,
    searchQuery,
    handleSearchChange,
    handleDeleteAssessment,
  };
}
