
// import React, { useState, useMemo } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { format, subMonths } from 'date-fns';
// import { FileDown } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast";
// import { downloadReportAsCSV } from '@/utils/reportUtils';

// const PatientOutcomesReport: React.FC = () => {
//   const { toast } = useToast();
//   const [timeRange, setTimeRange] = useState('12months');
//   const [condition, setCondition] = useState('all');
//   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
//   // Mock conditions data
//   const conditions = [
//     { id: 1, name: 'Depression' },
//     { id: 2, name: 'Anxiety' },
//     { id: 3, name: 'Bipolar Disorder' },
//     { id: 4, name: 'PTSD' }
//   ];
  
//   // Generate the last 12 months as labels
//   const getLast12Months = () => {
//     const months = [];
//     for (let i = 11; i >= 0; i--) {
//       const date = subMonths(new Date(), i);
//       months.push(format(date, 'MMM yyyy'));
//     }
//     return months;
//   };
  
//   // Memoized chart data to prevent unnecessary recalculations
//   const treatmentOutcomeData = useMemo(() => {
//     const monthLabels = getLast12Months();
//     return monthLabels.map((month, index) => {
//       return {
//         month,
//         'Significant Improvement': 35 + Math.floor(Math.random() * 10),
//         'Moderate Improvement': 40 + Math.floor(Math.random() * 10),
//         'Minimal/No Change': 15 + Math.floor(Math.random() * 8),
//         'Deterioration': 5 + Math.floor(Math.random() * 5),
//       };
//     });
//   }, [timeRange, condition]);
  
//   const readmissionData = useMemo(() => {
//     const monthLabels = getLast12Months();
//     return monthLabels.map((month, index) => {
//       return {
//         month,
//         'Readmission Rate': 12 - (index % 5) * 0.5,
//         'Target Rate': 10
//       };
//     });
//   }, [timeRange, condition]);
  
//   const satisfactionScores = useMemo(() => [
//     { name: 'Very Satisfied', value: 42, color: '#10b981' },
//     { name: 'Satisfied', value: 35, color: '#6366f1' },
//     { name: 'Neutral', value: 15, color: '#8b5cf6' },
//     { name: 'Dissatisfied', value: 6, color: '#f59e0b' },
//     { name: 'Very Dissatisfied', value: 2, color: '#ef4444' }
//   ], [condition]);
  
//   const handleExportReport = () => {
//     setIsGeneratingReport(true);
    
//     try {
//       // Create an array for treatment outcomes data
//       const outcomeDataForExport = treatmentOutcomeData.map(item => ({
//         Period: item.month,
//         'Significant Improvement': item['Significant Improvement'],
//         'Moderate Improvement': item['Moderate Improvement'],
//         'Minimal/No Change': item['Minimal/No Change'],
//         'Deterioration': item['Deterioration'],
//       }));
      
//       // Create an array for readmission data
//       const readmissionDataForExport = readmissionData.map(item => ({
//         Period: item.month,
//         'Readmission Rate': item['Readmission Rate'],
//         'Target Rate': item['Target Rate'],
//       }));
      
//       // Create an array for satisfaction scores
//       const satisfactionDataForExport = satisfactionScores.map(item => ({
//         'Satisfaction Level': item.name,
//         'Percentage': item.value,
//       }));
      
//       // Download treatment outcomes data
//       downloadReportAsCSV(outcomeDataForExport, 'Treatment_Outcomes');
      
//       // Short delay between downloads to prevent browser blocking
//       setTimeout(() => {
//         downloadReportAsCSV(readmissionDataForExport, 'Readmission_Rates');
//       }, 300);
      
//       setTimeout(() => {
//         downloadReportAsCSV(satisfactionDataForExport, 'Patient_Satisfaction');
        
//         toast({
//           title: "Reports downloaded",
//           description: "Patient outcomes reports have been downloaded as CSV files",
//         });
        
//         setIsGeneratingReport(false);
//       }, 600);
//     } catch (error) {
//       console.error("Error exporting reports:", error);
//       toast({
//         title: "Export failed",
//         description: "There was an error generating the reports",
//         variant: "destructive",
//       });
//       setIsGeneratingReport(false);
//     }
//   };

//   const handleTimeRangeChange = (value: string) => {
//     setTimeRange(value);
//   };

//   const handleConditionChange = (value: string) => {
//     setCondition(value);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <Select value={condition} onValueChange={handleConditionChange}>
//             <SelectTrigger className="w-full sm:w-[200px]">
//               <SelectValue placeholder="All Conditions" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="all">All Conditions</SelectItem>
//                 {conditions.map(c => (
//                   <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
          
//           <Select value={timeRange} onValueChange={handleTimeRangeChange}>
//             <SelectTrigger className="w-full sm:w-[200px]">
//               <SelectValue placeholder="Last 12 Months" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="3months">Last 3 Months</SelectItem>
//                 <SelectItem value="6months">Last 6 Months</SelectItem>
//                 <SelectItem value="12months">Last 12 Months</SelectItem>
//                 <SelectItem value="ytd">Year to Date</SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
        
//         <Button 
//           onClick={handleExportReport} 
//           variant="outline" 
//           className="gap-2"
//           disabled={isGeneratingReport}
//         >
//           <FileDown className="h-4 w-4" />
//           {isGeneratingReport ? 'Exporting...' : 'Export Report'}
//         </Button>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Treatment Outcomes</CardTitle>
//             <CardDescription>
//               Patient outcomes after treatment over time
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={treatmentOutcomeData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="Significant Improvement" stackId="a" fill="#10b981" />
//                   <Bar dataKey="Moderate Improvement" stackId="a" fill="#6366f1" />
//                   <Bar dataKey="Minimal/No Change" stackId="a" fill="#f59e0b" />
//                   <Bar dataKey="Deterioration" stackId="a" fill="#ef4444" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader>
//             <CardTitle>Patient Satisfaction</CardTitle>
//             <CardDescription>
//               Distribution of patient satisfaction scores
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={satisfactionScores}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     paddingAngle={2}
//                     dataKey="value"
//                     label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                   >
//                     {satisfactionScores.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Readmission Rates</CardTitle>
//             <CardDescription>
//               Percentage of patients readmitted after discharge
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={readmissionData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis domain={[0, 20]} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="Readmission Rate" stroke="#ef4444" strokeWidth={2} />
//                   <Line type="monotone" dataKey="Target Rate" stroke="#10b981" strokeDasharray="5 5" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default PatientOutcomesReport;
