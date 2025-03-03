
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingIcon, 
  CalendarIcon, 
  SearchIcon, 
  FilterIcon,
  FileTextIcon
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreTrendIndicator from '@/components/facilities/audits/ScoreTrendIndicator';

const AuditList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Mock data for audits
  const audits = [
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
      facilityId: 1,
      facilityName: 'Central Hospital',
      date: '2022-10-22',
      auditor: 'Dr. Alice Uwimana',
      score: 87,
      previousScore: 82
    },
    {
      id: 3,
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      date: '2023-03-22',
      auditor: 'Dr. Robert Mugisha',
      score: 78,
      previousScore: 73
    },
    {
      id: 4,
      facilityId: 3,
      facilityName: 'Northern Community Center',
      date: '2023-05-10',
      auditor: 'Dr. Marie Nyiraneza',
      score: 65,
      previousScore: 58
    }
  ];
  
  // Filter facilities based on search query and facility filter
  const filteredAudits = audits.filter(audit => {
    // Filter by search query
    if (searchQuery && !audit.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !audit.auditor.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by facility
    if (facilityFilter !== 'all' && audit.facilityId !== parseInt(facilityFilter)) {
      return false;
    }
    
    return true;
  });
  
  // Sort audits
  const sortedAudits = [...filteredAudits].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'facility') {
      comparison = a.facilityName.localeCompare(b.facilityName);
    } else if (sortBy === 'score') {
      comparison = a.score - b.score;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Mock facilities for filter dropdown
  const facilities = [
    { id: 1, name: 'Central Hospital' },
    { id: 2, name: 'Eastern District Clinic' },
    { id: 3, name: 'Northern Community Center' },
    { id: 4, name: 'Southern District Hospital' },
    { id: 5, name: 'Western Mental Health Center' }
  ];
  
  const handleViewAudit = (id: number, facilityId: number) => {
    navigate(`/facilities/${facilityId}/audit/${id}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Audits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by facility or auditor..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Facility" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {facilities.map(facility => (
                  <SelectItem key={facility.id} value={facility.id.toString()}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => {
                      setSortBy('date');
                      setSortOrder(sortBy === 'date' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
                    }}
                  >
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => {
                      setSortBy('facility');
                      setSortOrder(sortBy === 'facility' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc');
                    }}
                  >
                    Facility
                    {sortBy === 'facility' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => {
                      setSortBy('score');
                      setSortOrder(sortBy === 'score' ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
                    }}
                  >
                    Score
                    {sortBy === 'score' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </TableHead>
                <TableHead>Trend</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAudits.length > 0 ? (
                sortedAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {new Date(audit.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BuildingIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        {audit.facilityName}
                      </div>
                    </TableCell>
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
                        size="icon"
                        onClick={() => handleViewAudit(audit.id, audit.facilityId)}
                      >
                        <FileTextIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No audit records found. Adjust your filters or add new audits.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditList;
