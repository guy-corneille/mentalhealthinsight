
import React, { useState, useEffect } from 'react';
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
import { Spinner } from "@/components/ui/spinner";
import api from '@/services/api';

const FacilityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFacility = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/api/facilities/${id}/`);
        setFacility(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching facility details:', err);
        setError('Failed to load facility details');
        toast({
          title: 'Error',
          description: 'Failed to load facility details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacility();
    }
  }, [id, toast]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await api.delete(`/api/facilities/${id}/`);
        toast({
          title: "Facility Deleted",
          description: `${facility?.name} has been removed successfully.`,
        });
        navigate('/facilities');
      } catch (err) {
        console.error('Error deleting facility:', err);
        toast({
          title: 'Error',
          description: 'Failed to delete facility',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" />
          <span className="ml-2">Loading facility details...</span>
        </div>
      </Layout>
    );
  }

  if (error || !facility) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-600">{error || 'Facility not found'}</p>
          <Button 
            onClick={() => navigate('/facilities')}
            variant="outline" 
            className="mt-2"
          >
            Back to Facilities
          </Button>
        </div>
      </Layout>
    );
  }

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
            {facility.score && (
              <Badge className={
                facility.score >= 80 ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 
                facility.score >= 60 ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 
                'bg-rose-50 text-rose-600 hover:bg-rose-100'
              }>
                {facility.score}%
              </Badge>
            )}
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
          <span>{facility.address || 'No address provided'}</span>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <BuildingIcon className="h-4 w-4 mr-1" />
          <span>{facility.facility_type || 'Unknown type'}</span>
          {facility.last_inspection_date && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Last inspection: {new Date(facility.last_inspection_date).toLocaleDateString()}</span>
            </>
          )}
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
                  <div className="text-2xl font-bold">{facility.capacity || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">Patient beds</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{facility.status || 'Unknown'}</div>
                  <p className="text-xs text-muted-foreground">Current status</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Audit Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{facility.score ? `${facility.score}%` : 'Not audited'}</div>
                  <p className="text-xs text-muted-foreground">Based on last evaluation</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{facility.description || 'No description available for this facility.'}</p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm">Email: {facility.contact_email || 'Not provided'}</p>
                      <p className="text-sm">Phone: {facility.contact_phone || 'Not provided'}</p>
                      <p className="text-sm">Website: {facility.website || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Leadership</h4>
                    <p className="text-sm">Contact: {facility.contact_name || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Location</h4>
                    <p className="text-sm">
                      {facility.address && <span>{facility.address}<br /></span>}
                      {facility.city && <span>{facility.city}, </span>}
                      {facility.province && <span>{facility.province}<br /></span>}
                      {facility.country}
                    </p>
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
                <FacilityStaffList facilityId={Number(id)} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Service information is not available via API.</p>
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
