import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Configuracoes.css';

const Configuracoes = () => {
  return (
    <div className="configuracoes-page">
      <div className="configuracoes-page-header">
        <h1>Configurações</h1>
        <div className="configuracoes-nav">
          <NavLink to="/app/configuracoes" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Geral
          </NavLink>
          <NavLink to="/app/configuracoes/sistema" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Sistema
          </NavLink>
          <NavLink to="/app/configuracoes/notificacoes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Notificações
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Configuracoes;
