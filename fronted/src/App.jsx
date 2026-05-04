import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Websites from './pages/Websites';
import Security from './pages/Security';
import Reports from './pages/Reports';
import WebsiteUsers from './pages/WebsiteUsers';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D1524',
              color: '#fff',
              border: '1px solid #1B2943',
              fontFamily: 'Fira Code, monospace',
              fontSize: '13px',
            },
            success: {
              iconTheme: { primary: '#00F0FF', secondary: '#060B14' },
            },
            error: {
              iconTheme: { primary: '#FF003C', secondary: '#060B14' },
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected dashboard routes — user must be logged in */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/websites" element={<Websites />} />
            <Route path="/security" element={<Security />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/website-users" element={<WebsiteUsers />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
