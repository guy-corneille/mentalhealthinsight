
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import FacilityAdd from "./pages/FacilityAdd";
import FacilityEdit from "./pages/FacilityEdit";
import FacilityAudit from "./pages/FacilityAudit";
import Patients from "./pages/Patients";
import Assessments from "./pages/Assessments";
import Criteria from "./pages/Criteria";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/facilities/:id" element={<FacilityDetails />} />
          <Route path="/facilities/add" element={<FacilityAdd />} />
          <Route path="/facilities/edit/:id" element={<FacilityEdit />} />
          <Route path="/facilities/audit/:id" element={<FacilityAudit />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/criteria/*" element={<Criteria />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
