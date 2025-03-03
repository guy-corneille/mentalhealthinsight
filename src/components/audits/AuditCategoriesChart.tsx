
import React from 'react';
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';

interface AuditCategoriesChartProps {
  chartData: { name: string; score: number }[];
}

const AuditCategoriesChart: React.FC<AuditCategoriesChartProps> = ({ chartData }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis 
            type="number"
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{payload[0].payload.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Score: {payload[0].value}%
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="score" 
            fill="#4f46e5" 
            radius={[0, 4, 4, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AuditCategoriesChart;
