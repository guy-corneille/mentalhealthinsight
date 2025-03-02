
import React from 'react';
import { 
  BuildingIcon, 
  UsersIcon, 
  ClipboardCheckIcon, 
  ActivityIcon,
  TrendingUpIcon,
  AlertTriangleIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from '../ui/StatCard';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to MentalHealthIQ. Monitor and improve mental health services.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Facilities" 
              value="24" 
              icon={BuildingIcon}
              trend={{ value: 12, positive: true }}
              className="animate-slide-up [animation-delay:0ms]"
            />
            <StatCard 
              title="Active Patients" 
              value="1,284" 
              icon={UsersIcon}
              trend={{ value: 8, positive: true }}
              className="animate-slide-up [animation-delay:100ms]"
            />
            <StatCard 
              title="Assessments" 
              value="3,429" 
              icon={ClipboardCheckIcon}
              trend={{ value: 24, positive: true }}
              className="animate-slide-up [animation-delay:200ms]"
            />
            <StatCard 
              title="Avg. Compliance" 
              value="84%" 
              icon={ActivityIcon}
              trend={{ value: 5, positive: false }}
              className="animate-slide-up [animation-delay:300ms]"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-scale-in [animation-delay:400ms]">
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Key metrics for mental health facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full flex items-center justify-center bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Performance chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="animate-scale-in [animation-delay:500ms]">
                <CardHeader>
                  <CardTitle>Recent Evaluations</CardTitle>
                  <CardDescription>Latest facility evaluations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { facility: 'Central Hospital', score: 92, date: '2 days ago', status: 'Completed' },
                      { facility: 'Eastern District Clinic', score: 78, date: '5 days ago', status: 'Completed' },
                      { facility: 'Northern Community Center', score: 65, date: '1 week ago', status: 'Pending Review' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-healthiq-100 flex items-center justify-center">
                            <BuildingIcon className="h-5 w-5 text-healthiq-600" />
                          </div>
                          <div>
                            <p className="font-medium">{item.facility}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            item.score >= 80 ? 'bg-emerald-50 text-emerald-600' : 
                            item.score >= 60 ? 'bg-amber-50 text-amber-600' : 
                            'bg-rose-50 text-rose-600'
                          }`}>
                            <span className="font-semibold">{item.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-scale-in [animation-delay:600ms]">
                <CardHeader>
                  <CardTitle>Critical Alerts</CardTitle>
                  <CardDescription>Issues requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: 'Low staffing levels', facility: 'Western Mental Health Center', urgency: 'High' },
                      { title: 'Medication shortage', facility: 'Southern District Hospital', urgency: 'Medium' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className={`p-2 rounded-full ${
                          item.urgency === 'High' ? 'bg-rose-50' : 'bg-amber-50'
                        }`}>
                          <AlertTriangleIcon className={`h-4 w-4 ${
                            item.urgency === 'High' ? 'text-rose-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.facility}</p>
                        </div>
                        <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                          item.urgency === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.urgency}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="h-[400px] flex items-center justify-center bg-muted/30 rounded-md">
          <div className="text-center">
            <TrendingUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Detailed analytics will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="h-[400px] flex items-center justify-center bg-muted/30 rounded-md">
          <div className="text-center">
            <ClipboardCheckIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Reports Dashboard</h3>
            <p className="text-muted-foreground">Generated reports will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
