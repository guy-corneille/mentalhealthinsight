
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LineChart, PieChart, FileText, Building } from 'lucide-react';

interface AuditStatsSummaryProps {
  summary: {
    totalCount: number;
    averageScore: number;
    completionRate: number;
    mostCommonType: string;
    mostActiveLocation: string;
  };
}

const AuditStatsSummaryCards: React.FC<AuditStatsSummaryProps> = ({ summary }) => {
  const scoreChange = Math.round(Math.random() * 10 - 5); // Random change between -5 and +5
  const completionChange = Math.round(Math.random() * 12 - 6); // Random change between -6 and +6
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{summary.averageScore}%</div>
            <div className={`text-xs flex items-center ${scoreChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {scoreChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(scoreChange)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground">from previous period</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{summary.completionRate}%</div>
            <div className={`text-xs flex items-center ${completionChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {completionChange >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(completionChange)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground">of scheduled audits completed</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Active Facility</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate" title={summary.mostActiveLocation}>
            {summary.mostActiveLocation.length > 15 ? 
              `${summary.mostActiveLocation.substring(0, 15)}...` : 
              summary.mostActiveLocation}
          </div>
          <p className="text-xs text-muted-foreground">most audits conducted</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditStatsSummaryCards;
