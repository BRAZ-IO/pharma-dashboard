import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendas: 0,
    totalProdutos: 0,
    clientesAtivos: 0,
    pedidosPendentes: 0
  });

  const [vendasRecentes, setVendasRecentes] = useState([]);
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalVendas: 45820,
        totalProdutos: 1247,
        clientesAtivos: 892,
        pedidosPendentes: 23
      });

      setVendasRecentes([
        { id: 1, cliente: 'João Silva', produto: 'Paracetamol 750mg', valor: 45.90, status: 'concluido', data: '2024-01-07 14:30' },
        { id: 2, cliente: 'Maria Santos', produto: 'Dipirona 500mg', valor: 12.50, status: 'concluido', data: '2024-01-07 14:15' },
        { id: 3, cliente: 'Carlos Oliveira', produto: 'Amoxicilina 500mg', valor: 35.80, status: 'pendente', data: '2024-01-07 14:00' },
        { id: 4, cliente: 'Ana Costa', produto: 'Ibuprofeno 400mg', valor: 28.90, status: 'concluido', data: '2024-01-07 13:45' },
        { id: 5, cliente: 'Pedro Lima', produto: 'Vitamina D3', valor: 67.50, status: 'concluido', data: '2024-01-07 13:30' }
      ]);

      setProdutosBaixoEstoque([
        { id: 1, nome: 'Paracetamol 750mg', estoque: 12, minimo: 50, status: 'critico' },
        { id: 2, nome: 'Dipirona 500mg', estoque: 28, minimo: 30, status: 'baixo' },
        { id: 3, nome: 'Amoxicilina 500mg', estoque: 8, minimo: 40, status: 'critico' },
        { id: 4, nome: 'Ibuprofeno 400mg', estoque: 35, minimo: 60, status: 'baixo' },
        { id: 5, nome: 'Vitamina C', estoque: 15, minimo: 25, status: 'baixo' }
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return '#26de81';
      case 'pendente': return '#ffa502';
      case 'cancelado': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getEstoqueStatus = (status) => {
    switch (status) {
      case 'critico': return '#e74c3c';
      case 'baixo': return '#ffa502';
      case 'normal': return '#26de81';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalVendas)}</h3>
            <p>Total de Vendas</p>
            <span className="stat-change positive">+12.5%</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 2-3.21 2-5.5A5.5 5.5 0 0 0 15.5 3c-1.76 0-3 .5-4 1.5-.99-1-2.24-1.5-4-1.5A5.5 5.5 0 0 0 2 8.5c0 2.3.51 4.05 2 5.5Z"/>
              <polyline points="12,5 12,19"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProdutos}</h3>
            <p>Total de Produtos</p>
            <span className="stat-change positive">+8.2%</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.clientesAtivos}</h3>
            <p>Clientes Ativos</p>
            <span className="stat-change positive">+15.3%</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.pedidosPendentes}</h3>
            <p>Pedidos Pendentes</p>
            <span className="stat-change negative">-5.1%</span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Vendas Recentes */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Vendas Recentes</h3>
              <button className="btn-view-all">Ver todas</button>
            </div>
            <div className="card-content">
              <div className="vendas-table">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Produto</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendasRecentes.map(venda => (
                      <tr key={venda.id}>
                        <td>{venda.cliente}</td>
                        <td>{venda.produto}</td>
                        <td>{formatCurrency(venda.valor)}</td>
                        <td>
                          <span 
                            className="status-badge" 
                            style={{ backgroundColor: getStatusColor(venda.status) }}
                          >
                            {venda.status}
                          </span>
                        </td>
                        <td>{venda.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Estoque Baixo */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Estoque Baixo</h3>
              <button className="btn-view-all">Ver todos</button>
            </div>
            <div className="card-content">
              <div className="estoque-list">
                {produtosBaixoEstoque.map(produto => (
                  <div key={produto.id} className="estoque-item">
                    <div className="estoque-info">
                      <h4>{produto.nome}</h4>
                      <p>Estoque: {produto.estoque} / Mínimo: {produto.minimo}</p>
                    </div>
                    <div className="estoque-status">
                      <span 
                        className="estoque-badge"
                        style={{ backgroundColor: getEstoqueStatus(produto.status) }}
                      >
                        {produto.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Vendas */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3>Análise de Vendas</h3>
            <div className="chart-controls">
              <button className="chart-btn active">7 dias</button>
              <button className="chart-btn">30 dias</button>
              <button className="chart-btn">12 meses</button>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '45%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
                <div className="bar" style={{ height: '95%' }}></div>
              </div>
              <div className="chart-labels">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
