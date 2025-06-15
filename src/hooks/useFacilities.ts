import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Facility {
    id: number;
    name: string;
    facility_type: string;
    status: string;
}

export interface UseFacilitiesResult {
    facilities: Facility[];
    isLoading: boolean;
    error: Error | null;
}

export function useFacilities(): UseFacilitiesResult {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await axios.get<{ results: Facility[] }>('/api/facilities/');
                setFacilities(response.data.results);
                setError(null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    return { facilities, isLoading, error };
} 