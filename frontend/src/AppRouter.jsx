import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App"; // App.jsx is now the landing page

// Public pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccessDenied from "./pages/AccessDenied";

// Protected pages
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import MultiAISelector from "./pages/MultiAISelector";
import UnifiedAIPage from "./pages/UnifiedAIPage";
import SingleAIPage from "./pages/SingleAIPage";
import ApiKeyPage from "./pages/ApiKeyPage";

// Admin
import AdminProfile from "./pages/AdminProfile";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* API KEY PAGE — PROTECTED */}
        <Route
          path="/apikey"
          element={
            <ProtectedRoute>
              <ApiKeyPage />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/multi-ai"
          element={
            <ProtectedRoute>
              <MultiAISelector />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai/unified"
          element={
            <ProtectedRoute>
              <UnifiedAIPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai/:name"
          element={
            <ProtectedRoute>
              <SingleAIPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminProfile />} />

      </Routes>
    </Router>
  );
}