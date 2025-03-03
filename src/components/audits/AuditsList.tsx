
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, ArrowDownIcon, ArrowUpIcon, FilterIcon, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScoreTrendIndicator from "@/components/facilities/audits/ScoreTrendIndicator";

interface AuditRecord {
  id: number;
  facilityId: number;
  facilityName: string;
  region: string;
  date: string;
  auditor: string;
  score: number;
  previousScore: number | null;
}

const AuditsList: React.FC = () => {
  const [sortField, setSortField] = useState<keyof AuditRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // Mock data
  const audits: AuditRecord[] = [
    {
      id: 1,
      facilityId: 1,
      facilityName: 'Central Hospital',
      region: 'Kigali',
      date: '2023-04-15',
      auditor: 'Dr. Jean Mutabazi',
      score: 92,
      previousScore: 87
    },
    {
      id: 2,
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      region: 'Eastern',
      date: '2023-03-22',
      auditor: 'Dr. Alice Uwimana',
      score: 78,
      previousScore: 72
    },
    {
      id: 3,
      facilityId: 3,
      facilityName: 'Northern Health Center',
      region: 'Northern',
      date: '2023-03-10',
      auditor: 'Dr. Robert Mugisha',
      score: 85,
      previousScore: 81
    },
    {
      id: 4,
      facilityId: 4,
      facilityName: 'Southern Community Clinic',
      region: 'Southern',
      date: '2023-02-28',
      auditor: 'Dr. Sara Niragire',
      score: 71,
      previousScore: 75
    },
    {
      id: 5,
      facilityId: 5,
      facilityName: 'Western Regional Hospital',
      region: 'Western',
      date: '2023-02-15',
      auditor: 'Dr. Emmanuel Habimana',
      score: 83,
      previousScore: 79
    },
    {
      id: 6,
      facilityId: 1,
      facilityName: 'Central Hospital',
      region: 'Kigali',
      date: '2022-10-22',
      auditor: 'Dr. Alice Uwimana',
      score: 87,
      previousScore: 82
    },
    {
      id: 7,
      facilityId: 3,
      facilityName: 'Northern Health Center',
      region: 'Northern',
      date: '2022-10-05',
      auditor: 'Dr. Jean Mutabazi',
      score: 81,
      previousScore: 76
    }
  ];

  // Sort and filter audits
  const filteredAudits = audits
    .filter(audit => 
      (selectedRegion === 'all' || audit.region === selectedRegion) &&
      (audit.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       audit.auditor.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const toggleSort = (field: keyof AuditRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Audits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center relative w-full md:w-64">
            <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
            <Input 
              placeholder="Search audits..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={selectedRegion} 
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Kigali">Kigali</SelectItem>
                <SelectItem value="Eastern">Eastern</SelectItem>
                <SelectItem value="Western">Western</SelectItem>
                <SelectItem value="Northern">Northern</SelectItem>
                <SelectItem value="Southern">Southern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('facilityName')}
                >
                  <div className="flex items-center">
                    Facility
                    {sortField === 'facilityName' && (
                      sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('region')}
                >
                  <div className="flex items-center">
                    Region
                    {sortField === 'region' && (
                      sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('score')}
                >
                  <div className="flex items-center">
                    Score
                    {sortField === 'score' && (
                      sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.facilityName}</TableCell>
                  <TableCell>{audit.region}</TableCell>
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
                        View Details
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

export default AuditsList;
