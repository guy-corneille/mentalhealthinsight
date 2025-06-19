import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import Facilities from './pages/Facilities';
import FacilityDetails from './pages/FacilityDetails';
import FacilityAdd from './pages/FacilityAdd';
import FacilityEdit from './pages/FacilityEdit';
import FacilityAudit from './pages/FacilityAudit';
import Staff from './pages/Staff';
import Patients from './pages/Patients';
import Assessments from './pages/Assessments';
import AssessmentTrends from './pages/AssessmentTrends';
import Reports from './pages/Reports';
import Audits from './pages/Audits';
import AuditTrends from './pages/AuditTrends';
import AuditView from './pages/audits/AuditView';
import AuditReview from './pages/AuditReview';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Criteria from './pages/Criteria';
import Benchmarks from '@/pages/Benchmarks';
import AssessmentEvaluationPage from './pages/AssessmentEvaluationPage';
import MonitoringPage from './pages/MonitoringPage';
import FacilityDetailPage from './pages/FacilityDetailPage';
import FeedbackPage from './pages/FeedbackPage';
import FeedbackManagementPage from './pages/FeedbackManagement';
import UserManagement from './pages/UserManagement';

// Components
import { Toaster } from "@/components/ui/toaster";
import StaffForm from './components/staff/StaffForm';
import PatientForm from './pages/PatientForm';
import AssessmentList from './components/assessments/AssessmentList';
import AssessmentView from './pages/assessments/AssessmentView';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const handleStartAssessment = (patientId: string, facilityId: string) => {
    // Navigate to the assessment page
    window.location.href = `/assessment/${patientId}?facility=${facilityId}`;
  };

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/monitoring/facility/:facilityId" element={<FacilityDetailPage />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          <Route path="/facilities/add" element={<FacilityAdd />} />
          <Route path="/facilities/edit/:id" element={<FacilityEdit />} />
          <Route path="/facilities/audit/:id" element={<FacilityAudit />} />
          
          {/* Staff routes */}
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/add" element={<StaffForm />} />
          <Route path="/staff/edit/:id" element={<StaffForm isEdit />} />
          
          {/* Patient routes */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/add" element={<PatientForm isEdit={false} />} />
          <Route path="/patients/edit/:id" element={<PatientForm isEdit={true} />} />
          
          <Route path="/assessments" element={<AssessmentList onStartAssessment={handleStartAssessment} />} />
          <Route path="/assessments/view/:id" element={<AssessmentView />} />
          <Route path="/assessment-trends" element={<AssessmentTrends />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/audit-trends" element={<AuditTrends />} />
          <Route path="/audits/view/:id" element={<AuditView />} />
          <Route path="/assessment/:patientId" element={<AssessmentEvaluationPage />} />
          
          {/* Add the Criteria routes */}
          <Route path="/criteria" element={<Criteria />} />
          <Route path="/criteria/add" element={<Criteria />} />
          <Route path="/criteria/edit/:id" element={<Criteria />} />
          
          {/* Add the Benchmarks route */}
          <Route path="/benchmarks" element={<Benchmarks />} />
          
          {/* Feedback routes */}
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedback-management" element={<FeedbackManagementPage />} />
          
          <Route path="/user-management" element={<UserManagement />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
