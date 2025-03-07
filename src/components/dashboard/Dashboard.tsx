
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../ui/StatCard";
import { 
  Building2, 
  Users, 
  ClipboardCheck, 
  FileBarChart, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  User
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for dashboard statistics
  const stats = {
    totalFacilities: 24,
    activeFacilities: 21,
    facilityTypes: {
      hospitals: 8,
      clinics: 12,
      communityCenter: 4
    },
    staff: {
      total: 147,
      active: 142,
      onLeave: 5
    },
    patients: {
      total: 1248,
      new: 34,
      active: 963
    },
    assessments: {
      completed: 847,
      pending: 12,
      overdue: 3
    },
    audits: {
      completed: 156,
      scheduled: 4,
      compliance: 92
    }
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || user?.username}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <Badge variant="outline" className="text-sm text-healthiq-600 bg-healthiq-50 border-healthiq-200">
            Last updated: {new Date().toLocaleString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Facilities"
          value={stats.totalFacilities.toString()}
          description={`${stats.activeFacilities} active facilities`}
          icon={<Building2 className="h-5 w-5 text-healthiq-600" />}
          trend="+2 this month"
          onClick={() => navigate('/facilities')}
        />
        <StatCard 
          title="Staff Members"
          value={stats.staff.total.toString()}
          description={`${stats.staff.active} active, ${stats.staff.onLeave} on leave`}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          trend="+5 this month"
          onClick={() => navigate('/staff')}
        />
        <StatCard 
          title="Patient Records"
          value={stats.patients.total.toString()}
          description={`${stats.patients.new} new this month`}
          icon={<User className="h-5 w-5 text-emerald-600" />}
          trend="+34 this month"
          onClick={() => navigate('/patients')}
        />
        <StatCard 
          title="Assessments"
          value={stats.assessments.completed.toString()}
          description={`${stats.assessments.pending} pending, ${stats.assessments.overdue} overdue`}
          icon={<ClipboardCheck className="h-5 w-5 text-amber-600" />}
          trend="+47 this month"
          onClick={() => navigate('/assessments')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Facility Compliance Overview</CardTitle>
            <CardDescription>
              Overall compliance score across all facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col justify-center items-center">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold">{stats.audits.compliance}%</div>
                </div>
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="3"
                    strokeDasharray={`${stats.audits.compliance}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground text-sm">Completed Audits</p>
                  <p className="font-semibold">{stats.audits.completed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Scheduled</p>
                  <p className="font-semibold">{stats.audits.scheduled}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Facilities</p>
                  <p className="font-semibold">{stats.totalFacilities}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
            <CardDescription>
              Scheduled audits and assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="bg-indigo-50 p-2 rounded">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Facility Audit: Central Hospital</h4>
                  <p className="text-sm text-muted-foreground">Scheduled for May 15, 2025</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="bg-amber-50 p-2 rounded">
                  <ClipboardCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Quarterly Assessment: East Wing Clinic</h4>
                  <p className="text-sm text-muted-foreground">Due by May 20, 2025</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="bg-red-50 p-2 rounded">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Overdue Assessment: Community Center</h4>
                  <p className="text-sm text-muted-foreground">3 days overdue</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-50 p-2 rounded">
                  <FileBarChart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Monthly Report Generation</h4>
                  <p className="text-sm text-muted-foreground">Scheduled for May 30, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Facility Distribution</CardTitle>
            <CardDescription>
              Distribution by facility type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hospitals</span>
                  <span className="text-sm text-muted-foreground">{stats.facilityTypes.hospitals} facilities</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(stats.facilityTypes.hospitals / stats.totalFacilities) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clinics</span>
                  <span className="text-sm text-muted-foreground">{stats.facilityTypes.clinics} facilities</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(stats.facilityTypes.clinics / stats.totalFacilities) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Community Centers</span>
                  <span className="text-sm text-muted-foreground">{stats.facilityTypes.communityCenter} facilities</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${(stats.facilityTypes.communityCenter / stats.totalFacilities) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance Trends</CardTitle>
            <CardDescription>
              Key metrics over the last 3 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assessment Completion Rate</p>
                  <p className="text-xl font-bold">98.2%</p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+2.4%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Staff-to-Patient Ratio</p>
                  <p className="text-xl font-bold">1:8.4</p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+0.2</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Compliance Score</p>
                  <p className="text-xl font-bold">92%</p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+1.8%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Facility Utilization</p>
                  <p className="text-xl font-bold">76.5%</p>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+3.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
