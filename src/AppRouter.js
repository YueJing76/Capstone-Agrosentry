// frontend/src/AppRouter.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./views/components/Common/Header";
import ProtectedRoute from "./views/components/Common/ProtectedRoute";

// Pages
import WelcomePage from "./views/pages/WelcomePage";
import LoginPage from "./views/pages/LoginPage";
import RegisterPage from "./views/pages/RegisterPage";
import DashboardPage from "./views/pages/DashboardPage";
import DetectionPage from "./views/pages/DetectionPage";
import HistoryPage from "./views/pages/HistoryPage";
import StatsPage from "./views/pages/StatsPage";
import DetectionDetailPage from "./views/pages/DetectionDetailPage";
import LandingPage from "./views/pages/LandingPage";
import AboutUsPage from "./views/pages/AboutUsPage";
import HelpPage from "./views/pages/HelpPage"; // <-- NEW: Import the new HelpPage

const AppRouter = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes (no header) */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - These will have the Header */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Header />
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Header />
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detection"
            element={
              <ProtectedRoute>
                <Header />
                <DetectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Header />
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Header />
                <StatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detection/detail/:id"
            element={
              <ProtectedRoute>
                <Header />
                <DetectionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about-us"
            element={
              <ProtectedRoute>
                <Header />
                <AboutUsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help" // <-- NEW: Route for Help page
            element={
              <ProtectedRoute>
                <Header />
                <HelpPage />
              </ProtectedRoute>
            }
          />
          {/* Fallback for authenticated users trying to access root */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/home" replace />
              </ProtectedRoute>
            }
          />

          {/* Catch-all for any other unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;