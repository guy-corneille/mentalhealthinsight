
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheckIcon, CalendarIcon, BuildingIcon, BarChart3Icon } from 'lucide-react';

interface PatientDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string | null;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ open, onOpenChange, patientId }) => {
  // Mock patient data - In a real app, fetch this based on patientId
  const patient = {
    id: patientId || 'P-1001',
    name: 'Anonymous Patient',
    age: 28,
    gender: 'Male',
    diagnosis: 'Major Depressive Disorder',
    facility: 'Central Hospital',
    admissionDate: '2023-03-10',
    status: 'Active',
    treatingDoctor: 'Dr. Jean Mutabazi',
    assessments: [
      { date: '2023-03-10', score: 72, type: 'Initial Evaluation' },
      { date: '2023-04-15', score: 78, type: 'Follow-up' },
      { date: '2023-05-20', score: 85, type: 'Progress Check' },
    ],
    medications: [
      { name: 'Sertraline', dosage: '50mg', frequency: 'Once daily' },
      { name: 'Lorazepam', dosage: '1mg', frequency: 'As needed' },
    ],
    therapySessions: [
      { date: '2023-03-15', type: 'CBT', notes: 'Initial session, established rapport' },
      { date: '2023-03-22', type: 'CBT', notes: 'Discussed coping strategies' },
      { date: '2023-04-05', type: 'Group Therapy', notes: 'Participated in group discussion' },
      { date: '2023-04-19', type: 'CBT', notes: 'Reviewed progress on coping strategies' },
    ]
  };

  if (!patientId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl">{patient.name}</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            ID: {patient.id} · {patient.age} years · {patient.gender}
            <Badge className={
              patient.status === 'Active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
              'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }>
              {patient.status}
            </Badge>
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Diagnosis</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p>{patient.diagnosis}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Treating Doctor</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p>{patient.treatingDoctor}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4" />
                  Facility Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>Current Facility: {patient.facility}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  Admission Date: {new Date(patient.admissionDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="h-4 w-4" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Treatment Progress</span>
                      <span className="text-sm font-medium">{patient.assessments[patient.assessments.length - 1].score}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-healthiq-600 h-2.5 rounded-full" 
                        style={{ width: `${patient.assessments[patient.assessments.length - 1].score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-2">
                    Latest assessment on {new Date(patient.assessments[patient.assessments.length - 1].date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheckIcon className="h-4 w-4" />
                  Assessment History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3 divide-y">
                  {patient.assessments.map((assessment, idx) => (
                    <div key={idx} className={`${idx > 0 ? 'pt-3' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{assessment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assessment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            assessment.score >= 80 ? 'bg-emerald-50 text-emerald-600' :
                            assessment.score >= 60 ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }
                        >
                          {assessment.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                  Add New Assessment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="treatments" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Current Medications</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {patient.medications.map((med, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                      </div>
                      <Badge variant="outline">{med.frequency}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Therapy Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3 divide-y">
                  {patient.therapySessions.map((session, idx) => (
                    <div key={idx} className={`${idx > 0 ? 'pt-3' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{session.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mt-1">{session.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline">Edit Patient</Button>
          <Button>Add New Record</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PatientDetails;
