import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cyber-900 flex-col space-y-4">
        <ShieldAlert size={64} className="text-cyber-primary animate-pulse" />
        <h2 className="text-xl font-mono text-cyber-primary tracking-widest uppercase">Verifying Security Clearance...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
