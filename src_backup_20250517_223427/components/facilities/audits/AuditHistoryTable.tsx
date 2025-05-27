
import React from 'react';
import { 
  CalendarIcon, 
  UserIcon,
  ArrowUpDownIcon 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScoreTrendIndicator from './ScoreTrendIndicator';

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

interface AuditHistoryTableProps {
  audits: AuditRecord[];
  sortDirection: 'asc' | 'desc';
  toggleSortDirection: () => void;
}

const AuditHistoryTable: React.FC<AuditHistoryTableProps> = ({ 
  audits, 
  sortDirection, 
  toggleSortDirection 
}) => {
  return (
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
          {audits.map((audit) => (
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
                <ScoreTrendIndicator current={audit.score} previous={audit.previousScore} />
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
  );
};

export default AuditHistoryTable;
