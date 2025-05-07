
export interface Assessment {
  id: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  facilityName: string;
  assessmentType: 'initial' | 'followup' | 'discharge';
  score: number;
  date: string;
  staffId: string;
  staffName: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  notes?: string;
  criteriaScores?: {
    criteriaId: string;
    criteriaName: string;
    score: number;
  }[];
}

export interface Audit {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string;
  score: number;
  status: 'completed' | 'in-progress' | 'scheduled';
  conductedBy: string;
  notes?: string;
  criteriaScores?: {
    criteriaId: string;
    criteriaName: string;
    score: number;
  }[];
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  category: string;
  standard: string;
  isRequired: boolean;
  indicators: string[];
  weight: number;
}

export interface AssessmentStatistics {
  totalCount: number;
  countByFacility: {
    facilityId: string;
    facilityName: string;
    count: number;
  }[];
  countByType: {
    initial: number;
    followup: number;
    discharge: number;
  };
  countByPeriod: {
    period: string;
    count: number;
  }[];
  averageScore: number;
  patientCoverage: number;
  scoreByCriteria: {
    criteriaId: string;
    criteriaName: string;
    averageScore: number;
  }[];
}

export interface AuditStatistics {
  totalCount: number;
  completed: number;
  scheduled: number;
  inProgress: number;
  countByFacility: {
    facilityId: string;
    facilityName: string;
    count: number;
  }[];
  countByPeriod: {
    period: string;
    count: number;
  }[];
  averageScore: number;
  facilityCoverage: number;
  scoreByCriteria: {
    criteriaId: string;
    criteriaName: string;
    averageScore: number;
  }[];
}

export interface AssessmentReportParams {
  facilityId?: string;
  startDate?: string;
  endDate?: string;
  assessmentType?: string;
}

export interface AuditReportParams {
  facilityId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}
