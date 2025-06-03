import { useToast } from "@/hooks/use-toast";
import { Assessment } from '@/features/assessments/types';
import { AxiosResponse } from 'axios';
import api from '@/services/api';
import { format } from 'date-fns';
import { FileText, User, Building2, Calendar, ClipboardCheck } from 'lucide-react';

interface FacilityContact {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface AssessmentsResponse {
  results: Assessment[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface AssessmentWithDetails extends Assessment {
  patient_details?: {
    primary_staff?: {
      display_name: string;
    };
  };
}

export const useReportActions = () => {
  const { toast } = useToast();

  const fetchPreviousAssessments = async (patientId: string) => {
    try {
      const { data }: AxiosResponse<AssessmentsResponse> = await api.get('/api/assessments/', {
        params: {
          patient: patientId,
          ordering: '-assessment_date'
        }
      });
      return data.results || [];
    } catch (error) {
      console.error('Error fetching previous assessments:', error);
      return [];
    }
  };

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

  const handlePrintReport = async (assessment: AssessmentWithDetails) => {
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
      const [prevAssessments, contact] = await Promise.all([
        fetchPreviousAssessments(assessment.patient),
        fetchFacilityContact(assessment.facility)
      ]);

      const trendData = prevAssessments
        .filter(a => a.id !== assessment.id)
        .sort((a, b) => new Date(a.assessment_date).getTime() - new Date(b.assessment_date).getTime())
        .slice(-3);

      // Generate the HTML content
      printWindow.document.write(`
        <html>
          <head>
            <title>Assessment Report - ${assessment.patient_name || assessment.patient}</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
                @top-center {
                  content: "MentalHealthIQ Assessment Report";
                  font-family: -apple-system, system-ui, sans-serif;
                  font-size: 10px;
                  color: #64748b;
                }
                @bottom-center {
                  content: "Page " counter(page) " of " counter(pages);
                  font-family: -apple-system, system-ui, sans-serif;
                  font-size: 10px;
                  color: #64748b;
                }
              }
              
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                color: #334155;
                background: linear-gradient(to bottom right, #ffffff, #f8fafc);
                line-height: 1.5;
              }
              
              .header { 
                background: linear-gradient(135deg, #1e293b, #334155);
                color: white;
                padding: 2rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                position: relative;
                overflow: hidden;
              }
              
              .logo-container {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
              }
              
              .logo {
                width: 48px;
                height: 48px;
                background: #fff;
                padding: 8px;
                border-radius: 8px;
              }
              
              .app-name {
                font-size: 1.5rem;
                font-weight: bold;
                color: #fff;
              }
              
              .section {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                margin-bottom: 1.5rem;
                border: 1px solid #e2e8f0;
                page-break-inside: avoid;
              }
              
              .section-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                color: #1e293b;
                font-weight: 600;
              }
              
              .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5rem;
              }
              
              .label {
                color: #64748b;
                font-size: 0.875rem;
                font-weight: 500;
                margin-bottom: 0.25rem;
              }
              
              .value {
                font-size: 0.875rem;
                color: #1e293b;
              }
              
              .score-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 1rem;
              }
              
              .score {
                font-size: 3rem;
                font-weight: bold;
                text-align: center;
                margin: 1rem 0;
              }
              
              .score-label {
                text-align: center;
                font-size: 1.125rem;
                margin-bottom: 1rem;
              }
              
              .criteria-scores {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
              }
              
              .criterion-score {
                background: #fff;
                padding: 1rem;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
              }
              
              .score-legend {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
                padding: 1rem;
                background: #f1f5f9;
                border-radius: 6px;
              }
              
              .legend-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
              }
              
              .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
              }
              
              .trend {
                display: flex;
                justify-content: space-around;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e2e8f0;
              }
              
              .trend-item {
                text-align: center;
              }
              
              .trend-score {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 0.25rem;
              }
              
              .trend-date {
                font-size: 0.75rem;
                color: #64748b;
              }
              
              .signature-section {
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
              }
              
              .signature-line {
                margin-top: 2rem;
                border-top: 1px solid #94a3b8;
                width: 200px;
              }
              
              .signature-name {
                margin-top: 0.5rem;
                font-size: 0.875rem;
                color: #64748b;
              }
              
              @media print {
                body { 
                  margin: 0;
                  padding: 20px;
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
              <h1>Patient Assessment Report</h1>
              <p class="subtitle">Generated on ${format(new Date(), 'PPP')}</p>
            </div>
            
            <div class="section">
              <div class="section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Patient Information
              </div>
              <div class="grid">
                <div>
                  <div class="label">Patient ID</div>
                  <p class="value">${assessment.patient}</p>
                </div>
                <div>
                  <div class="label">Patient Name</div>
                  <p class="value">${assessment.patient_name || 'Unknown'}</p>
                </div>
                <div>
                  <div class="label">Primary Staff</div>
                  <p class="value">${assessment.patient_details?.primary_staff?.display_name || 'Not Assigned'}</p>
                </div>
                <div>
                  <div class="label">Facility</div>
                  <p class="value">${assessment.facility_name || assessment.facility}</p>
                </div>
                <div>
                  <div class="label">Assessment Date</div>
                  <p class="value">${format(new Date(assessment.assessment_date), 'PPP')}</p>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Assessment Results
              </div>
              
              <div class="score-card">
                <div class="score" style="color: ${getScoreColor(assessment.score)}">
                  ${assessment.score}%
                </div>
                <div class="score-label" style="color: ${getScoreColor(assessment.score)}">
                  ${getScoreLabel(assessment.score)}
                </div>
                
                ${assessment.indicator_scores ? `
                  <div class="criteria-scores">
                    ${assessment.indicator_scores.map(indicator => `
                      <div class="criterion-score">
                        <div class="label">${indicator.indicator_name}</div>
                        <div class="value" style="color: ${getScoreColor(indicator.score)}">${indicator.score}%</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                
                <div class="score-legend">
                  <div class="legend-item">
                    <div class="legend-color" style="background: #10b981"></div>
                    <span>Excellent (≥75%)</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #f59e0b"></div>
                    <span>Good (69-74%)</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #f97316"></div>
                    <span>Fair (50-68%)</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #ef4444"></div>
                    <span>Needs Improvement (<50%)</span>
                  </div>
                </div>
              </div>
              
              ${trendData.length > 0 ? `
                <div class="trend">
                  ${trendData.map(prev => `
                    <div class="trend-item">
                      <div class="trend-score" style="color: ${getScoreColor(prev.score)}">
                        ${prev.score}%
                      </div>
                      <div class="trend-date">
                        ${format(new Date(prev.assessment_date), 'MMM d')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            
            ${assessment.notes ? `
              <div class="section">
                <div class="section-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Assessment Notes
                </div>
                <p class="value">${assessment.notes}</p>
              </div>
            ` : ''}

            ${contact ? `
              <div class="section">
                <div class="section-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <path d="M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
                  </svg>
                  Facility Contact Information
                </div>
                <div class="grid">
                  <div>
                    <div class="label">Facility Name</div>
                    <p class="value">${contact.name}</p>
                  </div>
                  <div>
                    <div class="label">Address</div>
                    <p class="value">${contact.address}</p>
                  </div>
                  <div>
                    <div class="label">Phone</div>
                    <p class="value">${contact.phone}</p>
                  </div>
                  <div>
                    <div class="label">Email</div>
                    <p class="value">${contact.email}</p>
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="signature-section">
              <div class="grid">
                <div>
                  <div class="label">Evaluator</div>
                  <div class="signature-line"></div>
                  <div class="signature-name">${assessment.evaluator_name || assessment.evaluator}</div>
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

  return { handlePrintReport };
};
