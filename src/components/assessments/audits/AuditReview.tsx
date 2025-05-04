import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReportActions } from '../utils/reportUtils';
import { useToast } from "@/hooks/use-toast";
import AuditStatsDetails from './AuditStatsDetails';
import api from '@/services/api';

interface AuditReview {
  id: number;
  facility: number;
  facility_name: string;
  date: string;
  evaluator: string;
  evaluator_name: string;
  status: string;
  notes: string;
  score: number;
  details: any[]; // Replace with proper typing when available
}

const AuditReviewComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [audit, setAudit] = useState<AuditReview | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handlePrintAuditReport } = useReportActions();

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        if (!id) {
          toast({
            title: "Error",
            description: "No audit ID provided",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // This is a placeholder. In a real implementation, you would fetch 
        // the audit from your API
        const response = await new Promise<AuditReview>((resolve) => {
          setTimeout(() => {
            resolve({
              id: parseInt(id),
              facility: 1,
              facility_name: "Sample Facility",
              date: new Date().toISOString(),
              evaluator: "user1",
              evaluator_name: "John Doe",
              status: "completed",
              notes: "Sample audit review notes",
              score: 85,
              details: []
            });
          }, 1000);
        });

        setAudit(response);
      } catch (error) {
        console.error("Error fetching audit:", error);
        toast({
          title: "Error",
          description: "Failed to load audit review",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [id, toast]);

  const handlePrintReport = () => {
    if (!audit) return;
    
    handlePrintAuditReport(audit);
    toast({
      title: "Print Report",
      description: "Preparing audit report for printing..."
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">Audit Not Found</h3>
        <p className="text-muted-foreground">The requested audit could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Audit Review</h2>
        <Button onClick={handlePrintReport} className="gap-2">
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Facility: {audit.facility_name}</span>
            <span className="text-primary">Score: {audit.score}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{new Date(audit.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Evaluator</p>
              <p>{audit.evaluator_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="capitalize">{audit.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p>{audit.id}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
            <p className="p-3 bg-muted rounded-md">{audit.notes || 'No notes provided.'}</p>
          </div>
          
          {/* This would display the detailed audit statistics */}
          <AuditStatsDetails auditId={audit.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReviewComponent;
