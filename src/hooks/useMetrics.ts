import { useState, useEffect } from 'react';
import { MetricSnapshot, FacilityMetrics } from '../types/metrics';
import { metricsService } from '../services/metricsService';

export const useMetrics = (facilityId?: number) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<FacilityMetrics | null>(null);
    const [allFacilitiesMetrics, setAllFacilitiesMetrics] = useState<MetricSnapshot[]>([]);

    // Fetch metrics for a specific facility
    const fetchFacilityMetrics = async (id: number) => {
        try {
            setLoading(true);
            const data = await metricsService.getFacilityMetrics(id);
            setMetrics(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch facility metrics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch metrics for all facilities
    const fetchAllFacilitiesMetrics = async () => {
        try {
            setLoading(true);
            console.log('Fetching all facilities metrics...');
            const data = await metricsService.getAllFacilitiesMetrics();
            console.log('Received metrics:', data);
            setAllFacilitiesMetrics(data);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics for all facilities';
            setError(errorMessage);
            console.error('Error fetching metrics:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        if (facilityId) {
            fetchFacilityMetrics(facilityId);
        } else {
            fetchAllFacilitiesMetrics();
        }
    }, [facilityId]);

    return {
        loading,
        error,
        metrics,
        allFacilitiesMetrics,
        refreshFacilityMetrics: facilityId ? () => fetchFacilityMetrics(facilityId) : undefined,
        refreshAllMetrics: !facilityId ? fetchAllFacilitiesMetrics : undefined,
    };
}; 