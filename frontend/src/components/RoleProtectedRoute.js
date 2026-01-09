import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente para proteger rotas baseado em roles
const RoleProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando permissões...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <div className="access-denied-icon">🔒</div>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>
            {requiredRoles.length === 1 
              ? `Esta área é restrita para ${requiredRoles[0]}s.`
              : `Esta área é restrita para: ${requiredRoles.join(', ')}.`
            }
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn-back"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Componente para proteger rotas que requerem autenticação apenas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user, hasRole } = useAuth();

  const permissions = {
    // Dashboard - todos podem ver
    canViewDashboard: true,
    
    // PDV - todos podem usar
    canUsePDV: true,
    
    // Produtos - todos podem ver, apenas admin/gerente podem cadastrar/editar
    canViewProducts: true,
    canCreateProducts: hasRole(['admin', 'gerente']),
    canEditProducts: hasRole(['admin', 'gerente']),
    canDeleteProducts: hasRole(['admin']),
    
    // Estoque - todos podem ver, apenas admin/gerente podem movimentar
    canViewStock: true,
    canMoveStock: hasRole(['admin', 'gerente']),
    canAdjustStock: hasRole(['admin', 'gerente']),
    
    // Usuários - apenas admin pode gerenciar
    canViewUsers: hasRole(['admin', 'gerente']),
    canCreateUsers: hasRole(['admin']),
    canEditUsers: hasRole(['admin']),
    canDeleteUsers: hasRole(['admin']),
    
    // Configurações - apenas admin
    canViewConfig: hasRole(['admin']),
    canEditConfig: hasRole(['admin']),
    
    // Fornecedores - todos podem ver, apenas admin/gerente podem gerenciar
    canViewSuppliers: true,
    canCreateSuppliers: hasRole(['admin', 'gerente']),
    canEditSuppliers: hasRole(['admin', 'gerente']),
    canDeleteSuppliers: hasRole(['admin']),
    
    // Clientes - todos podem ver, apenas admin/gerente podem gerenciar
    canViewCustomers: true,
    canCreateCustomers: hasRole(['admin', 'gerente']),
    canEditCustomers: hasRole(['admin', 'gerente']),
    canDeleteCustomers: hasRole(['admin']),
    
    // Fluxo de Caixa - todos podem ver, apenas admin/gerente podem movimentar
    canViewCashFlow: hasRole(['admin', 'gerente']),
    canCreateCashFlow: hasRole(['admin', 'gerente']),
    canEditCashFlow: hasRole(['admin']),
    
    // Transferências - apenas admin/gerente
    canViewTransfers: hasRole(['admin', 'gerente']),
    canCreateTransfers: hasRole(['admin', 'gerente']),
    canApproveTransfers: hasRole(['admin']),
    
    // Relatórios - todos podem ver básicos, admin/gerente podem ver completos
    canViewBasicReports: true,
    canViewAdvancedReports: hasRole(['admin', 'gerente']),
    canExportReports: hasRole(['admin', 'gerente']),
    
    // Perfil - todos podem ver o próprio
    canViewOwnProfile: true,
    canEditOwnProfile: true,
    
    // Ajuda - todos podem acessar
    canViewHelp: true
  };

  return {
    ...permissions,
    userRole: user?.role || 'guest',
    isAdmin: hasRole(['admin']),
    isGerente: hasRole(['gerente']),
    isFuncionario: hasRole(['funcionario'])
  };
};

export default ProtectedRoute;
export { RoleProtectedRoute };
