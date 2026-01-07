import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Produtos.css';

const Produtos = () => {
  return (
    <div className="produtos-page">
      <div className="produtos-header">
        <h1>Produtos</h1>
        <div className="produtos-nav">
          <NavLink to="/app/produtos" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Lista
          </NavLink>
          <NavLink to="/app/produtos/cadastro" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Cadastrar
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Produtos;
