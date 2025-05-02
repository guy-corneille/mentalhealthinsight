
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

  // Use reportService for audit count to maintain consistency with other API calls
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

      // The API actually returns the data directly, not nested under a data property
      const response = await api.get<AuditCountResponse>('/api/reports/audits/count', { params: filters });

      // Explicitly log the response for debugging
      console.log("Audit count API response:", response);

      // Our API service already extracts the data for us, so we can return it directly
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate real counts from our data
  const facilityCount = facilities?.length || 0;
  const staffCount = staff?.length || 0;
  const patientCount = patients?.length || 0;

  // Get the assessment count from the API data
  const assessmentCount = assessmentData?.summary?.totalCount || 0;

  // Get the audit count directly from API data - fixed to account for the correct response structure
  const auditCount = auditData?.count || 0;

  // Handle error states for audit card
  const auditValue = auditsLoading
    ? "Loading..."
    : (auditError ? "Error loading" : auditCount);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      {/* Facility Card */}
      <StatCard
        title="Total Facilities"
        value={facilitiesLoading ? "Loading..." : facilityCount}
        icon={<Building2 className="h-6 w-6 text-healthiq-600" />}
        description="Mental health facilities in system"
        onClick={onFacilityClick}
        className="bg-white p-4 rounded shadow-md"
      />

      {/* Staff Card */}
      <StatCard
        title="Healthcare Staff"
        value={staffLoading ? "Loading..." : staffCount}
        icon={<Users className="h-6 w-6 text-healthiq-600" />}
        description="Professionals across all facilities"
        onClick={onStaffClick}
        className="bg-white p-4 rounded shadow-md"
      />

      {/* Patients Card */}
      <StatCard
        title="Registered Patients"
        value={patientsLoading ? "Loading..." : patientCount}
        icon={<UserCheck className="h-6 w-6 text-healthiq-600" />}
        description="Patients under care"
        onClick={onPatientClick}
        className="bg-white p-4 rounded shadow-md"
      />

      {/* Assessment Card */}
      <StatCard
        title="Assessments"
        value={assessmentsLoading ? "Loading..." : assessmentCount}
        icon={<FileText className="h-6 w-6 text-healthiq-600" />}
        description="Total completed assessments"
        onClick={onAssessmentClick}
        className="bg-white p-4 rounded shadow-md"
      />

      {/* Audit Card - Using API Data */}
      <StatCard
        title="Audits"
        value={auditValue}
        icon={<ClipboardCheck className="h-6 w-6 text-healthiq-600" />}
        description="Total facility audits"
        onClick={onAuditClick}
        className="bg-white p-4 rounded shadow-md"
      />

      {/* Benchmarking Card - Coming Soon */}
      <StatCard
        title="Benchmarking"
        value="Coming Soon"
        icon={<TrendingUp className="h-6 w-6 text-healthiq-600" />}
        description="Facility performance comparisons"
        onClick={onBenchmarkingClick}
        className="bg-gray-50 p-4 rounded shadow-md"
      />
    </div>
  );
};

export default StatsOverview;
