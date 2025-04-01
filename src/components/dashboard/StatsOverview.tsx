
import React from 'react';
import StatCard from '@/components/ui/StatCard';
import { Building2, Users, UserCheck, FileText, ClipboardCheck, TrendingUp } from 'lucide-react';
import { useFacilities } from '@/services/facilityService';
import { useStaff } from '@/services/staffService';
import { usePatients } from '@/services/patientService';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';

interface StatsOverviewProps {
  onFacilityClick?: () => void;
  onStaffClick?: () => void;
  onPatientClick?: () => void;
  onAssessmentClick?: () => void;
  onAuditClick?: () => void;
  onBenchmarkingClick?: () => void;
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
  const { chartData: auditData, isLoading: auditsLoading } = useAuditStats();

  // Calculate real counts from our data
  const facilityCount = facilities?.length || 0;
  const staffCount = staff?.length || 0;
  const patientCount = patients?.length || 0;
  
  // Get the assessment count from the API data
  const assessmentCount = assessmentData?.summary?.totalCount || 0;
  
  // Get the audit count from the API data
  const auditCount = auditData?.summary?.totalCount || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {/* Facility Card - Real Data */}
      <StatCard
        title="Total Facilities"
        value={facilitiesLoading ? "Loading..." : facilityCount}
        icon={<Building2 className="h-4 w-4 text-healthiq-600" />}
        description="Mental health facilities in system"
        onClick={onFacilityClick}
      />
      
      {/* Staff Card - Real Data */}
      <StatCard
        title="Healthcare Staff"
        value={staffLoading ? "Loading..." : staffCount}
        icon={<Users className="h-4 w-4 text-healthiq-600" />}
        description="Professionals across all facilities"
        onClick={onStaffClick}
      />
      
      {/* Patients Card - Real Data */}
      <StatCard
        title="Registered Patients"
        value={patientsLoading ? "Loading..." : patientCount}
        icon={<UserCheck className="h-4 w-4 text-healthiq-600" />}
        description="Patients under care"
        onClick={onPatientClick}
      />
      
      {/* Assessment Card - Real Data */}
      <StatCard
        title="Assessments"
        value={assessmentsLoading ? "Loading..." : assessmentCount}
        icon={<FileText className="h-4 w-4 text-healthiq-600" />}
        description="Total completed assessments"
        onClick={onAssessmentClick}
      />
      
      {/* Audit Card - Real Data */}
      <StatCard
        title="Audits"
        value={auditsLoading ? "Loading..." : auditCount}
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
