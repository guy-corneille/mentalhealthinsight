
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
import Reports from './pages/Reports';
import Audits from './pages/Audits';
import AuditReview from './pages/AuditReview';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Components
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
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
          <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/audits" element={<ProtectedRoute><Audits /></ProtectedRoute>} />
          <Route path="/audits/review/:id" element={<ProtectedRoute><AuditReview /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
