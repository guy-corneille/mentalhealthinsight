
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { 
  BuildingIcon, 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClipboardCheckIcon,
  BarChart3Icon,
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  ClipboardIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FacilityStaffList from "@/components/facilities/FacilityStaffList";

const FacilityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const facility = {
    id: parseInt(id || '1'),
    name: 'Central Hospital',
    location: 'Kigali, Rwanda',
    type: 'Hospital',
    capacity: 250,
    lastAudit: '2023-04-15',
    score: 92,
    description: 'A leading mental health facility providing comprehensive services to the community.',
    contact: {
      email: 'info@centralhospital.rw',
      phone: '+250 782 123 456',
      website: 'www.centralhospital.rw'
    },
    leadDoctor: 'Dr. Jean Mutabazi',
    staffCount: 120,
    certifications: ['ISO 9001', 'Mental Health Excellence', 'Quality Care'],
    services: ['Inpatient Care', 'Outpatient Services', 'Emergency Services', 'Counseling', 'Group Therapy']
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      toast({
        title: "Facility Deleted",
        description: `${facility.name} has been removed successfully.`,
      });
      navigate('/facilities');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/facilities')}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{facility.name}</h1>
            <Badge className={
              facility.score >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
              facility.score >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
              'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }>
              {facility.score}%
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/facilities/edit/${id}`)}
            >
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{facility.location}</span>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <BuildingIcon className="h-4 w-4 mr-1" />
          <span>{facility.type}</span>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Last audit: {new Date(facility.lastAudit).toLocaleDateString()}</span>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{facility.capacity}</div>
                  <p className="text-xs text-muted-foreground">Patient beds</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{facility.staffCount}</div>
                  <p className="text-xs text-muted-foreground">Healthcare professionals</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Audit Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{facility.score}%</div>
                  <p className="text-xs text-muted-foreground">Based on last evaluation</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{facility.description}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm">Email: {facility.contact.email}</p>
                      <p className="text-sm">Phone: {facility.contact.phone}</p>
                      <p className="text-sm">Website: {facility.contact.website}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Leadership</h4>
                    <p className="text-sm">Lead Doctor: {facility.leadDoctor}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {facility.certifications.map((cert, i) => (
                        <Badge key={i} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <FacilityStaffList facilityId={facility.id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facility.services.map((service, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 border rounded-md">
                      <ClipboardCheckIcon className="h-5 w-5 text-healthiq-600" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ClipboardIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Audit Reports Available</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    View and manage audit reports for this facility in the Evaluation Framework section.
                  </p>
                  <Button onClick={() => navigate('/audits')}>
                    Go to Audits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FacilityDetails;
