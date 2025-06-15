import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Printer, Calendar, User, Building, FileText } from 'lucide-react';
import api from '@/services/api';
import { Assessment } from '@/features/assessments/types';
import { useReportActions } from '@/components/assessments/utils/reportUtils';
import Layout from '@/components/layout/Layout';

const AssessmentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handlePrintReport } = useReportActions();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setError('No assessment ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching assessment with ID:', id);
        const data = await api.get<Assessment>(`/api/assessments/${id}/`);
        console.log('API Response:', data);
        
        if (data) {
          console.log('Found assessment:', data);
          setAssessment(data);
        } else {
          throw new Error('Assessment not found');
        }
      } catch (err: any) {
        console.error('Error fetching assessment:', err);
        const errorMessage = err.response?.data?.detail || 'Failed to load assessment details';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [id, toast]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 69) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
        <span className="ml-2">Loading assessment details...</span>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Assessment not found'}</p>
        <Button onClick={() => navigate('/assessments')}>
          Return to Assessments
        </Button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/assessments')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
          <Button onClick={() => handlePrintReport(assessment)} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>

        {/* Assessment Details */}
        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assessment Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  assessment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  assessment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assessment.status?.charAt(0).toUpperCase() + assessment.status?.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">
                      {new Date(assessment.scheduled_date || '').toLocaleString()}
                    </p>
                  </div>
                </div>
                {assessment.assessment_date && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Date</p>
                      <p className="font-medium">
                        {new Date(assessment.assessment_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient & Facility Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{assessment.patient}</p>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{assessment.patient_name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Facility Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Facility</p>
                  <p className="font-medium">{assessment.facility_name}</p>
                  {assessment.evaluator_name && (
                    <>
                      <p className="text-sm text-muted-foreground">Evaluator</p>
                      <p className="font-medium">{assessment.evaluator_name}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Assessment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Assessment Type</p>
                  <p className="font-medium">{assessment.criteria_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <div className="flex items-center gap-4">
                    <Progress value={assessment.score} className="w-full" />
                    <span className="font-medium">{assessment.score.toFixed(1)}%</span>
                  </div>
                </div>
                {assessment.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium whitespace-pre-wrap">{assessment.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentView; 