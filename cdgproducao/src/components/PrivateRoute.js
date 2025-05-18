import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return signed ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
