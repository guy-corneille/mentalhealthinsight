
/**
 * Utility functions for generating and downloading reports
 */

/**
 * Converts chart data to CSV format and triggers a download
 * @param data Array of objects to convert to CSV
 * @param fileName Base name for the downloaded file (date will be appended)
 * @returns void
 */
export function downloadReportAsCSV(data: any[], fileName: string) {
  if (!data || !data.length) {
    console.error("No data provided for CSV export");
    return;
  }
  
  // Get headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  let csvContent = headers.join(',') + '\n';
  
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
