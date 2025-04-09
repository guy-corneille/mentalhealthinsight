
/**
 * Main Application Component
 * 
 * This component sets up the core providers and routing for the application.
 * It configures:
 * - React Query for data fetching
 * - React Router for page navigation
 * - Auth context for user authentication
 * - Notification context for app notifications
 * - Toast providers for success/error messages
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import * as React from "react";

// Import RadixUI TooltipProvider properly
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Import pages
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

// Configure React Query client
const queryClient = new QueryClient();

const App = () => (
  // Properly nest providers - QueryClientProvider outside TooltipProvider
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Facility routes */}
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
              
              {/* Staff routes */}
              <Route path="/staff" element={
                <ProtectedRoute>
                  <Staff />
                </ProtectedRoute>
              } />
              
              {/* Patient routes */}
              <Route path="/patients" element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              } />
              
              {/* Assessment routes */}
              <Route path="/assessments" element={
                <ProtectedRoute>
                  <Assessments />
                </ProtectedRoute>
              } />
              
              {/* Audit routes */}
              <Route path="/audits" element={
                <ProtectedRoute>
                  <Audits />
                </ProtectedRoute>
              } />
              
              {/* Criteria routes */}
              <Route path="/criteria/*" element={
                <ProtectedRoute>
                  <Criteria />
                </ProtectedRoute>
              } />
              
              {/* Report routes */}
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              {/* User routes */}
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
              
              {/* Not Found - catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
