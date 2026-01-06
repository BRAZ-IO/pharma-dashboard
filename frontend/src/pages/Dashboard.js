import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema</p>
      </div>

      <div className="content-wrapper-inner">
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div className="stat-content">
                <h3>1.234</h3>
                <p>Medicamentos</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>23</h3>
                <p>Estoque Baixo</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>R$ 45.678</h3>
                <p>Vendas do Mês</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-4">
            <div className="stat-card">
              <div className="stat-icon">🔔</div>
              <div className="stat-content">
                <h3>7</h3>
                <p>Alertas</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-8">
            <div className="content-card">
              <h3>Atividades Recentes</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">📦</span>
                  <span>Lote "Dipirona 500mg" adicionado ao estoque</span>
                  <span className="activity-time">há 2 horas</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">💊</span>
                  <span>Venda registrada: Paracetamol 750mg (2 un.)</span>
                  <span className="activity-time">há 4 horas</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">👤</span>
                  <span>Novo farmacêutico "Ana Costa" foi cadastrado</span>
                  <span className="activity-time">há 6 horas</span>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">⚠️</span>
                  <span>Estoque baixo: Amoxicilina 500mg</span>
                  <span className="activity-time">há 1 dia</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="content-card">
              <h3>Status do Sistema</h3>
              <div className="status-list">
                <div className="status-item">
                  <span className="status-indicator online"></span>
                  <span>Servidor Online</span>
                </div>
                <div className="status-item">
                  <span className="status-indicator online"></span>
                  <span>Banco de Dados</span>
                </div>
                <div className="status-item">
                  <span className="status-indicator online"></span>
                  <span>Backup Automático</span>
                </div>
                <div className="status-item">
                  <span className="status-indicator warning"></span>
                  <span>ANVISA Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;