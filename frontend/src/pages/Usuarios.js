import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { usePermissions } from '../components/RoleProtectedRoute';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import './Usuarios.css';

const Usuarios = () => {
  const { canViewUsers, canCreateUsers } = usePermissions();

  if (!canViewUsers) {
    return (
      <RoleProtectedRoute requiredRoles={['admin', 'gerente']}>
        <div />
      </RoleProtectedRoute>
    );
  }

  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <h1>👥 Usuários</h1>
        <div className="usuarios-nav">
          <NavLink to="/app/usuarios" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Lista
          </NavLink>
          {canCreateUsers && (
            <NavLink to="/app/usuarios/cadastro" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Cadastrar
            </NavLink>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Usuarios;
