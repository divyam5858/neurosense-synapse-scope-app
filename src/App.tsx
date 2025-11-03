import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Auth
import Login from "./pages/Login";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import Assessment from "./pages/patient/Assessment";
import AssessmentResults from "./pages/patient/AssessmentResults";
import HealthTimeline from "./pages/patient/HealthTimeline";
import EHR from "./pages/patient/EHR";
import Profile from "./pages/patient/Profile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientManagement from "./pages/doctor/PatientManagement";
import PatientDetail from "./pages/doctor/PatientDetail";
import Diagnostics from "./pages/doctor/Diagnostics";
import Interventions from "./pages/doctor/Interventions";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/assessment" element={<ProtectedRoute allowedRoles={["patient"]}><Assessment /></ProtectedRoute>} />
            <Route path="/patient/results" element={<ProtectedRoute allowedRoles={["patient"]}><AssessmentResults /></ProtectedRoute>} />
            <Route path="/patient/timeline" element={<ProtectedRoute allowedRoles={["patient"]}><HealthTimeline /></ProtectedRoute>} />
            <Route path="/patient/ehr" element={<ProtectedRoute allowedRoles={["patient"]}><EHR /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["patient"]}><Profile /></ProtectedRoute>} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={["doctor"]}><PatientManagement /></ProtectedRoute>} />
            <Route path="/doctor/patient/:patientId" element={<ProtectedRoute allowedRoles={["doctor"]}><PatientDetail /></ProtectedRoute>} />
            <Route path="/doctor/diagnostics" element={<ProtectedRoute allowedRoles={["doctor"]}><Diagnostics /></ProtectedRoute>} />
            <Route path="/doctor/interventions" element={<ProtectedRoute allowedRoles={["doctor"]}><Interventions /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
