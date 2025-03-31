
import React from 'react';
import StatCard from '@/components/ui/StatCard';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

type StatsSummaryCardsProps = {
  summary: {
    totalCount: number;
    averageScore: number;
    patientCoverage: number;
  };
  timeRange: string;
};

const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({ summary, timeRange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard 
        title="Total Assessments" 
        value={summary.totalCount.toLocaleString()} 
        icon={<BarChartIcon className="h-5 w-5 text-blue-600" />}
        description={`${timeRange === 'ytd' ? 'Year to date' : `Last ${timeRange}`}`}
      />
      
      <StatCard 
        title="Average Score" 
        value={`${summary.averageScore.toFixed(1)}`} 
        icon={<LineChartIcon className="h-5 w-5 text-purple-600" />}
        description="Overall assessment score"
      />
      
      <StatCard 
        title="Patient Coverage" 
        value={`${summary.patientCoverage}%`} 
        icon={<PieChartIcon className="h-5 w-5 text-orange-600" />}
        description="Patients assessed"
      />
    </div>
  );
};

export default StatsSummaryCards;
