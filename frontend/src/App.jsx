import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LandingPage from "./pages/public/LandingPage";
import NotFound from "./pages/public/NotFound";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import DashboardHome from "./pages/dashboard/DashboardHome";
import ResumeAnalyzer from "./pages/dashboard/ResumeAnalyzer";
import ResumeBuilder from "./pages/dashboard/ResumeBuilder";
import MockInterview from "./pages/dashboard/MockInterview";
import CodingArena from "./pages/dashboard/CodingArena";
import AptitudeHub from "./pages/dashboard/AptitudeHub";
import CareerRoadmap from "./pages/dashboard/CareerRoadmap";
import JobsPage from "./pages/dashboard/JobsPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="resume-builder" element={<ResumeBuilder />} />
        <Route path="interviews" element={<MockInterview />} />
        <Route path="coding" element={<CodingArena />} />
        <Route path="aptitude" element={<AptitudeHub />} />
        <Route path="roadmap" element={<CareerRoadmap />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/app" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;