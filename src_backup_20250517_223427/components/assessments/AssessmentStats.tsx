import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from '@/components/ui/spinner';
import { useAssessmentStats } from '@/features/assessments/hooks/useAssessmentStats';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';

// Import smaller component pieces
import StatsSummaryCards from './stats/StatsSummaryCards';
import StatsFilters from './stats/StatsFilters';
import PeriodChart from './stats/PeriodChart';
import FacilityChart from './stats/FacilityChart';
import TypeChart from './stats/TypeChart';
import CriteriaChart from './stats/CriteriaChart';

const AssessmentStats: React.FC = () => {
  const { 
    timeRange, 
    setTimeRange, 
    patientGroup,
    setPatientGroup,
    isLoading,
    chartData 
  } = useAssessmentStats();
  
  const exportData = (chartType: string) => {
    if (!chartData) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    let data: any[] = [];
    
    if (chartType === 'period') {
      csvContent += "Month,Assessment Count\n";
      data = chartData.countByPeriodData;
      data.forEach(item => {
        csvContent += `${item.month},${item['Assessment Count']}\n`;
      });
    } else if (chartType === 'facility') {
      csvContent += "Facility,Assessment Count\n";
      data = chartData.facilityData;
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'type') {
      csvContent += "Assessment Type,Count\n";
      data = chartData.typeData;
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (chartType === 'criteria') {
      csvContent += "Criteria,Average Score\n";
      data = chartData.scoreByCriteriaData || [];
      data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `assessment-${chartType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <p className="ml-2 text-muted-foreground">Loading assessment statistics...</p>
      </div>
    );
  }
  
  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">No data available for the selected filters.</p>
        <Button variant="outline" className="mt-4" onClick={() => setTimeRange('12months')}>
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <StatsFilters 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        patientGroup={patientGroup}
        setPatientGroup={setPatientGroup}
      />
      
      {/* Summary Cards */}
      <StatsSummaryCards summary={chartData.summary} timeRange={timeRange} />
      
      {/* Charts */}
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["period"]} className="space-y-4">
          <AccordionItem value="period" className="border rounded-lg overflow-hidden">
            <PeriodChart 
              data={chartData.countByPeriodData} 
              onExport={() => exportData('period')} 
            />
          </AccordionItem>
          
          <AccordionItem value="facility" className="border rounded-lg overflow-hidden">
            <FacilityChart
              data={chartData.facilityData}
              onExport={() => exportData('facility')}
            />
          </AccordionItem>

          <AccordionItem value="type" className="border rounded-lg overflow-hidden">
            <TypeChart
              data={chartData.typeData}
              onExport={() => exportData('type')}
            />
          </AccordionItem>

          <AccordionItem value="criteria" className="border rounded-lg overflow-hidden">
            <CriteriaChart
              data={chartData.scoreByCriteriaData || []}
              onExport={() => exportData('criteria')}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AssessmentStats;
