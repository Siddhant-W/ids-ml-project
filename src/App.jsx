import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Toast from './components/ui/Toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TrafficMonitor from './pages/TrafficMonitor';
import AlertsEvents from './pages/AlertsEvents';
import ThreatIntel from './pages/ThreatIntel';
import PolicyManager from './pages/PolicyManager';
import MLEngine from './pages/MLEngine';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';

const AdminOnlyRedirect = () => {
  const { addToast } = useToast();
  useEffect(() => {
    addToast('Access denied. Admins only.', 'error');
  }, [addToast]);
  return <Navigate to="/dashboard" />;
};

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) return <div style={{ color: 'white' }}>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && role !== 'Admin') {
    return <AdminOnlyRedirect />;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/traffic" element={<ProtectedRoute><Layout><TrafficMonitor /></Layout></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Layout><AlertsEvents /></Layout></ProtectedRoute>} />
        <Route path="/threats" element={<ProtectedRoute><Layout><ThreatIntel /></Layout></ProtectedRoute>} />
        <Route path="/policy" element={<ProtectedRoute><Layout><PolicyManager /></Layout></ProtectedRoute>} />
        <Route path="/ml-engine" element={<ProtectedRoute><Layout><MLEngine /></Layout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      </Routes>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
