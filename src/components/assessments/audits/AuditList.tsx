
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileEdit, Eye, Trash2, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ScoreTrendIndicator from '@/components/facilities/audits/ScoreTrendIndicator';
import { format } from 'date-fns';
import ScheduleAuditDialog from './ScheduleAuditDialog';
import NewAuditDialog from './NewAuditDialog';

interface AuditItem {
  id: number;
  facilityId: number;
  facilityName: string;
  date: string;
  score: number;
  previousScore: number | null;
  auditor: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

const AuditList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  
  // Mock data - would be fetched from API in a real app
  const audits: AuditItem[] = [
    {
      id: 1,
      facilityId: 1,
      facilityName: 'Central Hospital',
      date: '2023-04-15',
      score: 92,
      previousScore: 85,
      auditor: 'Dr. Jean Mutabazi',
      status: 'completed'
    },
    {
      id: 2,
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      date: '2023-03-22',
      score: 78,
      previousScore: 81,
      auditor: 'Dr. Marie Uwase',
      status: 'completed'
    },
    {
      id: 3,
      facilityId: 3,
      facilityName: 'Northern Community Center',
      date: '2023-05-10',
      score: 65,
      previousScore: 60,
      auditor: 'Dr. Robert Mugabo',
      status: 'completed'
    },
    {
      id: 4,
      facilityId: 4,
      facilityName: 'Southern District Hospital',
      date: '2023-06-05',
      score: 84,
      previousScore: 79,
      auditor: 'Dr. Claire Niyonzima',
      status: 'completed'
    },
    {
      id: 5,
      facilityId: 1,
      facilityName: 'Central Hospital',
      date: '2023-07-20',
      score: 0,
      previousScore: 92,
      auditor: 'Dr. Jean Mutabazi',
      status: 'scheduled'
    }
  ];
  
  // Filter audits based on search query and facility filter
  const filteredAudits = audits.filter(audit => {
    const matchesSearch = 
      audit.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.auditor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFacility = facilityFilter === 'all' || audit.facilityId.toString() === facilityFilter;
    
    return matchesSearch && matchesFacility;
  });

  // Get unique facilities for the dropdown
  const facilities = Array.from(new Set(audits.map(a => a.facilityId))).map(id => {
    const facility = audits.find(a => a.facilityId === id);
    return { id, name: facility?.facilityName || '' };
  });

  // Handle starting a new audit when a facility is selected
  const handleStartNewAudit = (facilityId: number) => {
    navigate(`/facilities/audit/${facilityId}`);
    setIsNewAuditDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Facility Audits</CardTitle>
              <CardDescription>
                View and manage audits for all mental health facilities
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsScheduleDialogOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Audit
              </Button>
              <Button onClick={() => setIsNewAuditDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Start New Audit
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="relative col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search audits..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map(facility => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facility</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.length > 0 ? (
                filteredAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell className="font-medium">{audit.facilityName}</TableCell>
                    <TableCell>{format(new Date(audit.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{audit.auditor}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          audit.status === 'completed' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                          audit.status === 'in-progress' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' :
                          'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }
                      >
                        {audit.status === 'completed' ? 'Completed' :
                         audit.status === 'in-progress' ? 'In Progress' :
                         'Scheduled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {audit.status === 'completed' ? (
                        <span className={
                          audit.score >= 80 ? 'text-emerald-600 font-medium' :
                          audit.score >= 60 ? 'text-amber-600 font-medium' :
                          'text-rose-600 font-medium'
                        }>
                          {audit.score}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {audit.status === 'completed' ? (
                        <ScoreTrendIndicator current={audit.score} previous={audit.previousScore} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {audit.status === 'completed' ? (
                          <Button variant="outline" size="icon" onClick={() => navigate(`/facilities/audit/${audit.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" onClick={() => navigate(`/facilities/audit/${audit.id}`)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="icon" className="text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No audits found. Try adjusting your search filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ScheduleAuditDialog 
        open={isScheduleDialogOpen} 
        onOpenChange={setIsScheduleDialogOpen}
        facilities={facilities}
      />

      <NewAuditDialog
        open={isNewAuditDialogOpen}
        onOpenChange={setIsNewAuditDialogOpen}
        facilities={facilities}
        onFacilitySelect={handleStartNewAudit}
      />
    </>
  );
};

export default AuditList;
