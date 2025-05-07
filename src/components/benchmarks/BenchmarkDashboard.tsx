
import React, { useState } from 'react';
import { useBenchmarking } from '@/features/benchmarks/hooks/useBenchmarking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BenchmarkOverview from './BenchmarkOverview';
import BenchmarkCategoryDetails from './BenchmarkCategoryDetails';
import BenchmarkImprovementPlan from './BenchmarkImprovementPlan';
import BenchmarkSkeleton from './BenchmarkSkeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BenchmarkDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  const { 
    categories, 
    benchmarkPerformance,
    isLoading, 
    error, 
    getImprovementAreas 
  } = useBenchmarking();
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('details');
  };
  
  if (isLoading) {
    return <BenchmarkSkeleton />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load benchmark data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedCategory}>Category Details</TabsTrigger>
          <TabsTrigger value="improvement">Improvement Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <BenchmarkOverview 
            categories={categories}
            performance={benchmarkPerformance}
            onCategorySelect={handleCategorySelect}
          />
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          {selectedCategory && (
            <BenchmarkCategoryDetails 
              categoryId={selectedCategory} 
              performance={benchmarkPerformance.find(p => p.categoryId === selectedCategory)}
              category={categories.find(c => c.id === selectedCategory)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="improvement" className="space-y-6">
          <BenchmarkImprovementPlan 
            improvementAreas={getImprovementAreas()}
            categories={categories} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenchmarkDashboard;
