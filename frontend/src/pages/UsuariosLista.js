import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsuariosLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  const [usuarios] = useState([
    { id: 1, name: 'João Silva', email: 'joao.silva@pharma.com', role: 'admin', status: 'ativo', avatar: '👨‍💼', lastLogin: '2026-01-07T14:30:00', createdAt: '2025-06-15' },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@pharma.com', role: 'gerente', status: 'ativo', avatar: '👩‍💼', lastLogin: '2026-01-07T13:15:00', createdAt: '2025-07-20' },
    { id: 3, name: 'Pedro Costa', email: 'pedro.costa@pharma.com', role: 'vendedor', status: 'ativo', avatar: '👨', lastLogin: '2026-01-07T10:45:00', createdAt: '2025-08-10' },
    { id: 4, name: 'Ana Oliveira', email: 'ana.oliveira@pharma.com', role: 'vendedor', status: 'ativo', avatar: '👩', lastLogin: '2026-01-06T16:20:00', createdAt: '2025-09-05' },
    { id: 5, name: 'Carlos Mendes', email: 'carlos.mendes@pharma.com', role: 'estoquista', status: 'ativo', avatar: '👨‍🔧', lastLogin: '2026-01-07T09:00:00', createdAt: '2025-10-12' },
    { id: 6, name: 'Juliana Ferreira', email: 'juliana.ferreira@pharma.com', role: 'vendedor', status: 'inativo', avatar: '👩', lastLogin: '2025-12-20T11:30:00', createdAt: '2025-05-08' },
    { id: 7, name: 'Roberto Lima', email: 'roberto.lima@pharma.com', role: 'gerente', status: 'ativo', avatar: '👨‍💼', lastLogin: '2026-01-07T12:00:00', createdAt: '2025-06-25' },
    { id: 8, name: 'Fernanda Alves', email: 'fernanda.alves@pharma.com', role: 'estoquista', status: 'ativo', avatar: '👩‍🔧', lastLogin: '2026-01-07T08:30:00', createdAt: '2025-11-18' },
  ]);

  const roles = {
    admin: { label: 'Administrador', color: '#e74c3c' },
    gerente: { label: 'Gerente', color: '#ff9800' },
    vendedor: { label: 'Vendedor', color: '#64b5f6' },
    estoquista: { label: 'Estoquista', color: '#26de81' },
  };

  const filteredUsers = usuarios.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === 'ativo').length,
    inativos: usuarios.filter(u => u.status === 'inativo').length,
    admins: usuarios.filter(u => u.role === 'admin').length,
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
    console.log(`Alterando status de ${user.name} para ${newStatus}`);
    alert(`Status alterado! (Funcionalidade em desenvolvimento)`);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      console.log(`Excluindo usuário ${user.name}`);
      alert(`Usuário excluído! (Funcionalidade em desenvolvimento)`);
    }
  };

  return (
    <div className="usuarios-lista">
      <div className="usuarios-lista-header">
        <div className="usuarios-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total de Usuários</span>
          </div>
          <div className="stat-card success">
            <span className="stat-value">{stats.ativos}</span>
            <span className="stat-label">Usuários Ativos</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">{stats.inativos}</span>
            <span className="stat-label">Usuários Inativos</span>
          </div>
          <div className="stat-card info">
            <span className="stat-value">{stats.admins}</span>
            <span className="stat-label">Administradores</span>
          </div>
        </div>

        <button 
          className="btn-novo-usuario"
          onClick={() => navigate('/app/usuarios/cadastro')}
        >
          + Novo Usuário
        </button>
      </div>

      <div className="usuarios-controls">
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="role-select"
        >
          <option value="todos">Todos os Cargos</option>
          <option value="admin">Administrador</option>
          <option value="gerente">Gerente</option>
          <option value="vendedor">Vendedor</option>
          <option value="estoquista">Estoquista</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-select"
        >
          <option value="todos">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      <div className="usuarios-grid">
        {filteredUsers.map(user => {
          const roleInfo = roles[user.role];
          
          return (
            <div key={user.id} className="usuario-card">
              <div className="usuario-header">
                <div className="usuario-avatar">{user.avatar}</div>
                <div className="usuario-info">
                  <h3>{user.name}</h3>
                  <p className="usuario-email">{user.email}</p>
                </div>
                <span className={`status-badge ${user.status}`}>
                  {user.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
                </span>
              </div>

              <div className="usuario-details">
                <div className="detail-row">
                  <span className="detail-label">Cargo:</span>
                  <span 
                    className="role-badge"
                    style={{ 
                      background: `${roleInfo.color}20`,
                      color: roleInfo.color 
                    }}
                  >
                    {roleInfo.label}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Último acesso:</span>
                  <span className="detail-value">{formatDateTime(user.lastLogin)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Cadastrado em:</span>
                  <span className="detail-value">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="usuario-actions">
                <button 
                  className="btn-action btn-view"
                  onClick={() => navigate(`/app/usuarios/${user.id}`)}
                  title="Ver detalhes"
                >
                  👁️ Ver
                </button>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/app/usuarios/cadastro/${user.id}`)}
                  title="Editar"
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-action btn-toggle"
                  onClick={() => handleToggleStatus(user)}
                  title={user.status === 'ativo' ? 'Desativar' : 'Ativar'}
                >
                  {user.status === 'ativo' ? '🔒' : '🔓'}
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDeleteUser(user)}
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosLista;
