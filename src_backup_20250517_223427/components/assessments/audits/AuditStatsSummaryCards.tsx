
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clipboard, Building2 } from 'lucide-react';

interface AuditStatsSummaryProps {
  summary: {
    totalCount: number;
    averageScore?: number;
  };
}

const AuditStatsSummaryCards: React.FC<AuditStatsSummaryProps> = ({ summary }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalCount}</div>
          <p className="text-xs text-muted-foreground">Audits conducted</p>
        </CardContent>
      </Card>
      
      {summary.averageScore !== undefined && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.averageScore}</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditStatsSummaryCards;
