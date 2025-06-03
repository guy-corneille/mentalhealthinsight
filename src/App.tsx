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

// Components
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from './components/auth/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';
import StaffForm from './components/staff/StaffForm';
import PatientForm from './pages/PatientForm';
import AssessmentList from './components/assessments/AssessmentList';
import AssessmentView from './pages/assessments/AssessmentView';

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
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/facilities" element={<ProtectedRoute><Facilities /></ProtectedRoute>} />
          <Route path="/facilities/:id" element={<ProtectedRoute><FacilityDetails /></ProtectedRoute>} />
          <Route path="/facilities/add" element={<ProtectedRoute><FacilityAdd /></ProtectedRoute>} />
          <Route path="/facilities/edit/:id" element={<ProtectedRoute><FacilityEdit /></ProtectedRoute>} />
          <Route path="/facilities/audit/:id" element={<ProtectedRoute><FacilityAudit /></ProtectedRoute>} />
          
          {/* Staff routes */}
          <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/staff/add" element={<ProtectedRoute><StaffForm /></ProtectedRoute>} />
          <Route path="/staff/edit/:id" element={<ProtectedRoute><StaffForm isEdit /></ProtectedRoute>} />
          
          {/* Patient routes */}
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/patients/add" element={<ProtectedRoute><PatientForm isEdit={false} /></ProtectedRoute>} />
          <Route path="/patients/edit/:id" element={<ProtectedRoute><PatientForm isEdit={true} /></ProtectedRoute>} />
          
          <Route path="/assessments" element={<ProtectedRoute><AssessmentList onStartAssessment={handleStartAssessment} /></ProtectedRoute>} />
          <Route path="/assessments/view/:id" element={<ProtectedRoute><AssessmentView /></ProtectedRoute>} />
          <Route path="/assessment-trends" element={<ProtectedRoute><AssessmentTrends /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/audits" element={<ProtectedRoute><Audits /></ProtectedRoute>} />
          <Route path="/audit-trends" element={<ProtectedRoute><AuditTrends /></ProtectedRoute>} />
          <Route path="/audits/:id" element={<ProtectedRoute><AuditView /></ProtectedRoute>} />
          <Route path="/assessment/:patientId" element={<ProtectedRoute><AssessmentEvaluationPage /></ProtectedRoute>} />
          
          {/* Add the Criteria routes */}
          <Route path="/criteria" element={<ProtectedRoute><Criteria /></ProtectedRoute>} />
          <Route path="/criteria/add" element={<ProtectedRoute><Criteria /></ProtectedRoute>} />
          <Route path="/criteria/edit/:id" element={<ProtectedRoute><Criteria /></ProtectedRoute>} />
          
          {/* Add the Benchmarks route */}
          <Route path="/benchmarks" element={<Benchmarks />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
