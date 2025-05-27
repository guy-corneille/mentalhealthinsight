
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { BarChart2 as BarChart2Icon } from "lucide-react";

type CriteriaChartProps = {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  onExport: () => void;
};

const CriteriaChart: React.FC<CriteriaChartProps> = ({ data, onExport }) => {
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-900 border-b">
        <div className="flex items-center gap-2">
          <BarChart2Icon className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-medium">Average Scores by Criteria</h3>
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
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">No criteria score data available</p>
          </div>
        ) : (
          <>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                  className="animate-fade-in"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fontSize: 12 }} 
                    label={{ 
                      value: 'Average Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' } 
                    }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Average Score']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar 
                    dataKey="value" 
                    name="Average Score" 
                    fill="#f59e0b" 
                    radius={[5, 5, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              Average assessment scores for each evaluation criteria.
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CriteriaChart;
