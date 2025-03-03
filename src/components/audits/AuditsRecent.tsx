
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScoreTrendIndicator from "@/components/facilities/audits/ScoreTrendIndicator";

interface AuditRecord {
  id: number;
  facilityId: number;
  facilityName: string;
  date: string;
  auditor: string;
  score: number;
  previousScore: number | null;
}

const AuditsRecent: React.FC = () => {
  // Mock data
  const recentAudits: AuditRecord[] = [
    {
      id: 1,
      facilityId: 1,
      facilityName: 'Central Hospital',
      date: '2023-04-15',
      auditor: 'Dr. Jean Mutabazi',
      score: 92,
      previousScore: 87
    },
    {
      id: 2,
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      date: '2023-03-22',
      auditor: 'Dr. Alice Uwimana',
      score: 78,
      previousScore: 72
    },
    {
      id: 3,
      facilityId: 3,
      facilityName: 'Northern Health Center',
      date: '2023-03-10',
      auditor: 'Dr. Robert Mugisha',
      score: 85,
      previousScore: 81
    },
    {
      id: 4,
      facilityId: 4,
      facilityName: 'Southern Community Clinic',
      date: '2023-02-28',
      auditor: 'Dr. Sara Niragire',
      score: 71,
      previousScore: 75
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Facility Audits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facility</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAudits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.facilityName}</TableCell>
                  <TableCell>{new Date(audit.date).toLocaleDateString()}</TableCell>
                  <TableCell>{audit.auditor}</TableCell>
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
                    <ScoreTrendIndicator 
                      current={audit.score} 
                      previous={audit.previousScore} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/facilities/${audit.facilityId}`}>
                        <ExternalLinkIcon className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditsRecent;
