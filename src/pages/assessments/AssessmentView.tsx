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
import { AxiosResponse } from 'axios';
import Layout from '@/components/layout/Layout';

const AssessmentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response: AxiosResponse<Assessment> = await api.get(`/api/assessments/${id}/`);
        setAssessment(response.data);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError('Failed to load assessment details');
        toast({
          title: "Error",
          description: "Failed to load assessment details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [id, toast]);

  const handlePrint = () => {
    window.print();
  };

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
      <div className="container mx-auto py-8 px-4 animate-fade-in">
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
          <Button onClick={handlePrint} className="flex items-center">
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
                  {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
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
                      {new Date(assessment.scheduled_date).toLocaleString()}
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
                    <p className="text-sm text-muted-foreground mb-2">Indicator Scores</p>
                    <div className="space-y-4">
                      {assessment.indicator_scores.map((score) => (
                        <div key={score.id} className="border rounded-lg p-4">
                          <p className="font-medium mb-2">{score.indicator_name}</p>
                          <div className="flex items-center gap-4">
                            <Progress 
                              value={score.score} 
                              className="w-full h-2"
                              indicatorClassName={getScoreColor(score.score)}
                            />
                            <span className="font-medium">{score.score}%</span>
                          </div>
                          {score.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{score.notes}</p>
                          )}
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