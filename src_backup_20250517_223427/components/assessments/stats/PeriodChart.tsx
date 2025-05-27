
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Download, BarChart as BarChartIcon } from "lucide-react";
import { format } from 'date-fns';

type PeriodChartProps = {
  data: Array<{
    month: string;
    'Assessment Count': number;
  }>;
  onExport: () => void;
};

const PeriodChart: React.FC<PeriodChartProps> = ({ data, onExport }) => {
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-900 border-b">
        <div className="flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Assessments by Period</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
      
      <div className="p-4 pt-0">
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              className="animate-fade-in"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar 
                dataKey="Assessment Count" 
                fill="#3b82f6" 
                radius={[5, 5, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Total assessments completed in each time period.
        </div>
      </div>
    </>
  );
};

export default PeriodChart;
