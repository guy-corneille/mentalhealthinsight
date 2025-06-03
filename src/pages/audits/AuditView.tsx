import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Audit } from '@/features/assessments/types';
import { useAuditReportActions } from '@/components/assessments/utils/auditReportUtils';
import api from '@/services/api';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Building2, Calendar, ClipboardCheck, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';

export default function AuditView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handlePrintAuditReport } = useAuditReportActions();

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Direct API call without destructuring
        const response = await api.get(`/api/audits/${id}/`);
        console.log('Fetched audit data:', response);
        
        // Validate the response
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format');
        }
        
        setAudit(response as Audit);
      } catch (err: any) {
        console.error('Error fetching audit:', err);
        setError(err?.response?.data?.detail || 'Failed to load audit details. Please try again.');
        toast({
          title: "Error",
          description: err?.response?.data?.detail || "Failed to load audit details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAudit();
    }
  }, [id, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'missed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 69) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner className="w-8 h-8" />
        </div>
      </Layout>
    );
  }

  if (error || !audit) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-500 mb-4">{error || 'Audit not found'}</p>
          <Button onClick={() => navigate('/audits')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audits
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/audits')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audits
          </Button>
          <Button onClick={() => handlePrintAuditReport(audit)}>
            <FileText className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Audit Details</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(audit.status)}>
                  {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">
                  {audit.status === 'scheduled' 
                    ? `Scheduled for ${formatDate(audit.scheduled_date)}`
                    : `Conducted on ${formatDate(audit.audit_date)}`
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Facility Information
              </h2>
              <div className="space-y-2">
                <p><span className="font-medium">Facility:</span> {audit.facility_name}</p>
                <p><span className="font-medium">Auditor:</span> {audit.auditor_name || 'Not Assigned'}</p>
                <p><span className="font-medium">Audit Date:</span> {formatDate(audit.audit_date)}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Overall Score
              </h2>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(audit.overall_score)}`}>
                  {audit.overall_score}%
                </div>
                <Progress value={audit.overall_score} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {audit.criteria_scores && audit.criteria_scores.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2" />
              Criteria Scores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {audit.criteria_scores.map((score, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{score.criteria_name}</span>
                    <span className={`font-bold ${getScoreColor(score.score)}`}>
                      {score.score}%
                    </span>
                  </div>
                  <Progress value={score.score} className="h-2 mb-3" />
                  {score.individual_scores && score.individual_scores.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-600">Individual Scores:</p>
                      <div className="grid gap-2">
                        {score.individual_scores.map((individualScore, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{individualScore.name}</span>
                            <span className={`font-medium ${getScoreColor(individualScore.score)}`}>
                              {individualScore.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {score.notes && (
                    <p className="mt-3 text-sm text-gray-600">{score.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        )}

        {audit.notes && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Notes
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{audit.notes}</p>
          </Card>
        )}
      </div>
    </Layout>
  );
} 