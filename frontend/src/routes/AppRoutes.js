import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutBootstrap from '../layout/LayoutBootstrap';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './routeConfig';

// Page imports
import Login from '../pages/Login';
import Sobre from '../pages/Sobre';
import Dashboard from '../pages/Dashboard';
import PDV from '../pages/PDV';
import PDVMain from '../pages/PDVMain';
import PDVVendas from '../pages/PDVVendas';
import PDVRelatorios from '../pages/PDVRelatorios';
import Produtos from '../pages/Produtos';
import ProdutosLista from '../pages/ProdutosLista';
import ProdutosDetalhes from '../pages/ProdutosDetalhes';
import ProdutosCadastro from '../pages/ProdutosCadastro';

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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pdv" element={<PDV />}>
          <Route index element={<PDVMain />} />
          <Route path="vendas" element={<PDVVendas />} />
          <Route path="relatorios" element={<PDVRelatorios />} />
        </Route>
        <Route path="produtos" element={<Produtos />}>
          <Route index element={<ProdutosLista />} />
          <Route path=":id" element={<ProdutosDetalhes />} />
          <Route path="cadastro" element={<ProdutosCadastro />} />
          <Route path="cadastro/:id" element={<ProdutosCadastro />} />
        </Route>
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
