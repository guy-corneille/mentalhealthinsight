
import React from 'react';
import Layout from '@/components/layout/Layout';
import BenchmarkOverview from '@/features/benchmarks/components/BenchmarkOverview';
import BenchmarkDetails from '@/features/benchmarks/components/BenchmarkDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Benchmarks: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Benchmarks</h1>
          <p className="text-muted-foreground mt-1">
            Compare your facility's performance against industry standards and set improvement targets
          </p>
        </div>

        <div className="space-y-6">
          <BenchmarkOverview />
          
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="standards">Industry Standards</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <BenchmarkDetails />
            </TabsContent>
            <TabsContent value="standards" className="pt-4">
              <div className="prose max-w-none">
                <h3>Industry Benchmarks & Standards</h3>
                <p>The following benchmarks represent industry standards established by mental healthcare accreditation bodies:</p>
                
                <div className="not-prose mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Metric</th>
                        <th className="text-left py-2">Target</th>
                        <th className="text-left py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Audit Completion Rate</td>
                        <td className="py-2">90%</td>
                        <td className="py-2">Percentage of scheduled audits completed on time</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Documentation Quality</td>
                        <td className="py-2">85%</td>
                        <td className="py-2">Completeness and accuracy of patient documentation</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Staff Performance</td>
                        <td className="py-2">85%</td>
                        <td className="py-2">Average performance rating across evaluation criteria</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Patient Satisfaction</td>
                        <td className="py-2">90%</td>
                        <td className="py-2">Percentage of positive patient feedback</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Incident Response Time</td>
                        <td className="py-2">15 min</td>
                        <td className="py-2">Average time to respond to critical incidents</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Treatment Plan Compliance</td>
                        <td className="py-2">95%</td>
                        <td className="py-2">Adherence to established treatment protocols</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h4>Standards Organizations</h4>
                <ul>
                  <li>Joint Commission on Accreditation of Healthcare Organizations (JCAHO)</li>
                  <li>Commission on Accreditation of Rehabilitation Facilities (CARF)</li>
                  <li>National Committee for Quality Assurance (NCQA)</li>
                  <li>Centers for Medicare and Medicaid Services (CMS)</li>
                </ul>
                
                <p>These benchmarks are reviewed annually and may be updated based on industry trends and best practices.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Benchmarks;
