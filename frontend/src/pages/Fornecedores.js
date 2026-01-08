import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Fornecedores.css';

const Fornecedores = () => {
  return (
    <div className="fornecedores-page">
      <div className="fornecedores-header">
        <h1>Fornecedores</h1>
        <div className="fornecedores-nav">
          <NavLink to="/app/fornecedores" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Lista
          </NavLink>
          <NavLink to="/app/fornecedores/cadastro" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Cadastrar
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Fornecedores;
