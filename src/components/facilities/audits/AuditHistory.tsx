
import React, { useState } from 'react';
import { 
  CalendarIcon, 
  UserIcon, 
  ArrowUpDownIcon, 
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip
} from '@/components/ui/chart';
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';

interface AuditHistoryProps {
  facilityId: number;
}

interface AuditRecord {
  id: number;
  date: string;
  auditor: string;
  score: number;
  previousScore: number | null;
  categories: {
    name: string;
    score: number;
  }[];
}

const AuditHistory: React.FC<AuditHistoryProps> = ({ facilityId }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // This would normally be fetched from an API
  const auditHistory: AuditRecord[] = [
    {
      id: 1,
      date: '2023-04-15',
      auditor: 'Dr. Jean Mutabazi',
      score: 92,
      previousScore: 87,
      categories: [
        { name: 'Infrastructure', score: 95 },
        { name: 'Staffing', score: 90 },
        { name: 'Treatment', score: 94 },
        { name: 'Rights', score: 89 }
      ]
    },
    {
      id: 2,
      date: '2022-10-22',
      auditor: 'Dr. Alice Uwimana',
      score: 87,
      previousScore: 82,
      categories: [
        { name: 'Infrastructure', score: 90 },
        { name: 'Staffing', score: 85 },
        { name: 'Treatment', score: 89 },
        { name: 'Rights', score: 84 }
      ]
    },
    {
      id: 3,
      date: '2022-04-05',
      auditor: 'Dr. Robert Mugisha',
      score: 82,
      previousScore: 76,
      categories: [
        { name: 'Infrastructure', score: 80 },
        { name: 'Staffing', score: 78 },
        { name: 'Treatment', score: 85 },
        { name: 'Rights', score: 85 }
      ]
    },
    {
      id: 4,
      date: '2021-09-18',
      auditor: 'Dr. Sara Niragire',
      score: 76,
      previousScore: null,
      categories: [
        { name: 'Infrastructure', score: 75 },
        { name: 'Staffing', score: 72 },
        { name: 'Treatment', score: 80 },
        { name: 'Rights', score: 77 }
      ]
    }
  ];

  // Sort audits
  const sortedAudits = [...auditHistory].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Format chart data
  const chartData = sortedAudits.slice().reverse().map(audit => ({
    name: new Date(audit.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    score: audit.score
  }));

  const getScoreTrend = (current: number, previous: number | null): React.ReactNode => {
    if (previous === null) return <MinusIcon className="h-4 w-4 text-gray-400" />;
    
    const diff = current - previous;
    const percentChange = previous > 0 ? (diff / previous) * 100 : 0;
    
    if (diff > 0) {
      return (
        <div className="flex items-center text-emerald-600">
          <TrendingUpIcon className="h-4 w-4 mr-1" />
          +{diff} pts ({percentChange.toFixed(1)}%)
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-rose-600">
          <TrendingDownIcon className="h-4 w-4 mr-1" />
          {diff} pts ({percentChange.toFixed(1)}%)
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <MinusIcon className="h-4 w-4 mr-1" />
          No change
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {auditHistory.length > 0 ? (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Audit Score Trends</CardTitle>
              <CardDescription>Historical performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[180px] cursor-pointer"
                    onClick={toggleSortDirection}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Date {sortDirection === 'asc' ? '↑' : '↓'}
                    </div>
                  </TableHead>
                  <TableHead className="w-[180px]">Auditor</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead className="text-right">Categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">
                      {new Date(audit.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {audit.auditor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        audit.score >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                        audit.score >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                        'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      }>
                        {audit.score}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getScoreTrend(audit.score, audit.previousScore)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        {audit.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category.name.substring(0, 3)}: {category.score}%
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart3Icon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No audit history available</p>
            <p className="text-sm text-center text-muted-foreground mb-6">
              Start your first audit to track facility performance over time
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditHistory;
