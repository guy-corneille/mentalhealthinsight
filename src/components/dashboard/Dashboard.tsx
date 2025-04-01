
import React from 'react';
import StatsOverview from './StatsOverview';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';
import { useAuditStats } from '@/features/assessments/hooks/useAuditStats';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { chartData: assessmentData, isLoading: assessmentsLoading } = useAssessmentStats();
  const { chartData: auditData, isLoading: auditsLoading } = useAuditStats();

  const navigateToFacilities = () => navigate('/facilities');
  const navigateToStaff = () => navigate('/staff');
  const navigateToPatients = () => navigate('/patients');
  const navigateToAssessments = () => navigate('/assessments');
  const navigateToAudits = () => navigate('/audits');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      
      {/* Interactive stats cards that redirect to corresponding pages */}
      <StatsOverview 
        onFacilityClick={navigateToFacilities}
        onStaffClick={navigateToStaff}
        onPatientClick={navigateToPatients}
        onAssessmentClick={navigateToAssessments}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Assessment Stats Summary */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/assessments/trends')}>
          <CardHeader>
            <CardTitle>Assessment Statistics</CardTitle>
            <CardDescription>Overall assessment performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {assessmentsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading assessment data...</p>
              </div>
            ) : assessmentData?.countByPeriodData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assessmentData.countByPeriodData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Audit Count" name="Assessments" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No assessment data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Audit Stats Summary */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/audits')}>
          <CardHeader>
            <CardTitle>Audit Statistics</CardTitle>
            <CardDescription>Facility audit overview</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {auditsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading audit data...</p>
              </div>
            ) : auditData?.countByPeriodData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={auditData.countByPeriodData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Audit Count" name="Audits" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No audit data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Average Assessment Scores */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/assessments/trends')}>
          <CardHeader>
            <CardTitle>Assessment Scores</CardTitle>
            <CardDescription>Average scores by criteria</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {assessmentsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading assessment data...</p>
              </div>
            ) : assessmentData?.scoreByCriteriaData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={assessmentData.scoreByCriteriaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Bar dataKey="value" name="Average Score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No assessment data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Average Audit Scores */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/audits')}>
          <CardHeader>
            <CardTitle>Audit Scores</CardTitle>
            <CardDescription>Average scores by criteria</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {auditsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading audit data...</p>
              </div>
            ) : auditData?.scoreByCriteriaData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={auditData.scoreByCriteriaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Bar dataKey="value" name="Average Score" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No audit data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
