
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  UserIcon,
  EditIcon,
  Trash2Icon,
  XIcon,
  CheckIcon
} from 'lucide-react';
import { usePatients, useDeletePatient, Patient } from '@/services/patientService';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  
  // Fetch patients using React Query
  const { data: patients, isLoading, error } = usePatients();
  
  // Delete patient mutation
  const deletePatientMutation = useDeletePatient();
  
  // Filter patients when data changes
  useEffect(() => {
    if (!patients) return;
    
    let results = [...patients];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(patient => 
        patient.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(patient => 
        patient.patient_id.toLowerCase().includes(query) ||
        patient.diagnosis.toLowerCase().includes(query)
      );
    }
    
    setFilteredPatients(results);
  }, [patients, searchQuery, statusFilter]);
  
  // Handler for deleting a patient
  const handleDelete = (id: number, patientId: string) => {
    if (window.confirm(`Are you sure you want to delete patient ${patientId}?`)) {
      deletePatientMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Patient Deleted",
            description: `Patient ${patientId} has been removed.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete patient. Please try again.`,
            variant: "destructive",
          });
          console.error("Delete error:", error);
        }
      });
    }
  };
  
  // Handle status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'discharged':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'transferred':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading patients...</p>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-500 mb-2">Error loading patients</p>
        <p className="text-muted-foreground">{(error as Error).message || 'Unknown error occurred'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
              <SelectItem value="transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={() => navigate('/patients/add')}
          className="bg-healthiq-600 hover:bg-healthiq-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>
      
      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new patient.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.patient_id}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.diagnosis}</TableCell>
                  <TableCell>{patient.facility_name}</TableCell>
                  <TableCell>{new Date(patient.admission_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeStyle(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/patients/edit/${patient.id}`)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(patient.id, patient.patient_id)}
                      >
                        <Trash2Icon className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default PatientList;
