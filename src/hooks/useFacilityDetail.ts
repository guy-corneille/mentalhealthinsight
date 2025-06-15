import { useState, useEffect } from 'react';
import axios from 'axios';

interface FacilityDetail {
  facility: {
    id: number;
    name: string;
    status: string;
    capacity: number;
    type: string;
  };
  current_metrics: {
    timestamp: string;
    active_patients: number;
    capacity_utilization: number;
    today: {
      total_assessments: number;
      completed_assessments: number;
      completion_rate: number;
    };
    ninety_days: {
      total_assessments: number;
      completed_assessments: number;
      completion_rate: number;
    };
  };
  assessment_breakdown: {
    today: number;
    ninety_days: number;
  };
}

export const useFacilityDetail = (facilityId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityDetail, setFacilityDetail] = useState<FacilityDetail | null>(null);

  useEffect(() => {
    const fetchFacilityDetail = async () => {
      if (!facilityId) {
        setError('Facility ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/metrics/${facilityId}/detailed/`);
        setFacilityDetail(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch facility details');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetail();
  }, [facilityId]);

  return { loading, error, facilityDetail };
}; 
 