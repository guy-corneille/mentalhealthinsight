import { MetricSnapshot, MetricsResponse, FacilityMetrics } from '@/types/metrics';
import { api } from '@/core/api';

export const metricsService = {
    // Get current metrics for a specific facility
    getFacilityMetrics: async (facilityId: number): Promise<FacilityMetrics> => {
        const response = await api.get<MetricsResponse>(`/metrics/${facilityId}/history/`);
        // Handle both wrapped and unwrapped responses
        const metrics = Array.isArray(response.data) ? response.data : response.data.results || [];
        return {
            current: metrics[0], // Most recent snapshot
            history: metrics.slice(1) // Historical data
        };
    },

    // Get metrics for all facilities
    getAllFacilitiesMetrics: async (): Promise<MetricSnapshot[]> => {
        try {
            console.log('Fetching metrics...');
            const response = await api.get<MetricSnapshot[] | MetricsResponse>('/metrics/facility/');
            console.log('Raw response:', response.data);
            
            // Handle both wrapped and unwrapped responses
            const metrics = Array.isArray(response.data) ? response.data : response.data.results || [];
            console.log('Processed metrics:', metrics);
            return metrics;
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw error;
        }
    },

    // Get historical metrics for a facility
    getFacilityMetricsHistory: async (
        facilityId: number,
        startDate?: string,
        endDate?: string
    ): Promise<MetricSnapshot[]> => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const response = await api.get<MetricsResponse>(
            `/metrics/${facilityId}/history/?${params.toString()}`
        );
        // Handle both wrapped and unwrapped responses
        return Array.isArray(response.data) ? response.data : response.data.results || [];
    }
}; 