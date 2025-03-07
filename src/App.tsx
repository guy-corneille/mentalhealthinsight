
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import FacilityAdd from "./pages/FacilityAdd";
import FacilityEdit from "./pages/FacilityEdit";
import FacilityAudit from "./pages/FacilityAudit";
import Staff from "./pages/Staff";
import Patients from "./pages/Patients";
import Assessments from "./pages/Assessments";
import Criteria from "./pages/Criteria";
import Audits from "./pages/Audits";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/facilities" element={
              <ProtectedRoute>
                <Facilities />
              </ProtectedRoute>
            } />
            <Route path="/facilities/:id" element={
              <ProtectedRoute>
                <FacilityDetails />
              </ProtectedRoute>
            } />
            <Route path="/facilities/add" element={
              <ProtectedRoute>
                <FacilityAdd />
              </ProtectedRoute>
            } />
            <Route path="/facilities/edit/:id" element={
              <ProtectedRoute>
                <FacilityEdit />
              </ProtectedRoute>
            } />
            <Route path="/facilities/audit/:id" element={
              <ProtectedRoute>
                <FacilityAudit />
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute>
                <Staff />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            } />
            <Route path="/assessments" element={
              <ProtectedRoute>
                <Assessments />
              </ProtectedRoute>
            } />
            <Route path="/audits" element={
              <ProtectedRoute>
                <Audits />
              </ProtectedRoute>
            } />
            <Route path="/criteria/*" element={
              <ProtectedRoute>
                <Criteria />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
