import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Usuarios.css';

const Usuarios = () => {
  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <h1>Usuários</h1>
        <div className="usuarios-nav">
          <NavLink to="/app/usuarios" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Lista
          </NavLink>
          <NavLink to="/app/usuarios/cadastro" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Cadastrar
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Usuarios;
