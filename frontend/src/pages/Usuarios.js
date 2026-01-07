import React, { useState } from 'react';
import './Usuarios.css';

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPerfil, setFilterPerfil] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  const usuarios = [
    { avatar: '👤', nome: 'João Silva', email: 'joao.silva@email.com', perfil: 'admin', status: 'ativo', ultimoAcesso: '06/01/2026 14:30' },
    { avatar: '👩', nome: 'Maria Santos', email: 'maria.santos@email.com', perfil: 'user', status: 'ativo', ultimoAcesso: '06/01/2026 10:15' },
    { avatar: '👨', nome: 'Pedro Costa', email: 'pedro.costa@email.com', perfil: 'moderator', status: 'inativo', ultimoAcesso: '05/01/2026 16:45' },
  ];

  const filtered = usuarios.filter(u => {
    const matchSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPerfil = filterPerfil === 'todos' || u.perfil === filterPerfil;
    const matchStatus = filterStatus === 'todos' || u.status === filterStatus;
    return matchSearch && matchPerfil && matchStatus;
  });

  const getPerfilLabel = (perfil) => {
    switch (perfil) {
      case 'admin': return 'Administrador';
      case 'moderator': return 'Moderador';
      case 'user': return 'Usuário';
      default: return perfil;
    }
  };

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <h1>Usuários</h1>
        <p>Gerenciamento de usuários do sistema</p>
      </div>

      <div className="content-wrapper-inner">
        <div className="content-card">
          <div className="usuarios-header">
            <h3>Lista de Usuários</h3>
            <button className="btn-primary">Adicionar Usuário</button>
          </div>

          <div className="usuarios-filtros">
            <div className="filtro-item">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filtro-input"
              />
            </div>
            <div className="filtro-item">
              <select value={filterPerfil} onChange={(e) => setFilterPerfil(e.target.value)} className="filtro-select">
                <option value="todos">Todos perfis</option>
                <option value="admin">Administrador</option>
                <option value="moderator">Moderador</option>
                <option value="user">Usuário</option>
              </select>
            </div>
            <div className="filtro-item">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filtro-select">
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        
          {/* Desktop: tabela */}
          <div className="table-wrapper desktop-only">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Último Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-avatar">{u.avatar}</div>
                    </td>
                    <td>{u.nome}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.perfil}`}>{getPerfilLabel(u.perfil)}</span></td>
                    <td><span className={`status-badge ${u.status}`}>{u.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
                    <td>{u.ultimoAcesso}</td>
                    <td>
                      <button className="btn-sm btn-edit">Editar</button>
                      <button className="btn-sm btn-delete">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="cards-wrapper mobile-only">
            {filtered.map((u, idx) => (
              <div key={idx} className="usuario-card">
                <div className="usuario-card-header">
                  <div className="usuario-card-header-main">
                    <div className="user-avatar">{u.avatar}</div>
                    <h4>{u.nome}</h4>
                  </div>
                  <span className={`status-badge ${u.status}`}>{u.status === 'ativo' ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="usuario-card-body">
                  <div className="usuario-info">
                    <span className="info-label">Email</span>
                    <span className="info-value">{u.email}</span>
                  </div>
                  <div className="usuario-info">
                    <span className="info-label">Perfil</span>
                    <span className="info-value"><span className={`role-badge ${u.perfil}`}>{getPerfilLabel(u.perfil)}</span></span>
                  </div>
                  <div className="usuario-info">
                    <span className="info-label">Último Acesso</span>
                    <span className="info-value">{u.ultimoAcesso}</span>
                  </div>
                </div>
                <div className="usuario-card-footer">
                  <button className="btn-sm btn-edit">Editar</button>
                  <button className="btn-sm btn-delete">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
