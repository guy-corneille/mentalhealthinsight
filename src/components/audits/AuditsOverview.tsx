
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3Icon, ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuditsTrends from './AuditsTrends';
import AuditsRecent from './AuditsRecent';

const AuditsOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Audits Overview</h2>
          <p className="text-muted-foreground">View and analyze facility audit performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/audits/list">
              <ListIcon className="h-4 w-4 mr-2" />
              View All Audits
            </Link>
          </Button>
          <Button asChild>
            <Link to="/audits/trends">
              <BarChart3Icon className="h-4 w-4 mr-2" />
              View Trends
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Audits</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-6 mt-6">
          <AuditsRecent />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6 mt-6">
          <AuditsTrends />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditsOverview;
