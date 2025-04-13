
import React from 'react';
import StatCard from '@/components/ui/StatCard';
import { Building2, Users, UserCheck, FileText, ClipboardCheck, TrendingUp } from 'lucide-react';
import { useFacilities } from '@/services/facilityService';
import { useStaff } from '@/services/staffService';
import { usePatients } from '@/services/patientService';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface StatsOverviewProps {
  onFacilityClick?: () => void;
  onStaffClick?: () => void;
  onPatientClick?: () => void;
  onAssessmentClick?: () => void;
  onAuditClick?: () => void;
  onBenchmarkingClick?: () => void;
}

// Interface for the audit count response
interface AuditCountResponse {
  count: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  onFacilityClick,
  onStaffClick,
  onPatientClick,
  onAssessmentClick,
  onAuditClick,
  onBenchmarkingClick
}) => {
  // Fetch real data from our API services
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities();
  const { data: staff, isLoading: staffLoading } = useStaff();
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { chartData: assessmentData, isLoading: assessmentsLoading } = useAssessmentStats();

  // Use a dedicated API call for audit count
  const { 
    data: auditData, 
    isLoading: auditsLoading,
    error: auditError
  } = useQuery({
    queryKey: ['auditBasicStats'],
    queryFn: async () => {
      // Set a date range for the last 12 months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      
      const filters = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      
      // Fetch actual data from API - use the new audit count endpoint
      const response = await api.get<AuditCountResponse>('/api/reports/audits/count/', { params: filters });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate real counts from our data
  const facilityCount = facilities?.length || 0;
  const staffCount = staff?.length || 0;
  const patientCount = patients?.length || 0;
  
  // Get the assessment count from the API data
  const assessmentCount = assessmentData?.summary?.totalCount || 0;
  
  // Get the audit count directly from API data
  const auditCount = auditData?.count || 0;

  // Handle error states for audit card
  const auditValue = auditsLoading 
    ? "Loading..." 
    : (auditError ? "Error loading" : auditCount);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {/* Facility Card */}
      <StatCard
        title="Total Facilities"
        value={facilitiesLoading ? "Loading..." : facilityCount}
        icon={<Building2 className="h-4 w-4 text-healthiq-600" />}
        description="Mental health facilities in system"
        onClick={onFacilityClick}
      />
      
      {/* Staff Card */}
      <StatCard
        title="Healthcare Staff"
        value={staffLoading ? "Loading..." : staffCount}
        icon={<Users className="h-4 w-4 text-healthiq-600" />}
        description="Professionals across all facilities"
        onClick={onStaffClick}
      />
      
      {/* Patients Card */}
      <StatCard
        title="Registered Patients"
        value={patientsLoading ? "Loading..." : patientCount}
        icon={<UserCheck className="h-4 w-4 text-healthiq-600" />}
        description="Patients under care"
        onClick={onPatientClick}
      />
      
      {/* Assessment Card */}
      <StatCard
        title="Assessments"
        value={assessmentsLoading ? "Loading..." : assessmentCount}
        icon={<FileText className="h-4 w-4 text-healthiq-600" />}
        description="Total completed assessments"
        onClick={onAssessmentClick}
      />
      
      {/* Audit Card - Using API Data */}
      <StatCard
        title="Audits"
        value={auditValue}
        icon={<ClipboardCheck className="h-4 w-4 text-healthiq-600" />}
        description="Total facility audits"
        onClick={onAuditClick}
      />
      
      {/* Benchmarking Card - Coming Soon */}
      <StatCard
        title="Benchmarking"
        value="Coming Soon"
        icon={<TrendingUp className="h-4 w-4 text-healthiq-600" />}
        description="Facility performance comparisons"
        onClick={onBenchmarkingClick}
        className="bg-gray-50"
      />
    </div>
  );
};

export default StatsOverview;
