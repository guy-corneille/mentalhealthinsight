
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';

// Types
interface Assessment {
  id: number | string;
  patient: string;
  patient_name?: string;
  facility: string | number;
  facility_name?: string;
  assessment_date: string;
  score: number;
  notes: string;
  evaluator: string;
  evaluator_name?: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assessment[];
}

export function useAssessmentList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('assessment_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Function to fetch assessments
  const fetchAssessments = useCallback(async () => {
    try {
      console.log(`Fetching assessments: page=${currentPage}, size=${pageSize}, search=${searchQuery}, sort=${sortBy}, direction=${sortDirection}`);
      
      const ordering = sortDirection === 'desc' ? `-${sortBy}` : sortBy;
      
      const response = await api.get<PaginatedResponse>('/api/assessments/', {
        params: {
          search: searchQuery || undefined,
          page: currentPage,
          page_size: pageSize,
          ordering
        }
      });
      
      console.log('Assessment API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching assessments:', error);
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
    queryKey: ['assessments', searchQuery, currentPage, pageSize, sortBy, sortDirection],
    queryFn: fetchAssessments,
    refetchOnWindowFocus: false
  });

  // Extract data from response
  const assessments = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  // Mutation for deleting assessments
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => {
      return api.delete(`/api/assessments/${id}/`);
    },
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

  // Event handlers
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
    handleDeleteAssessment,
    refetch
  };
}

export type { Assessment };
