import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Audit } from '@/features/assessments/types';
import { useAuditReportActions } from '@/components/assessments/utils/auditReportUtils';
import api from '@/services/api';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Building2, Calendar, ClipboardCheck, User } from 'lucide-react';

export default function AuditDetails() {
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
        
        const { data } = await api.get(`/api/audits/${id}/`);
        setAudit(data);
      } catch (err) {
        console.error('Error fetching audit:', err);
        setError('Failed to load audit details. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load audit details. Please try again.",
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

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Excellent';
    if (score >= 69) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Audit not found'}</p>
        <Button onClick={() => navigate('/audits')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audits
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
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

      <div className="space-y-6">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Audit Details</h1>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(audit.status)}>
                  {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(audit.created_at), 'PPP')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facility Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Facility Information
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Facility ID:</span>
                  <p className="font-medium">{audit.facility}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Facility Name:</span>
                  <p className="font-medium">{audit.facility_name}</p>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Audit Information
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Auditor:</span>
                  <p className="font-medium">{audit.auditor_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Audit Date:</span>
                  <p className="font-medium">{format(new Date(audit.audit_date), 'PPP')}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Score Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ClipboardCheck className="w-5 h-5 mr-2" />
            Overall Score
          </h2>
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(audit.overall_score)}`}>
              {audit.overall_score}%
            </div>
            <Badge className={getStatusColor(getScoreLabel(audit.overall_score).toLowerCase())}>
              {getScoreLabel(audit.overall_score)}
            </Badge>
            <Progress value={audit.overall_score} className="w-full max-w-md h-2 mt-4" />
          </div>
        </Card>

        {/* Criteria Scores */}
        {audit.criteria_scores && audit.criteria_scores.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2" />
              Criteria Scores
            </h2>
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {audit.criteria_scores.map((score, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{score.criteria_name}</span>
                      <span className={`font-bold ${getScoreColor(score.score)}`}>
                        {score.score}%
                      </span>
                    </div>
                    <Progress value={score.score} className="h-2" />
                    {score.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{score.notes}</p>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}

        {/* Notes */}
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
    </div>
  );
} 