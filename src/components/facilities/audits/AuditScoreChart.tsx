
import React from 'react';
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';

interface AuditScoreChartProps {
  chartData: { name: string; score: number }[];
}

const AuditScoreChart: React.FC<AuditScoreChartProps> = ({ chartData }) => {
  const chartConfig = {
    score: {
      label: "Audit Score",
      color: "#4f46e5"
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Audit Score Trends</CardTitle>
        <CardDescription>Historical performance over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
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
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AuditScoreChart;
