import React from 'react';
import StatCard from '@/components/ui/StatCard';
import { Building2, Users, UserCheck, FileText, ClipboardCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { useFacilities, Facility } from '@/services/facilityService';
import { useStaff } from '@/services/staffService';
import { usePatients } from '@/services/patientService';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

// Interface for the audit count response
interface AuditStatsResponse {
  summary: {
    totalCount: number;
    averageScore: number;
  };
}

interface StaffMember {
  id: number;
  name: string;
  // ... other staff fields
}

interface ApiResponse<T> {
  results: T[];
  count: number;
}

const StatsOverview: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch real data from our API services
  const { data: facilities } = useFacilities();
  const { data: staff } = useStaff();
  const { data: patients, isLoading: patientsLoading } = usePatients(1, 10);
  const { chartData: assessmentData, isLoading: assessmentsLoading } = useAssessmentStats();

  // Use reportService for audit count
  const {
    data: auditData,
    isLoading: auditsLoading,
    error: auditError
  } = useQuery({
    queryKey: ['auditBasicStats'],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      const filters = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };

      const response = await api.get<AuditStatsResponse>('/api/reports/audit-statistics/', { params: filters });
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Calculate real counts from our data
  const facilityCount = Array.isArray(facilities) 
    ? facilities.length 
    : ((facilities as ApiResponse<Facility>)?.results?.length || 0);
  
  const staffCount = Array.isArray(staff) 
    ? staff.length 
    : ((staff as ApiResponse<StaffMember>)?.results?.length || 0);
  
  const patientCount = patients?.count || 0;
  const assessmentCount = assessmentData?.summary?.totalCount || 0;
  const auditCount = auditData?.summary?.totalCount || 0;
  const auditScore = auditData?.summary?.averageScore || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      {/* Facility Card */}
      <StatCard
        title="Total Facilities"
        value={facilityCount}
        icon={<Building2 className="h-6 w-6 text-healthiq-600" />}
        description="Mental health facilities in system"
        onClick={() => navigate('/facilities')}
        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      />

      {/* Staff Card */}
      <StatCard
        title="Healthcare Staff"
        value={staffCount}
        icon={<Users className="h-6 w-6 text-healthiq-600" />}
        description="Professionals across all facilities"
        onClick={() => navigate('/staff')}
        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      />

      {/* Patients Card */}
      <StatCard
        title="Registered Patients"
        value={patientsLoading ? "Loading..." : patientCount}
        icon={<UserCheck className="h-6 w-6 text-healthiq-600" />}
        description="Patients under care"
        onClick={() => navigate('/patients')}
        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      />

      {/* Assessment Card */}
      <StatCard
        title="Assessments"
        value={assessmentsLoading ? "Loading..." : assessmentCount}
        icon={<FileText className="h-6 w-6 text-healthiq-600" />}
        description="Total completed assessments"
        onClick={() => navigate('/assessments')}
        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      />

      {/* Audit Card */}
      <StatCard
        title="Audits"
        value={auditsLoading ? "Loading..." : `${auditCount}`}
        icon={<ClipboardCheck className="h-6 w-6 text-healthiq-600" />}
        description="Total facility audits"
        onClick={() => navigate('/audits')}
        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      />

      {/* Benchmarking Card */}
      <StatCard
        title="Benchmarking"
        value="->"
        icon={<TrendingUp className="h-6 w-6 text-healthiq-600" />}
        description="Facility performance comparisons"
        onClick={() => navigate('/benchmarks')}
        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      />
    </div>
  );
};

export default StatsOverview;
