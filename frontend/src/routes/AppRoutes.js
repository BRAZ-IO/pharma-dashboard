import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutBootstrap from '../layout/LayoutBootstrap';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './routeConfig';

// Page imports
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PDV from '../pages/PDV';
import PDVMain from '../pages/PDVMain';
import PDVVendas from '../pages/PDVVendas';
import PDVRelatorios from '../pages/PDVRelatorios';
import Produtos from '../pages/Produtos';
import ProdutosLista from '../pages/ProdutosLista';
import ProdutosDetalhes from '../pages/ProdutosDetalhes';
import ProdutosCadastro from '../pages/ProdutosCadastro';
import Estoque from '../pages/Estoque';
import EstoqueLista from '../pages/EstoqueLista';
import EstoqueMovimentacoes from '../pages/EstoqueMovimentacoes';
import Usuarios from '../pages/Usuarios';
import UsuariosLista from '../pages/UsuariosLista';
import UsuariosDetalhes from '../pages/UsuariosDetalhes';
import UsuariosCadastro from '../pages/UsuariosCadastro';
import Configuracoes from '../pages/Configuracoes';
import ConfiguracoesGeral from '../pages/ConfiguracoesGeral';
import ConfiguracoesSistema from '../pages/ConfiguracoesSistema';
import ConfiguracoesNotificacoes from '../pages/ConfiguracoesNotificacoes';
import Registro from '../pages/Registro';
import Perfil from '../pages/Perfil';
import Ajuda from '../pages/Ajuda';
import Fornecedores from '../pages/Fornecedores';
import Clientes from '../pages/Clientes';
import ClientesLista from '../pages/ClientesLista';
import ClientesDetalhes from '../pages/ClientesDetalhes';
import ClientesCadastro from '../pages/ClientesCadastro';
import FluxoCaixa from '../pages/FluxoCaixa';
import FluxoCaixaResumo from '../pages/FluxoCaixaResumo';
import FluxoCaixaEntradas from '../pages/FluxoCaixaEntradas';
import FluxoCaixaSaidas from '../pages/FluxoCaixaSaidas';
import FluxoCaixaRelatorios from '../pages/FluxoCaixaRelatorios';
import Transferencias from '../pages/Transferencias';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      
      {/* Default route - redirects to login page */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      
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
        <Route path="estoque" element={<Estoque />}>
          <Route index element={<EstoqueLista />} />
          <Route path="movimentacoes" element={<EstoqueMovimentacoes />} />
        </Route>
        <Route path="usuarios" element={<Usuarios />}>
          <Route index element={<UsuariosLista />} />
          <Route path=":id" element={<UsuariosDetalhes />} />
          <Route path="cadastro" element={<UsuariosCadastro />} />
          <Route path="cadastro/:id" element={<UsuariosCadastro />} />
        </Route>
        <Route path="configuracoes" element={<Configuracoes />}>
          <Route index element={<ConfiguracoesGeral />} />
          <Route path="sistema" element={<ConfiguracoesSistema />} />
          <Route path="notificacoes" element={<ConfiguracoesNotificacoes />} />
        </Route>
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="clientes" element={<Clientes />}>
          <Route index element={<ClientesLista />} />
          <Route path=":id" element={<ClientesDetalhes />} />
          <Route path="cadastro" element={<ClientesCadastro />} />
          <Route path="editar/:id" element={<ClientesCadastro />} />
        </Route>
        <Route path="fluxo-caixa" element={<FluxoCaixa />}>
          <Route index element={<FluxoCaixaResumo />} />
          <Route path="entradas" element={<FluxoCaixaEntradas />} />
          <Route path="saidas" element={<FluxoCaixaSaidas />} />
          <Route path="relatorios" element={<FluxoCaixaRelatorios />} />
        </Route>
        <Route path="transferencias" element={<Transferencias />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="ajuda" element={<Ajuda />} />
      </Route>
      
      {/* Fallback route - redirects to login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRoutes;
