
import React from 'react';
import StatCard from '@/components/ui/StatCard';
import { Users, Building2, UserCheck, FileText } from 'lucide-react';
import { useFacilities } from '@/services/facilityService';
import { useStaff } from '@/services/staffService';
import { usePatients } from '@/services/patientService';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';

const StatsOverview: React.FC = () => {
  // Fetch real data from our API services
  const { data: facilities, isLoading: facilitiesLoading } = useFacilities();
  const { data: staff, isLoading: staffLoading } = useStaff();
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const { chartData, isLoading: assessmentsLoading } = useAssessmentStats();

  // Calculate real counts from our data
  const facilityCount = facilities?.length || 0;
  const staffCount = staff?.length || 0;
  const patientCount = patients?.length || 0;
  const assessmentCount = chartData?.summary?.totalCount || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Facility Card - Real Data */}
      <StatCard
        title="Total Facilities"
        value={facilitiesLoading ? "Loading..." : facilityCount}
        icon={<Building2 className="h-4 w-4 text-healthiq-600" />}
        description="Mental health facilities in system"
      />
      
      {/* Staff Card - Real Data */}
      <StatCard
        title="Healthcare Staff"
        value={staffLoading ? "Loading..." : staffCount}
        icon={<Users className="h-4 w-4 text-healthiq-600" />}
        description="Professionals across all facilities"
      />
      
      {/* Patients Card - Real Data */}
      <StatCard
        title="Registered Patients"
        value={patientsLoading ? "Loading..." : patientCount}
        icon={<UserCheck className="h-4 w-4 text-healthiq-600" />}
        description="Patients under care"
      />
      
      {/* Assessment Card - Real Data */}
      <StatCard
        title="Assessments"
        value={assessmentsLoading ? "Loading..." : assessmentCount}
        icon={<FileText className="h-4 w-4 text-healthiq-600" />}
        description="Total completed assessments"
      />
    </div>
  );
};

export default StatsOverview;
