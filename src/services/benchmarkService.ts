import axios from 'axios';
import { BenchmarkCriteria, BenchmarkComparison, FacilityRanking } from '../types/benchmark';

const API_URL = 'http://localhost:8000/api';

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const benchmarkService = {
    // Benchmark Criteria
    getBenchmarkCriteria: async () => {
        const response = await axios.get<PaginatedResponse<BenchmarkCriteria>>(`${API_URL}/benchmark-criteria/`);
        return response.data.results;
    },

    createBenchmarkCriteria: async (criteria: Partial<BenchmarkCriteria>) => {
        const response = await axios.post<BenchmarkCriteria>(`${API_URL}/benchmark-criteria/`, criteria);
        return response.data;
    },

    updateBenchmarkCriteria: async (id: number, criteria: Partial<BenchmarkCriteria>) => {
        const response = await axios.patch<BenchmarkCriteria>(`${API_URL}/benchmark-criteria/${id}/`, criteria);
        return response.data;
    },

    deleteBenchmarkCriteria: async (id: number) => {
        await axios.delete(`${API_URL}/benchmark-criteria/${id}/`);
    },

    // Facility Comparisons
    compareFacilities: async (facilityAId: number, facilityBId: number) => {
        const response = await axios.post<BenchmarkComparison>(`${API_URL}/benchmark-comparisons/compare_facilities/`, {
            facility_a: facilityAId,
            facility_b: facilityBId
        });
        return response.data;
    },

    getComparisons: async () => {
        const response = await axios.get<PaginatedResponse<BenchmarkComparison>>(`${API_URL}/benchmark-comparisons/`);
        return response.data.results;
    },

    getComparison: async (id: string) => {
        const response = await axios.get<BenchmarkComparison>(`${API_URL}/benchmark-comparisons/${id}/`);
        return response.data;
    },

    // Facility Rankings
    calculateRankings: async () => {
        const response = await axios.post<FacilityRanking[]>(`${API_URL}/facility-rankings/calculate_rankings/`);
        return response.data;
    },

    getCurrentRankings: async () => {
        const response = await axios.get<FacilityRanking[] | PaginatedResponse<FacilityRanking>>(`${API_URL}/facility-rankings/current_rankings/`);
        // Handle both array and paginated response
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data.results || [];
    },

    getRankingHistory: async (facilityId: number) => {
        const response = await axios.get<PaginatedResponse<FacilityRanking>>(`${API_URL}/facility-rankings/`, {
            params: {
                facility: facilityId
            }
        });
        return response.data.results;
    }
}; 