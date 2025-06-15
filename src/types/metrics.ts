export interface MetricSnapshot {
    id: number;
    facility: number;
    facility_name: string;
    metric_type: string;
    timestamp: string;
    active_patients: number;
    discharged_patients: number;
    inactive_patients: number;
    capacity_utilization: number;
    total_assessments: number;
    completed_assessments: number;
    completion_rate: number;
    ninety_day_total_assessments: number;
    ninety_day_completed_assessments: number;
    ninety_day_completion_rate: number;
}

export interface FacilityMetrics {
    current: MetricSnapshot;
    history: MetricSnapshot[];
}

export interface MetricsResponse {
    results: MetricSnapshot[];
    count: number;
}

export interface MetricError {
    message: string;
    code?: string;
} 