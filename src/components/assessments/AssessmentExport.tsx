import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface AssessmentExportProps {
  data: any[];
  filename?: string;
}

const AssessmentExport: React.FC<AssessmentExportProps> = ({ data, filename = 'assessments' }) => {
  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add title and metadata
    const title = 'Mental Health IQ - Assessment Report';
    const metadata = [
      ['Generated on:', format(new Date(), 'PPP p')],
      ['Total Records:', data.length.toString()],
      [''],
    ];

    // Transform data for export
    const exportData = data.map(item => ({
      'Assessment ID': item.id,
      'Patient Name': `${item.patient?.first_name || ''} ${item.patient?.last_name || ''}`,
      'Facility': item.facility_name,
      'Assessment Date': format(new Date(item.assessment_date), 'PPP'),
      'Overall Score': item.overall_score,
      'Status': item.status,
      'Assessor': item.assessor_name,
      'Notes': item.notes || ''
    }));

    // Create worksheet with title and metadata
    const ws = XLSX.utils.aoa_to_sheet([
      [title],
      ...metadata,
      Object.keys(exportData[0] || {}),
      ...exportData.map(item => Object.values(item))
    ]);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Assessment ID
      { wch: 25 }, // Patient Name
      { wch: 20 }, // Facility
      { wch: 20 }, // Assessment Date
      { wch: 15 }, // Overall Score
      { wch: 15 }, // Status
      { wch: 20 }, // Assessor
      { wch: 40 }  // Notes
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Assessments');

    // Generate filename with date
    const exportFilename = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, exportFilename);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export to Excel
      </Button>
    </div>
  );
};

export default AssessmentExport; 