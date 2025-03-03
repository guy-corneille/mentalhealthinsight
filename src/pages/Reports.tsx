
import React from 'react';
import Layout from '@/components/layout/Layout';

const Reports: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Access and generate detailed reports about facilities, staff, and patient outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Facility Performance</h3>
            <p className="text-muted-foreground mb-4">Comparative analysis of facility performance against benchmarks.</p>
            <button className="text-sm font-medium text-primary hover:underline">Generate Report</button>
          </div>
          
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Staff Efficiency</h3>
            <p className="text-muted-foreground mb-4">Detailed analysis of staff performance and resource allocation.</p>
            <button className="text-sm font-medium text-primary hover:underline">Generate Report</button>
          </div>
          
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Patient Outcomes</h3>
            <p className="text-muted-foreground mb-4">Analysis of patient treatment outcomes and satisfaction rates.</p>
            <button className="text-sm font-medium text-primary hover:underline">Generate Report</button>
          </div>
          
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Compliance Audit</h3>
            <p className="text-muted-foreground mb-4">Reports on facility compliance with healthcare regulations.</p>
            <button className="text-sm font-medium text-primary hover:underline">Generate Report</button>
          </div>
          
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Resource Utilization</h3>
            <p className="text-muted-foreground mb-4">Analysis of resource utilization and optimization opportunities.</p>
            <button className="text-sm font-medium text-primary hover:underline">Generate Report</button>
          </div>
          
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h3 className="text-lg font-medium mb-2">Quality Metrics</h3>
            <p className="text-muted-foreground mb-4">Key quality indicators across all healthcare facilities.</p>
            <button className="text-sm font-medium text-primary hover:underline">Generate Report</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
