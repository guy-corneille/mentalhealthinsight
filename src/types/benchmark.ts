export interface BenchmarkCriteria {
    id: number;
    name: string;
    description: string | null;
    category: 'audit' | 'assessment';
    weight: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface BenchmarkComparison {
    id: string;
    facility_a: number;
    facility_a_name: string;
    facility_b: number;
    facility_b_name: string;
    comparison_date: string;
    overall_score_a: number;
    overall_score_b: number;
    detailed_results: {
        facility_a: FacilityMetrics;
        facility_b: FacilityMetrics;
    };
    created_by: string | null;
    created_by_name: string | null;
    created_at: string;
    updated_at: string;
}

interface FacilityMetrics {
    audit_scores: {
        average: number;
        count: number;
        period: string;
    };
    patient_coverage: {
        total_patients: number;
        assessed_patients: number;
        coverage_percentage: number;
    };
    recent_assessments: {
        count: number;
        average_score: number;
        period: string;
    };
}

export interface FacilityRanking {
    id: string;
    facility: number;
    facility_name: string;
    ranking_date: string;
    overall_rank: number;
    total_facilities: number;
    audit_score: number;
    previous_rank: number | null;
    created_at: string;
    updated_at: string;
} 