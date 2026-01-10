import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Clientes.css';

const Clientes = () => {
  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <div className="clientes-nav">
          <NavLink to="/app/clientes" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Lista
          </NavLink>
          <NavLink to="/app/clientes/cadastro" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Cadastrar
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Clientes;
