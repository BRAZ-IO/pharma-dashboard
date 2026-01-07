import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './routeConfig';

// Page imports
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PDV from '../pages/PDV';
import Produtos from '../pages/Produtos';
import Estoque from '../pages/Estoque';
import Usuarios from '../pages/Usuarios';
import Configuracoes from '../pages/Configuracoes';
import Sobre from '../pages/Sobre';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SOBRE} element={<Sobre />} />
      
      {/* Default route - redirects to sobre page */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SOBRE} replace />} />
      
      {/* Protected Routes - requires authentication */}
      <Route
        path={ROUTES.APP}
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pdv" element={<PDV />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
      
      {/* Fallback route - redirects to sobre */}
      <Route path="*" element={<Navigate to={ROUTES.SOBRE} replace />} />
    </Routes>
  );
};

export default AppRoutes;
