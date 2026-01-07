import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Estoque.css';

const Estoque = () => {
  return (
    <div className="estoque-page">
      <div className="estoque-header">
        <h1>Estoque</h1>
        <div className="estoque-nav">
          <NavLink to="/app/estoque" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Inventário
          </NavLink>
          <NavLink to="/app/estoque/movimentacoes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Movimentações
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Estoque;
