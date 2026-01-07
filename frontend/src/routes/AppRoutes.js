import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutBootstrap from '../layout/LayoutBootstrap';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './routeConfig';

// Page imports
import Login from '../pages/Login';
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
            <LayoutBootstrap />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<div className="simple-page dashboard-page"><h2>Dashboard</h2><p>Em desenvolvimento...</p></div>} />
        <Route path="pdv" element={<div className="simple-page pdv-page"><h2>PDV</h2><p>Em desenvolvimento...</p></div>} />
        <Route path="produtos" element={<div className="simple-page products-page"><h2>Produtos</h2><p>Em desenvolvimento...</p></div>} />
        <Route path="estoque" element={<div className="simple-page estoque-page"><h2>Estoque</h2><p>Em desenvolvimento...</p></div>} />
        <Route path="usuarios" element={<div className="simple-page usuarios-page"><h2>Usuários</h2><p>Em desenvolvimento...</p></div>} />
        <Route path="configuracoes" element={<div className="simple-page configuracoes-page"><h2>Configurações</h2><p>Em desenvolvimento...</p></div>} />
      </Route>
      
      {/* Fallback route - redirects to sobre */}
      <Route path="*" element={<Navigate to={ROUTES.SOBRE} replace />} />
    </Routes>
  );
};

export default AppRoutes;
