import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBarcode, FaUser } from 'react-icons/fa';
import './PDV.css';

const PDV = () => {
  const navigate = useNavigate();

  return (
    <div className="pdv-container">
      <div className="pdv-header">
        <div className="pdv-title">
          <h1>Ponto de Venda</h1>
          <div className="pdv-nav">
            <button 
              className={`nav-btn ${window.location.pathname === '/app/pdv' ? 'active' : ''}`}
              onClick={() => navigate('/app/pdv')}
            >
              <FaShoppingCart /> Nova Venda
            </button>
            <button 
              className={`nav-btn ${window.location.pathname === '/app/pdv/historico' ? 'active' : ''}`}
              onClick={() => navigate('/app/pdv/historico')}
            >
              <FaBarcode /> Histórico
            </button>
            <button 
              className={`nav-btn ${window.location.pathname.includes('/relatorios') ? 'active' : ''}`}
              onClick={() => navigate('/app/pdv/relatorios')}
            >
              Relatórios
            </button>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default PDV;
