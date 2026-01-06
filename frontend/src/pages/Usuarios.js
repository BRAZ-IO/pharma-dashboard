import React from 'react';

const Usuarios = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Usuários</h1>
        <p>Gerenciamento de usuários do sistema</p>
      </div>
      
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Lista de Usuários</h3>
          <button className="btn-primary">Adicionar Usuário</button>
        </div>
        
        <div className="table-responsive">
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
              <tr>
                <td>
                  <div className="user-avatar">👤</div>
                </td>
                <td>João Silva</td>
                <td>joao.silva@email.com</td>
                <td><span className="role-badge admin">Administrador</span></td>
                <td><span className="status-badge active">Ativo</span></td>
                <td>06/01/2026 14:30</td>
                <td>
                  <button className="btn-sm btn-edit">Editar</button>
                  <button className="btn-sm btn-delete">Excluir</button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="user-avatar">👩</div>
                </td>
                <td>Maria Santos</td>
                <td>maria.santos@email.com</td>
                <td><span className="role-badge user">Usuário</span></td>
                <td><span className="status-badge active">Ativo</span></td>
                <td>06/01/2026 10:15</td>
                <td>
                  <button className="btn-sm btn-edit">Editar</button>
                  <button className="btn-sm btn-delete">Excluir</button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="user-avatar">👨</div>
                </td>
                <td>Pedro Costa</td>
                <td>pedro.costa@email.com</td>
                <td><span className="role-badge moderator">Moderador</span></td>
                <td><span className="status-badge inactive">Inativo</span></td>
                <td>05/01/2026 16:45</td>
                <td>
                  <button className="btn-sm btn-edit">Editar</button>
                  <button className="btn-sm btn-delete">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
