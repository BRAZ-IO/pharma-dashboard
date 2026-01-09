import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './PDV.css';

const PDV = () => {
  return (
    <div className="pdv-page">
      <div className="pdv-header">
        <h1>Ponto de Venda</h1>
        <div className="pdv-nav">
          <Link to="/app/pdv" className="nav-link active">Vendas</Link>
          <Link to="/app/pdv/vendas" className="nav-link">Histórico</Link>
          <Link to="/app/pdv/relatorios" className="nav-link">Relatórios</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default PDV;
