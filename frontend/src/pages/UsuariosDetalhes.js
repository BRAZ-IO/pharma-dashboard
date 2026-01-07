import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UsuariosDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuarios = [
    { id: 1, name: 'João Silva', email: 'joao.silva@pharma.com', role: 'admin', status: 'ativo', avatar: '👨‍💼', lastLogin: '2026-01-07T14:30:00', createdAt: '2025-06-15', phone: '(11) 98765-4321', cpf: '123.456.789-00', address: 'Rua das Flores, 123 - São Paulo, SP', permissions: ['gerenciar_usuarios', 'gerenciar_produtos', 'gerenciar_estoque', 'visualizar_relatorios', 'configuracoes'] },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@pharma.com', role: 'gerente', status: 'ativo', avatar: '👩‍💼', lastLogin: '2026-01-07T13:15:00', createdAt: '2025-07-20', phone: '(11) 97654-3210', cpf: '234.567.890-11', address: 'Av. Paulista, 456 - São Paulo, SP', permissions: ['gerenciar_produtos', 'gerenciar_estoque', 'visualizar_relatorios'] },
    { id: 3, name: 'Pedro Costa', email: 'pedro.costa@pharma.com', role: 'vendedor', status: 'ativo', avatar: '👨', lastLogin: '2026-01-07T10:45:00', createdAt: '2025-08-10', phone: '(11) 96543-2109', cpf: '345.678.901-22', address: 'Rua Augusta, 789 - São Paulo, SP', permissions: ['realizar_vendas', 'visualizar_produtos'] },
    { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@pharma.com', role: 'vendedor', status: 'ativo', avatar: '👩', lastLogin: '2026-01-06T16:20:00', createdAt: '2025-09-05', phone: '(11) 95432-1098', cpf: '456.789.012-33', address: 'Rua Oscar Freire, 321 - São Paulo, SP', permissions: ['realizar_vendas', 'visualizar_produtos'] },
    { id: 5, name: 'Carlos Mendes', email: 'carlos.mendes@pharma.com', role: 'estoquista', status: 'ativo', avatar: '👨‍🔧', lastLogin: '2026-01-07T09:00:00', createdAt: '2025-10-12', phone: '(11) 94321-0987', cpf: '567.890.123-44', address: 'Rua da Consolação, 654 - São Paulo, SP', permissions: ['gerenciar_estoque', 'visualizar_produtos'] },
  ];

  const usuario = usuarios.find(u => u.id === parseInt(id));

  const roles = {
    admin: { label: 'Administrador', color: '#e74c3c', icon: '👑' },
    gerente: { label: 'Gerente', color: '#ff9800', icon: '📊' },
    vendedor: { label: 'Vendedor', color: '#64b5f6', icon: '💼' },
    estoquista: { label: 'Estoquista', color: '#26de81', icon: '📦' },
  };

  const permissionsLabels = {
    gerenciar_usuarios: 'Gerenciar Usuários',
    gerenciar_produtos: 'Gerenciar Produtos',
    gerenciar_estoque: 'Gerenciar Estoque',
    visualizar_relatorios: 'Visualizar Relatórios',
    configuracoes: 'Configurações do Sistema',
    realizar_vendas: 'Realizar Vendas',
    visualizar_produtos: 'Visualizar Produtos',
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!usuario) {
    return (
      <div className="usuario-detalhes">
        <div className="usuario-not-found">
          <h2>Usuário não encontrado</h2>
          <p>O usuário com ID {id} não existe.</p>
          <button className="btn-secondary" onClick={() => navigate('/app/usuarios')}>
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const roleInfo = roles[usuario.role];

  return (
    <div className="usuario-detalhes">
      <div className="usuario-detalhes-header">
        <div className="usuario-title-section">
          <div className="usuario-avatar-large">{usuario.avatar}</div>
          <div className="usuario-title-info">
            <h2>{usuario.name}</h2>
            <p className="usuario-email-large">{usuario.email}</p>
            <div className="usuario-badges">
              <span 
                className="role-badge-large"
                style={{ 
                  background: `${roleInfo.color}20`,
                  color: roleInfo.color 
                }}
              >
                {roleInfo.icon} {roleInfo.label}
              </span>
              <span className={`status-badge-large ${usuario.status}`}>
                {usuario.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
              </span>
            </div>
          </div>
        </div>
        <div className="usuario-actions-header">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/app/usuarios')}
          >
            Voltar
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate(`/app/usuarios/cadastro/${usuario.id}`)}
          >
            Editar Usuário
          </button>
        </div>
      </div>

      <div className="usuario-detalhes-grid">
        <div className="usuario-info-card">
          <h3>Informações Pessoais</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome Completo</span>
              <span className="info-value">{usuario.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">E-mail</span>
              <span className="info-value">{usuario.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Telefone</span>
              <span className="info-value">{usuario.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">CPF</span>
              <span className="info-value">{usuario.cpf}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Endereço</span>
              <span className="info-value">{usuario.address}</span>
            </div>
          </div>
        </div>

        <div className="usuario-activity-card">
          <h3>Atividade</h3>
          <div className="activity-info">
            <div className="activity-item">
              <span className="activity-icon">🕐</span>
              <div className="activity-details">
                <span className="activity-label">Último Acesso</span>
                <span className="activity-value">{formatDateTime(usuario.lastLogin)}</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📅</span>
              <div className="activity-details">
                <span className="activity-label">Cadastrado em</span>
                <span className="activity-value">{new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📊</span>
              <div className="activity-details">
                <span className="activity-label">Status</span>
                <span className={`activity-value ${usuario.status}`}>
                  {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="usuario-permissions-card">
          <h3>Permissões</h3>
          <div className="permissions-list">
            {usuario.permissions.map(permission => (
              <div key={permission} className="permission-item">
                <span className="permission-icon">✓</span>
                <span className="permission-label">{permissionsLabels[permission]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosDetalhes;
