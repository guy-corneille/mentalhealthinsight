
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Button } from "@/components/ui/button";
import { PieChart as PieChartIcon } from "lucide-react";

type FacilityChartProps = {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  onExport: () => void;
};

const FacilityChart: React.FC<FacilityChartProps> = ({ data, onExport }) => {
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-900 border-b">
        <div className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-medium">Assessments by Facility</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExport}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
      
      <div className="p-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="animate-fade-in">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="white" 
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} assessments`, 'Count']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-muted-foreground mt-4">
          Distribution of assessments across different facilities.
        </div>
      </div>
    </>
  );
};

export default FacilityChart;
