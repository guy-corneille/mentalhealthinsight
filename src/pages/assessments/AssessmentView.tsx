import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Printer, Calendar, User, Building, FileText } from 'lucide-react';
import api from '@/services/api';
import { Assessment, PaginatedResponse } from '@/features/assessments/types';
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
        const response = await api.get<PaginatedResponse<Assessment>>('/api/assessments/', {
          params: {
            id: id
          }
        });
        
        if (response.results && response.results.length > 0) {
          console.log('Found assessment:', response.results[0]);
          setAssessment(response.results[0]);
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
              <div className="space-y-6">
                {/* Score */}
                {assessment.score > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                    <div className="flex items-center gap-4">
                      <Progress 
                        value={assessment.score} 
                        className="w-full h-2"
                        indicatorClassName={getScoreColor(assessment.score)}
                      />
                      <span className="font-medium">{assessment.score}%</span>
                    </div>
                  </div>
                )}

                {/* Criteria */}
                {assessment.criteria_name && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Assessment Criteria</p>
                    <p className="font-medium">{assessment.criteria_name}</p>
                  </div>
                )}

                {/* Notes */}
                {assessment.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="whitespace-pre-wrap">{assessment.notes}</p>
                  </div>
                )}

                {/* Missed Reason */}
                {assessment.missed_reason && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Missed Reason</p>
                    <p className="text-red-600">{assessment.missed_reason}</p>
                  </div>
                )}

                {/* Indicator Scores */}
                {assessment.indicator_scores && assessment.indicator_scores.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Detailed Scores</p>
                    <div className="space-y-2">
                      {assessment.indicator_scores.map((score) => (
                        <div key={score.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span>{score.indicator_name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Score:</span>
                            <span className="font-medium">{score.score}%</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              score.score >= 75 ? 'bg-emerald-100 text-emerald-800' :
                              score.score >= 69 ? 'bg-yellow-100 text-yellow-800' :
                              score.score >= 50 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {score.score >= 75 ? 'Excellent' :
                               score.score >= 69 ? 'Good' :
                               score.score >= 50 ? 'Fair' :
                               'Poor'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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