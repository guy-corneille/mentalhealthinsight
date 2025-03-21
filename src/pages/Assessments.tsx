
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssessmentList from '@/components/assessments/AssessmentList';
import AssessmentTrends from '@/components/assessments/AssessmentTrends';
import AssessmentEvaluation from '@/components/assessments/AssessmentEvaluation';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFacilities } from '@/services/patientService';

const Assessments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultTab = location.hash === '#trends' ? 'trends' : 'list';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const { data: facilities } = useFacilities();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/assessments${value === 'trends' ? '#trends' : ''}`);
  };

  const handleStartEvaluation = (patientId: string, facilityId: string) => {
    setSelectedPatientId(patientId);
    setSelectedFacilityId(facilityId);
    setIsEvaluating(true);
  };

  const handleCompleteEvaluation = () => {
    setIsEvaluating(false);
    setActiveTab('list');
  };

  const handleCancelEvaluation = () => {
    setIsEvaluating(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Create, view, and manage individual patient assessments and evaluation results.
          </p>
        </div>
        
        {isEvaluating ? (
          <AssessmentEvaluation 
            patientId={selectedPatientId}
            facilityId={selectedFacilityId}
            onComplete={handleCompleteEvaluation}
            onCancel={handleCancelEvaluation}
          />
        ) : (
          <Tabs defaultValue={defaultTab} value={activeTab} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="list">Assessment List</TabsTrigger>
              <TabsTrigger value="trends">Assessment Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-6 mt-6">
              <AssessmentList onStartAssessment={handleStartEvaluation} />
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6 mt-6">
              <AssessmentTrends />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Assessments;
