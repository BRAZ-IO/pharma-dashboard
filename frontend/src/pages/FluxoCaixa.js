import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './FluxoCaixa.css';

const FluxoCaixa = () => {
  return (
    <div className="fluxo-caixa-page">
      <div className="fluxo-caixa-header">
        <h1>Fluxo de Caixa</h1>
        <div className="fluxo-caixa-nav">
          <NavLink to="/app/fluxo-caixa" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Resumo
          </NavLink>
          <NavLink to="/app/fluxo-caixa/entradas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Entradas
          </NavLink>
          <NavLink to="/app/fluxo-caixa/saidas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Saídas
          </NavLink>
          <NavLink to="/app/fluxo-caixa/relatorios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Relatórios
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default FluxoCaixa;
