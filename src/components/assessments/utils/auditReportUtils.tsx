import { useToast } from "@/hooks/use-toast";
import { Audit } from '@/features/assessments/types';
import { AxiosResponse } from 'axios';
import api from '@/services/api';
import { format } from 'date-fns';
import { FileText, Building2, Calendar, ClipboardCheck, User } from 'lucide-react';

interface FacilityContact {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const useAuditReportActions = () => {
  const { toast } = useToast();

  const fetchFacilityContact = async (facilityId: string | number) => {
    try {
      const { data }: AxiosResponse<FacilityContact> = await api.get(`/api/facilities/${facilityId}/`);
      if (!data || typeof data !== 'object') {
        console.error('Invalid facility data format');
        return null;
      }
      
      return {
        name: data.name || 'N/A',
        address: data.address || 'N/A',
        phone: data.phone || 'N/A',
        email: data.email || 'N/A'
      };
    } catch (error) {
      console.error('Error fetching facility contact:', error);
      return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';  // Green
    if (score >= 69) return '#f59e0b';  // Yellow
    if (score >= 50) return '#f97316';  // Orange
    return '#ef4444';                   // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Excellent';
    if (score >= 69) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const handlePrintAuditReport = async (audit: Audit) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Fetch additional data
      const contact = await fetchFacilityContact(audit.facility);

      // Generate the HTML content
      printWindow.document.write(`
        <html>
          <head>
            <title>Audit Report - ${audit.facility_name}</title>
            <style>
              @page {
                size: A4;
                margin: 15mm;
                @top-center {
                  content: "MentalHealthIQ Audit Report";
                  font-family: -apple-system, system-ui, sans-serif;
                  font-size: 8px;
                  color: #64748b;
                }
                @bottom-center {
                  content: "Page " counter(page) " of " counter(pages);
                  font-family: -apple-system, system-ui, sans-serif;
                  font-size: 8px;
                  color: #64748b;
                }
              }
              
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                color: #334155;
                font-size: 11px;
                line-height: 1.4;
              }
              
              .header { 
                background: linear-gradient(135deg, #1e293b, #334155);
                color: white;
                padding: 1.5rem;
                border-radius: 6px;
                margin-bottom: 1.5rem;
              }
              
              .logo-container {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 0.75rem;
              }
              
              .logo {
                width: 32px;
                height: 32px;
                background: #fff;
                padding: 6px;
                border-radius: 6px;
              }
              
              .app-name {
                font-size: 1.25rem;
                font-weight: bold;
                color: #fff;
              }
              
              .section {
                background: white;
                padding: 1rem;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                margin-bottom: 1rem;
                border: 1px solid #e2e8f0;
                page-break-inside: avoid;
              }
              
              .section-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
                color: #1e293b;
                font-weight: 600;
                font-size: 0.875rem;
              }
              
              .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
              }
              
              .label {
                color: #64748b;
                font-size: 0.75rem;
                font-weight: 500;
                margin-bottom: 0.125rem;
              }
              
              .value {
                font-size: 0.8125rem;
                color: #1e293b;
              }
              
              .score-card {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 6px;
                margin-bottom: 0.75rem;
              }
              
              .score {
                font-size: 2rem;
                font-weight: bold;
                text-align: center;
                margin: 0.5rem 0;
              }
              
              .score-label {
                text-align: center;
                font-size: 0.875rem;
                margin-bottom: 0.5rem;
              }
              
              .criteria-scores {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.75rem;
                margin-top: 0.75rem;
              }
              
              .criterion-score {
                background: #fff;
                padding: 0.75rem;
                border-radius: 4px;
                border: 1px solid #e2e8f0;
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
              }
              
              .criterion-score .name {
                font-size: 0.75rem;
                font-weight: 500;
                color: #475569;
              }
              
              .criterion-score .score-value {
                font-size: 1rem;
                font-weight: bold;
              }
              
              .criterion-score .progress-bar {
                height: 4px;
                background: #e2e8f0;
                border-radius: 2px;
                overflow: hidden;
                margin: 0.25rem 0;
              }
              
              .criterion-score .progress-bar-fill {
                height: 100%;
                transition: width 0.3s ease;
              }
              
              .criterion-score .notes {
                font-size: 0.75rem;
                color: #64748b;
                margin-top: 0.25rem;
              }
              
              .score-legend {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.5rem;
                margin-top: 0.75rem;
                padding: 0.75rem;
                background: #f1f5f9;
                border-radius: 4px;
                font-size: 0.75rem;
              }
              
              .legend-item {
                display: flex;
                align-items: center;
                gap: 0.375rem;
              }
              
              .legend-color {
                width: 8px;
                height: 8px;
                border-radius: 50%;
              }
              
              .signature-section {
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e2e8f0;
              }
              
              .signature-line {
                margin-top: 1.5rem;
                border-top: 1px solid #94a3b8;
                width: 150px;
              }
              
              .signature-name {
                margin-top: 0.375rem;
                font-size: 0.75rem;
                color: #64748b;
              }
              
              @media print {
                body { 
                  margin: 0;
                  padding: 15px;
                  background: none;
                }
                .section { 
                  break-inside: avoid;
                  background: none;
                  box-shadow: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-container">
                <img src="/favicon.ico" alt="MentalHealthIQ Logo" class="logo" />
                <span class="app-name">MentalHealthIQ</span>
              </div>
              <h1 style="font-size: 1.25rem; margin: 0;">Facility Audit Report</h1>
              <p style="font-size: 0.875rem; margin: 0.5rem 0 0;">Generated on ${format(new Date(), 'PPP')}</p>
            </div>
            
            <div class="section">
              <div class="grid">
                <div>
                  <div class="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <path d="M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
                    </svg>
                    Facility Information
                  </div>
                  <div style="display: grid; gap: 0.5rem;">
                    <div>
                      <div class="label">Facility ID</div>
                      <div class="value">${audit.facility}</div>
                    </div>
                    <div>
                      <div class="label">Facility Name</div>
                      <div class="value">${audit.facility_name}</div>
                    </div>
                    ${contact ? `
                      <div>
                        <div class="label">Address</div>
                        <div class="value">${contact.address}</div>
                      </div>
                      <div>
                        <div class="label">Contact</div>
                        <div class="value">${contact.phone} | ${contact.email}</div>
                      </div>
                    ` : ''}
                  </div>
                </div>
                <div>
                  <div class="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Audit Information
                  </div>
                  <div style="display: grid; gap: 0.5rem;">
                    <div>
                      <div class="label">Auditor</div>
                      <div class="value">${audit.auditor_name}</div>
                    </div>
                    <div>
                      <div class="label">Audit Date</div>
                      <div class="value">${format(new Date(audit.audit_date), 'PPP')}</div>
                    </div>
                    <div>
                      <div class="label">Status</div>
                      <div class="value" style="color: ${
                        audit.status === 'completed' ? '#10b981' : 
                        audit.status === 'scheduled' ? '#3b82f6' : '#ef4444'
                      }; font-weight: 500;">
                        ${audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Overall Score
              </div>
              
              <div class="score-card">
                <div class="score" style="color: ${getScoreColor(audit.overall_score)}">
                  ${audit.overall_score}%
                </div>
                <div class="score-label" style="color: ${getScoreColor(audit.overall_score)}">
                  ${getScoreLabel(audit.overall_score)}
                </div>
                
                <div class="score-legend">
                  <div class="legend-item">
                    <div class="legend-color" style="background: #10b981"></div>
                    <span>≥75% Excellent</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #f59e0b"></div>
                    <span>69-74% Good</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #f97316"></div>
                    <span>50-68% Fair</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #ef4444"></div>
                    <span><50% Needs Work</span>
                  </div>
                </div>
              </div>
            </div>

            ${audit.criteria_scores && audit.criteria_scores.length > 0 ? `
              <div class="section">
                <div class="section-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Criteria Scores
                </div>
                <div class="criteria-scores">
                  ${audit.criteria_scores.map(score => `
                    <div class="criterion-score">
                      <span class="name">${score.criteria_name}</span>
                      <span class="score-value" style="color: ${getScoreColor(score.score)}">${score.score}%</span>
                      <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${score.score}%; background-color: ${getScoreColor(score.score)}"></div>
                      </div>
                      ${score.notes ? `<span class="notes">${score.notes}</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${audit.notes ? `
              <div class="section">
                <div class="section-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Additional Notes
                </div>
                <p class="value" style="margin: 0; white-space: pre-wrap;">${audit.notes}</p>
              </div>
            ` : ''}

            <div class="signature-section">
              <div class="grid">
                <div>
                  <div class="label">Auditor Signature</div>
                  <div class="signature-line"></div>
                  <div class="signature-name">${audit.auditor_name}</div>
                </div>
                <div>
                  <div class="label">Date</div>
                  <div class="value">${format(new Date(), 'PPP')}</div>
                </div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();

      toast({
        title: "Report ready",
        description: "The print dialog should open automatically.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive"
      });
      printWindow.close();
    }
  };

  return { handlePrintAuditReport };
}; 