
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/layouts/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import NewReport from "./pages/NewReport";
import UserManagement from "./pages/UserManagement";
import SchoolManagement from "./pages/SchoolManagement";
import AuditLogs from "./pages/AuditLogs";
import Unauthorized from "./pages/Unauthorized";
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
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/new-report" element={
                <ProtectedRoute roles={['driver']}>
                  <NewReport />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute roles={['super-admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/schools" element={
                <ProtectedRoute roles={['super-admin']}>
                  <SchoolManagement />
                </ProtectedRoute>
              } />
              <Route path="/audit-logs" element={
                <ProtectedRoute roles={['super-admin']}>
                  <AuditLogs />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
