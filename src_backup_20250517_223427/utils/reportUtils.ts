
/**
 * Utility functions for generating and downloading reports
 */

import axios from 'axios';

/**
 * Converts chart data to CSV format and triggers a download
 * @param data Array of objects to convert to CSV
 * @param fileName Base name for the downloaded file (date will be appended)
 * @param title Optional title to include at the top of the CSV
 * @param description Optional description to include below the title
 * @returns void
 */
export function downloadReportAsCSV(
  data: any[], 
  fileName: string,
  title?: string,
  description?: string
) {
  if (!data || !data.length) {
    console.error("No data provided for CSV export");
    return;
  }
  
  // Initialize CSV content with title and description if provided
  let csvContent = '';
  
  if (title) {
    csvContent += `"${title}"\n`;
  }
  
  if (description) {
    csvContent += `"${description}"\n`;
  }
  
  if (title || description) {
    csvContent += '\n'; // Add empty line after metadata
  }
  
  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  // Create CSV header row with proper formatting
  csvContent += headers.map(header => {
    // Format header for readability (remove camelCase, add spaces)
    const formattedHeader = header
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    
    // Handle headers with commas or quotes
    if (formattedHeader.includes(',') || formattedHeader.includes('"')) {
      return `"${formattedHeader.replace(/"/g, '""')}"`;
    }
    return formattedHeader;
  }).join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      // Handle values that might contain commas or quotes
      const value = item[header];
      const valueStr = value === null || value === undefined ? '' : String(value);
      
      // Escape quotes and wrap values with commas in quotes
      if (valueStr.includes(',') || valueStr.includes('"')) {
        return `"${valueStr.replace(/"/g, '""')}"`;
      }
      return valueStr;
    });
    csvContent += row.join(',') + '\n';
  });
  
  // Add report generation timestamp at the bottom
  csvContent += `\n"Report generated on: ${new Date().toLocaleString()}"\n`;
  
  // Create a downloadable blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Downloads a report from the API directly
 * @param reportType Type of report to download
 * @param filters Filters to apply to the report
 * @returns Promise that resolves when download begins
 */
export async function downloadReportFromAPI(reportType: string, filters: any = {}) {
  try {
    // Use axios directly to get a blob response
    const response = await axios.get(`/reports/export/${reportType}/`, { 
      params: filters,
      responseType: 'blob' 
    });
    
    // Create a download link with proper type assertion
    const blob = new Blob([response.data as BlobPart]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `${reportType}_${date}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Failed to download report:', error);
    throw error;
  }
}
