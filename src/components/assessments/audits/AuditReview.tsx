
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

interface AuditData {
  id: number;
  facility: number;
  facility_name: string;
  auditor: number;
  auditor_name: string;
  audit_date: string;
  overall_score: number;
  status: string;
  notes?: string;
  criteria_scores: {
    id: number;
    criteria_name: string;
    score: number;
    notes?: string;
  }[];
  created_at: string;
  updated_at: string;
}

const AuditReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching audit details for ID: ${id}`);
        const response = await api.get<AuditData>(`/api/audits/${id}/`);
        console.log("Audit data received:", response);
        setAudit(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching audit details:', err);
        setError('Failed to load audit details');
        toast({
          title: 'Error',
          description: 'Failed to load audit details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuditDetails();
    }
  }, [id, toast]);

  const handleConductNewAudit = () => {
    if (audit && audit.facility) {
      navigate(`/facilities/audit/${audit.facility}`);
    } else {
      toast({
        title: 'Error',
        description: 'Could not determine facility ID',
        variant: 'destructive',
      });
    }
  };

  const handlePrintReport = () => {
    if (!audit) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Audit Report - ${audit.facility_name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h1 { color: #334155; }
            .header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #64748b; }
            .score { font-size: 24px; font-weight: bold; }
            .score-high { color: #10b981; }
            .score-medium { color: #f59e0b; }
            .score-low { color: #ef4444; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .criteria-item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #ddd; padding-top: 10px; }
            @media print {
              body { margin: 0; padding: 15px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Facility Audit Report</h1>
            <p>Generated on: ${format(new Date(), 'PPP p')}</p>
          </div>
          
          <div class="section grid">
            <div>
              <p class="label">Facility:</p>
              <p>${audit.facility_name}</p>
            </div>
            <div>
              <p class="label">Audit Date:</p>
              <p>${format(new Date(audit.audit_date), 'PPP')}</p>
            </div>
            <div>
              <p class="label">Auditor:</p>
              <p>${audit.auditor_name || 'Unknown'}</p>
            </div>
            <div>
              <p class="label">Status:</p>
              <p>${audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}</p>
            </div>
          </div>
          
          <div class="section">
            <p class="label">Overall Score:</p>
            <p class="score ${
              audit.overall_score >= 80 ? 'score-high' : 
              audit.overall_score >= 60 ? 'score-medium' : 
              'score-low'
            }">${audit.overall_score}%</p>
          </div>
          
          ${audit.notes ? `
            <div class="section">
              <p class="label">Notes:</p>
              <p>${audit.notes}</p>
            </div>
          ` : ''}
          
          <div class="section">
            <h2>Criteria Scores</h2>
            ${audit.criteria_scores && audit.criteria_scores.length > 0 ? 
              audit.criteria_scores.map(criterion => `
                <div class="criteria-item">
                  <div>
                    <span class="label">${criterion.criteria_name}:</span>
                    <span class="score ${
                      criterion.score >= 80 ? 'score-high' : 
                      criterion.score >= 60 ? 'score-medium' : 
                      'score-low'
                    }">${criterion.score}%</span>
                  </div>
                  ${criterion.notes ? `<p>${criterion.notes}</p>` : ''}
                </div>
              `).join('') 
              : '<p>No detailed criteria scores available.</p>'
            }
          </div>
          
          <div class="footer">
            <p>This report is confidential and intended only for authorized personnel.</p>
            <p>HealthIQ Audit System</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();

    toast({
      title: "Report generated",
      description: "The audit report has been prepared for printing.",
    });
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800";
    if (score >= 60) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
        <span className="ml-2">Loading audit details...</span>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <p className="text-red-600">{error || 'Audit not found'}</p>
        <Button 
          onClick={() => navigate('/audits')}
          variant="outline" 
          className="mt-2"
        >
          Back to Audits
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/audits')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Audit Review</h1>
          <p className="text-muted-foreground">
            Review audit details for {audit.facility_name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Facility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audit.facility_name}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Audit Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(audit.audit_date), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <Badge 
                variant="outline" 
                className={getScoreBadgeClass(audit.overall_score)}
              >
                {audit.overall_score}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auditor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">Auditor:</span>
                <div className="font-medium">{audit.auditor_name || 'Not specified'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div>
                  <Badge className="bg-emerald-500">
                    {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {audit.notes && (
              <div className="mt-4">
                <span className="text-muted-foreground">Notes:</span>
                <div className="mt-1 p-2 bg-muted rounded-md">{audit.notes}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criteria Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {audit.criteria_scores && audit.criteria_scores.length > 0 ? (
            <div className="space-y-4">
              {audit.criteria_scores.map((criterion) => (
                <div key={criterion.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{criterion.criteria_name}</h3>
                    <Badge 
                      variant="outline"
                      className={getScoreBadgeClass(criterion.score)}
                    >
                      {criterion.score}%
                    </Badge>
                  </div>
                  {criterion.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{criterion.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No detailed criteria scores available.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handlePrintReport}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/audits')}
        >
          Back to Audits
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/facilities/${audit.facility}`)}
        >
          View Facility
        </Button>
        <Button 
          onClick={handleConductNewAudit}
        >
          Take Audit
        </Button>
      </div>
    </div>
  );
};

export default AuditReview;
