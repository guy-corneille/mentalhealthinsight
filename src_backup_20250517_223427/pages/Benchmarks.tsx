
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import BenchmarkDashboard from '@/components/benchmarks/BenchmarkDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useBenchmarking } from '@/features/benchmarks/hooks/useBenchmarking';
import { useToast } from '@/hooks/use-toast';

const Benchmarks: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const { benchmarkingData } = useBenchmarking();

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your benchmark data export is being prepared",
    });
    
    // In a real implementation, this would call an API to generate and download the report
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Benchmark data has been exported successfully",
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Benchmarks</h1>
            <p className="text-muted-foreground mt-1">
              Track facility performance against industry benchmarks and standards
            </p>
          </div>
          
          <Button variant="outline" className="gap-2" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Benchmark Dashboard</TabsTrigger>
            <TabsTrigger value="info">About Benchmarking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <BenchmarkDashboard />
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-6">
              <Alert>
                <AlertTitle>About Benchmarking</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    The benchmarking system uses real data from your facility's audits and assessments to
                    measure performance against industry standards and organizational targets.
                  </p>
                  <p>
                    We currently provide three types of benchmarking:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      <strong>Operational Efficiency</strong> - Measures how efficiently your facility operates,
                      including assessment completion rates and documentation compliance
                    </li>
                    <li>
                      <strong>Quality & Compliance</strong> - Compares your audit scores against industry standards
                      and helps identify areas that need improvement
                    </li>
                    <li>
                      <strong>Performance Trends</strong> - Tracks key metrics over time to identify improvement
                      trends and potential issues
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Data Sources</h3>
                <p className="mb-4">
                  Benchmark data is collected from the following sources:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Audit System</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides compliance scores, audit completion rates, and quality metrics
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Assessment Records</h4>
                    <p className="text-sm text-muted-foreground">
                      Tracks assessment completion rates and documentation quality
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Historical Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Uses past performance data to identify trends and improvement opportunities
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Benchmark Standards</h3>
                <p className="mb-4">
                  Our benchmarks are derived from multiple sources to ensure comprehensive coverage:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left py-2 px-4">Source</th>
                        <th className="text-left py-2 px-4">Description</th>
                        <th className="text-left py-2 px-4">Application</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2 px-4 font-medium">National</td>
                        <td className="py-2 px-4">National association standards and averages</td>
                        <td className="py-2 px-4">Documentation compliance, patient satisfaction</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium">Regional</td>
                        <td className="py-2 px-4">Regional healthcare network averages</td>
                        <td className="py-2 px-4">Wait times, treatment outcomes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium">Organizational</td>
                        <td className="py-2 px-4">Organization-defined targets</td>
                        <td className="py-2 px-4">Assessment completion rates, audit frequency</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium">Historical</td>
                        <td className="py-2 px-4">Your facility's past performance</td>
                        <td className="py-2 px-4">Performance trends, improvement tracking</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Benchmarks;
