import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FacilityComparison } from './FacilityComparison';
import { FacilityRankings } from './FacilityRankings';

export function BenchmarkDashboard() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Facility Benchmarking</h1>
            
            <Tabs defaultValue="rankings" className="space-y-4">
        <TabsList>
                    <TabsTrigger value="rankings">Rankings</TabsTrigger>
                    <TabsTrigger value="compare">Compare Facilities</TabsTrigger>
        </TabsList>
        
                <TabsContent value="rankings">
                    <FacilityRankings />
        </TabsContent>
        
                <TabsContent value="compare">
                    <FacilityComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
}
