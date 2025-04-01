
import React from 'react';
import StatsOverview from './StatsOverview';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const navigateToFacilities = () => navigate('/facilities');
  const navigateToStaff = () => navigate('/staff');
  const navigateToPatients = () => navigate('/patients');
  const navigateToAssessments = () => navigate('/assessments');
  const navigateToAudits = () => navigate('/audits');
  const navigateToBenchmarking = () => {
    // This will be implemented in the future
    alert('Benchmarking feature coming soon!');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      {/* Interactive stats cards that redirect to corresponding pages */}
      <StatsOverview 
        onFacilityClick={navigateToFacilities}
        onStaffClick={navigateToStaff}
        onPatientClick={navigateToPatients}
        onAssessmentClick={navigateToAssessments}
        onAuditClick={navigateToAudits}
        onBenchmarkingClick={navigateToBenchmarking}
      />
    </div>
  );
};

export default Dashboard;
