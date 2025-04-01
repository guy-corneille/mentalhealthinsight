
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileEdit, Eye, Trash2, MoreHorizontal, Printer } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import ScoreTrendIndicator from '@/components/facilities/audits/ScoreTrendIndicator';
import { format } from 'date-fns';
import NewAuditDialog from './NewAuditDialog';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import PaginationControls from '@/components/common/PaginationControls';

interface AuditItem {
  id: number;
  facilityId: number;
  facilityName: string;
  date: string;
  score: number;
  previousScore: number | null;
  auditor: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  created_at?: string;
  updated_at?: string;
}

const AuditList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewingAudit, setViewingAudit] = useState<AuditItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  useEffect(() => {
    console.log("AuditList component mounted");
    console.log("Current search query:", searchQuery);
    console.log("Current facility filter:", facilityFilter);
  }, [searchQuery, facilityFilter]);
  
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
      status: 'completed',
      created_at: '2023-04-15T14:30:00Z',
      updated_at: '2023-04-15T16:45:00Z'
    },
    {
      id: 2,
      facilityId: 2,
      facilityName: 'Eastern District Clinic',
      date: '2023-03-22',
      score: 78,
      previousScore: 81,
      auditor: 'Dr. Marie Uwase',
      status: 'completed',
      created_at: '2023-03-22T10:15:00Z',
      updated_at: '2023-03-22T13:20:00Z'
    },
    {
      id: 3,
      facilityId: 3,
      facilityName: 'Northern Community Center',
      date: '2023-05-10',
      score: 65,
      previousScore: 60,
      auditor: 'Dr. Robert Mugabo',
      status: 'completed',
      created_at: '2023-05-10T09:00:00Z',
      updated_at: '2023-05-10T11:30:00Z'
    },
    {
      id: 4,
      facilityId: 4,
      facilityName: 'Southern District Hospital',
      date: '2023-06-05',
      score: 84,
      previousScore: 79,
      auditor: 'Dr. Claire Niyonzima',
      status: 'completed',
      created_at: '2023-06-05T13:45:00Z',
      updated_at: '2023-06-05T17:20:00Z'
    },
    {
      id: 5,
      facilityId: 1,
      facilityName: 'Central Hospital',
      date: '2023-07-20',
      score: 0,
      previousScore: 92,
      auditor: 'Dr. Jean Mutabazi',
      status: 'scheduled',
      created_at: '2023-07-01T08:30:00Z',
      updated_at: '2023-07-01T08:30:00Z'
    }
  ];

  useEffect(() => {
    console.log("Audits data:", audits);
  }, [audits]);
  
  // Filter audits based on search query and facility filter
  const filteredAudits = audits.filter(audit => {
    const matchesSearch = 
      audit.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.auditor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFacility = facilityFilter === 'all' || audit.facilityId.toString() === facilityFilter;
    
    return matchesSearch && matchesFacility;
  });

  useEffect(() => {
    console.log("Filtered audits:", filteredAudits);
  }, [filteredAudits]);

  // Get unique facilities for the dropdown
  const facilities = Array.from(new Set(audits.map(a => a.facilityId))).map(id => {
    const facility = audits.find(a => a.facilityId === id);
    return { id, name: facility?.facilityName || '' };
  });

  // Calculate pagination
  const totalItems = filteredAudits?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const currentItems = filteredAudits?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    console.log("Current page items:", currentItems);
  }, [currentItems]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p'); // Format like "Apr 29, 2023, 2:15 PM"
  };

  // Handle starting a new audit when a facility is selected
  const handleStartNewAudit = (facilityId: number) => {
    console.log("Starting new audit for facility:", facilityId);
    navigate(`/facilities/audit/${facilityId}`);
    setIsNewAuditDialogOpen(false);
  };

  const handleViewAudit = (audit: AuditItem) => {
    console.log("Viewing audit:", audit);
    setViewingAudit(audit);
    setIsViewDialogOpen(true);
  };

  const handleEditAudit = (audit: AuditItem) => {
    console.log("Editing audit:", audit);
    if (audit.status === 'scheduled' || audit.status === 'in-progress') {
      navigate(`/facilities/audit/${audit.id}`);
    } else {
      toast({
        title: "Edit Audit",
        description: `Viewing completed audit ${audit.id} details.`,
      });
    }
  };

  const handlePrintReport = (audit: AuditItem) => {
    console.log("Printing report for audit:", audit);
    toast({
      title: "Print Report",
      description: `Printing report for audit ${audit.id}.`,
    });
  };

  const handleDeleteAudit = (id: number) => {
    console.log("Attempting to delete audit:", id);
    if (confirm("Are you sure you want to delete this audit? This action cannot be undone.")) {
      console.log("Audit deletion confirmed for ID:", id);
      // In a real implementation, this would be a mutation that calls an API
      // For now, we'll just show a success message
      toast({
        title: "Audit deleted",
        description: "The audit has been successfully deleted.",
      });
    }
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
              {currentItems.length > 0 ? (
                currentItems.map((audit) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Audit Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => handleViewAudit(audit)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleEditAudit(audit)}>
                            <FileEdit className="h-4 w-4 mr-2" />
                            {audit.status === 'completed' ? 'View Audit' : 'Continue Audit'}
                          </DropdownMenuItem>
                          
                          {audit.status === 'completed' && (
                            <DropdownMenuItem onClick={() => handlePrintReport(audit)}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print Report
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            className="text-rose-600"
                            onClick={() => handleDeleteAudit(audit.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          
          {filteredAudits.length > 0 && (
            <div className="mt-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Details</DialogTitle>
            <DialogDescription>
              View detailed information about this facility audit.
            </DialogDescription>
          </DialogHeader>
          
          {viewingAudit && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Facility</h4>
                  <p>{viewingAudit.facilityName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{format(new Date(viewingAudit.date), 'PPP')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <Badge
                    className={
                      viewingAudit.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      viewingAudit.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    }
                  >
                    {viewingAudit.status === 'completed' ? 'Completed' :
                     viewingAudit.status === 'in-progress' ? 'In Progress' :
                     'Scheduled'}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Score</h4>
                  {viewingAudit.status === 'completed' ? (
                    <p className={
                      viewingAudit.score >= 80 ? 'text-emerald-600 font-medium' :
                      viewingAudit.score >= 60 ? 'text-amber-600 font-medium' :
                      'text-rose-600 font-medium'
                    }>
                      {viewingAudit.score}%
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Not available</p>
                  )}
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Auditor</h4>
                  <p>{viewingAudit.auditor || user?.displayName || user?.username || 'Current User'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Completed On</h4>
                  <p className="text-sm">{formatDate(viewingAudit.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Updated On</h4>
                  <p className="text-sm">{formatDate(viewingAudit.updated_at)}</p>
                </div>
                {viewingAudit.previousScore !== null && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Previous Score</h4>
                    <div className="flex items-center">
                      <p>{viewingAudit.previousScore}%</p>
                      <ScoreTrendIndicator current={viewingAudit.score} previous={viewingAudit.previousScore} />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {viewingAudit.status === 'completed' && (
                  <Button onClick={() => handlePrintReport(viewingAudit)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                )}
                {(viewingAudit.status === 'scheduled' || viewingAudit.status === 'in-progress') && (
                  <Button onClick={() => handleEditAudit(viewingAudit)}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Continue Audit
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <NewAuditDialog
        open={isNewAuditDialogOpen}
        onOpenChange={setIsNewAuditDialogOpen}
        onFacilitySelect={handleStartNewAudit}
      />
    </>
  );
};

export default AuditList;
