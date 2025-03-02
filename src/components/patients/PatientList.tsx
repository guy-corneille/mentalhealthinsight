
import React from 'react';
import { 
  UserIcon, 
  SearchIcon,
  PlusIcon,
  FilterIcon,
  FileTextIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PatientList: React.FC = () => {
  const patients = [
    { 
      id: 'P-1001', 
      age: 28, 
      diagnosis: 'Major Depressive Disorder', 
      facility: 'Central Hospital',
      admissionDate: '2023-03-10',
      status: 'Active'
    },
    { 
      id: 'P-1002', 
      age: 35, 
      diagnosis: 'Generalized Anxiety Disorder', 
      facility: 'Eastern District Clinic',
      admissionDate: '2023-02-15',
      status: 'Active'
    },
    { 
      id: 'P-1003', 
      age: 42, 
      diagnosis: 'Bipolar Disorder', 
      facility: 'Northern Community Center',
      admissionDate: '2023-04-22',
      status: 'Active'
    },
    { 
      id: 'P-1004', 
      age: 19, 
      diagnosis: 'Panic Disorder', 
      facility: 'Western Mental Health Center',
      admissionDate: '2023-01-05',
      status: 'Discharged'
    },
    { 
      id: 'P-1005', 
      age: 56, 
      diagnosis: 'Post-Traumatic Stress Disorder', 
      facility: 'Central Hospital',
      admissionDate: '2023-05-12',
      status: 'Active'
    },
    { 
      id: 'P-1006', 
      age: 31, 
      diagnosis: 'Obsessive-Compulsive Disorder', 
      facility: 'Southern District Hospital',
      admissionDate: '2023-04-03',
      status: 'Active'
    },
    { 
      id: 'P-1007', 
      age: 24, 
      diagnosis: 'Schizophrenia', 
      facility: 'Eastern District Clinic',
      admissionDate: '2023-02-28',
      status: 'Transferred'
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center relative w-full sm:w-64">
          <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input 
            placeholder="Search patients..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="border-none bg-muted/50">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button className="bg-healthiq-600 hover:bg-healthiq-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-scale-in">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.diagnosis}</TableCell>
                  <TableCell>{patient.facility}</TableCell>
                  <TableCell>{new Date(patient.admissionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={
                      patient.status === 'Active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                      patient.status === 'Discharged' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 
                      'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    }>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          View Records
                        </DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Add Assessment</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
