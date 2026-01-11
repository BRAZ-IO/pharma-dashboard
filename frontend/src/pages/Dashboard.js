import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendas: 0,
    totalProdutos: 0,
    clientesAtivos: 0,
    pedidosPendentes: 0,
    usuariosAtivos: 0,
    fornecedores: 0
  });

  const [vendasRecentes, setVendasRecentes] = useState([]);
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendasData, setVendasData] = useState([]);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('7dias');

  useEffect(() => {
    carregarDadosDashboard(periodoSelecionado);
  }, [periodoSelecionado]);

  const carregarDadosDashboard = async (periodo = '7dias') => {
    try {
      setLoading(true);
      setError('');

      // Buscar dados reais do backend
      const [
        usuariosResponse,
        produtosResponse,
        clientesResponse,
        fornecedoresResponse
      ] = await Promise.all([
        api.get('/usuarios'),
        api.get('/produtos'),
        api.get('/clientes'),
        api.get('/fornecedores')
      ]);

      // Buscar dados de vendas separadamente para tratamento de erro
      let vendasResponse = null;
      let vendasRecentesResponse = null;
      
      try {
        vendasResponse = await api.get(`/vendas/analise/periodo?periodo=${periodo}`);
      } catch (vendasError) {
        console.warn('Endpoint de vendas não disponível:', vendasError.message);
      }

      try {
        vendasRecentesResponse = await api.get('/vendas?limit=5');
      } catch (recentesError) {
        console.warn('Endpoint de vendas recentes não disponível:', recentesError.message);
      }

      // Calcular estatísticas
      const usuariosAtivos = usuariosResponse.data?.usuarios?.filter(u => u.ativo)?.length || 0;
      const produtosAtivos = produtosResponse.data?.produtos?.filter(p => p.ativo)?.length || 0;
      const clientesAtivos = clientesResponse.data?.clientes?.filter(c => c.ativo)?.length || 0;
      const fornecedoresAtivos = fornecedoresResponse.data?.fornecedores?.length || 0;
      
      // Calcular total de vendas
      let totalVendas = 0;
      if (vendasResponse?.data?.dados) {
        totalVendas = vendasResponse.data.dados.reduce((sum, item) => sum + (item.total || 0), 0);
      }

      // Calcular pedidos pendentes
      let pedidosPendentes = 0;
      if (vendasRecentesResponse?.data?.vendas) {
        pedidosPendentes = vendasRecentesResponse.data.vendas.filter(v => v.status === 'pendente').length;
      }

      // Buscar produtos com baixo estoque
      let produtosBaixoEstoque = [];
      try {
        const estoqueResponse = await api.get('/estoque/baixo');
        produtosBaixoEstoque = estoqueResponse.data?.produtos || [];
      } catch (estoqueError) {
        console.warn('Endpoint de estoque baixo não disponível:', estoqueError.message);
      }

      setStats({
        totalVendas,
        totalProdutos: produtosAtivos,
        clientesAtivos,
        pedidosPendentes,
        usuariosAtivos,
        fornecedores: fornecedoresAtivos
      });

      setVendasRecentes(vendasRecentesResponse?.data?.vendas || []);
      setProdutosBaixoEstoque(produtosBaixoEstoque);
      
      // Dados para o gráfico
      if (vendasResponse?.data?.dados) {
        setVendasData(vendasResponse.data.dados);
      }

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setError('Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!vendasData || vendasData.length === 0) {
      return [
        { height: '20%', label: 'Seg', value: 'R$ 0' },
        { height: '35%', label: 'Ter', value: 'R$ 0' },
        { height: '60%', label: 'Qua', value: 'R$ 0' },
        { height: '45%', label: 'Qui', value: 'R$ 0' },
        { height: '80%', label: 'Sex', value: 'R$ 0' },
        { height: '95%', label: 'Sáb', value: 'R$ 0' },
        { height: '40%', label: 'Dom', value: 'R$ 0' }
      ];
    }

    // Ordenar dados por período para consistência
    const dadosOrdenados = [...vendasData].sort((a, b) => {
      // Converter períodos para datas para ordenação correta
      const parsePeriodo = (periodo) => {
        if (periodo.includes('/')) {
          const partes = periodo.split('/');
          if (partes.length === 2) {
            // Formato DD/MM ou MM/AA
            if (partes[0].length <= 2 && partes[1].length <= 2) {
              return new Date(2026, parseInt(partes[1]) - 1, parseInt(partes[0]));
            }
          }
        }
        return new Date(periodo);
      };
      
      return parsePeriodo(a.periodo) - parsePeriodo(b.periodo);
    });

    // Calcular altura máxima para normalização
    const maxValue = Math.max(...dadosOrdenados.map(d => d.total));
    
    return dadosOrdenados.map(dado => ({
      height: maxValue > 0 ? `${(dado.total / maxValue) * 100}%` : '0%',
      label: dado.periodo,
      value: formatCurrency(dado.total)
    }));
  };

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

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Erro ao carregar dashboard</h3>
          <p>{error}</p>
          <button onClick={carregarDadosDashboard} className="btn-retry">
            🔄 Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Visão geral da Farmácia Teste</p>
        </div>
        <div className="header-actions">
          <select 
            className="periodo-select"
            value={periodoSelecionado}
            onChange={(e) => setPeriodoSelecionado(e.target.value)}
          >
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
            <option value="ano">Este ano</option>
          </select>
          <button className="btn-refresh" onClick={() => carregarDadosDashboard(periodoSelecionado)}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        <div className="kpi-cards-grid">
          <div className="kpi-card primary">
            <div className="kpi-header">
              <div className="kpi-icon">
                <span className="icon-money">💰</span>
              </div>
              <div className="kpi-trend">
                <span className="trend-up">↑ 12.5%</span>
              </div>
            </div>
            <div className="kpi-content">
              <h3>{formatCurrency(stats.totalVendas)}</h3>
              <p>Receita Total</p>
              <span className="kpi-subtitle">Período selecionado</span>
            </div>
          </div>

          <div className="kpi-card success">
            <div className="kpi-header">
              <div className="kpi-icon">
                <span className="icon-products">📦</span>
              </div>
              <div className="kpi-trend">
                <span className="trend-stable">→ 0%</span>
              </div>
            </div>
            <div className="kpi-content">
              <h3>{stats.totalProdutos}</h3>
              <p>Produtos Cadastrados</p>
              <span className="kpi-subtitle">Ativos no sistema</span>
            </div>
          </div>

          <div className="kpi-card info">
            <div className="kpi-header">
              <div className="kpi-icon">
                <span className="icon-clients">👥</span>
              </div>
              <div className="kpi-trend">
                <span className="trend-up">↑ 8.2%</span>
              </div>
            </div>
            <div className="kpi-content">
              <h3>{stats.clientesAtivos}</h3>
              <p>Clientes Ativos</p>
              <span className="kpi-subtitle">Últimos 30 dias</span>
            </div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-header">
              <div className="kpi-icon">
                <span className="icon-alert">⚠️</span>
              </div>
              <div className="kpi-trend">
                <span className="trend-down">↓ 2.1%</span>
              </div>
            </div>
            <div className="kpi-content">
              <h3>{stats.pedidosPendentes}</h3>
              <p>Ações Necessárias</p>
              <span className="kpi-subtitle">Pedidos + Estoque Baixo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          {/* Sales Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Análise de Vendas</h3>
              <div className="chart-actions">
                <button className="chart-btn">📊</button>
                <button className="chart-btn">📥</button>
              </div>
            </div>
            <div className="chart-content">
              <div className="sales-chart">
                {getChartData().map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div className="bar-container">
                      <div 
                        className="bar" 
                        style={{ height: data.height }}
                        title={data.value}
                      ></div>
                    </div>
                    <span className="bar-label">{data.label}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color primary"></div>
                  <span>Vendas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats-card">
            <div className="chart-header">
              <h3>Métricas Rápidas</h3>
              <div className="chart-actions">
                <button className="chart-btn">⚙️</button>
              </div>
            </div>
            <div className="quick-stats-content">
              <div className="quick-stat-item">
                <div className="quick-stat-icon users">
                  <span>👤</span>
                </div>
                <div className="quick-stat-info">
                  <h4>{stats.usuariosAtivos}</h4>
                  <p>Usuários Ativos</p>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-icon suppliers">
                  <span>🏭</span>
                </div>
                <div className="quick-stat-info">
                  <h4>{stats.fornecedores}</h4>
                  <p>Fornecedores</p>
                </div>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-icon performance">
                  <span>📈</span>
                </div>
                <div className="quick-stat-info">
                  <h4>94.2%</h4>
                  <p>Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="tables-section">
        <div className="tables-grid">
          {/* Recent Sales */}
          <div className="table-card">
            <div className="table-header">
              <h3>Vendas Recentes</h3>
              <div className="table-actions">
                <button className="table-btn">📋</button>
                <button className="table-btn">🔍</button>
              </div>
            </div>
            <div className="table-content">
              {vendasRecentes.length === 0 ? (
                <div className="empty-table">
                  <span className="empty-icon">📦</span>
                  <p>Nenhuma venda recente</p>
                </div>
              ) : (
                <div className="table-list">
                  {vendasRecentes.slice(0, 5).map((venda) => (
                    <div key={venda.id} className="table-row">
                      <div className="row-info">
                        <div className="row-primary">
                          <span className="row-title">{venda.numero_venda}</span>
                          <span className="row-subtitle">{venda.cliente_nome}</span>
                        </div>
                        <div className="row-meta">
                          <span className="row-date">{new Date(venda.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="row-value">
                        <span className={`row-status ${venda.status}`}>{venda.status}</span>
                        <span className="row-amount">{formatCurrency(venda.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="table-footer">
              <button className="btn-view-all">Ver todas as vendas →</button>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="table-card">
            <div className="table-header">
              <h3>Alertas de Estoque</h3>
              <div className="table-actions">
                <button className="table-btn">⚠️</button>
                <button className="table-btn">📦</button>
              </div>
            </div>
            <div className="table-content">
              {produtosBaixoEstoque.length === 0 ? (
                <div className="empty-table">
                  <span className="empty-icon">✅</span>
                  <p>Estoque em dia</p>
                </div>
              ) : (
                <div className="table-list">
                  {produtosBaixoEstoque.slice(0, 5).map((produto) => (
                    <div key={produto.id} className="table-row">
                      <div className="row-info">
                        <div className="row-primary">
                          <span className="row-title">{produto.nome}</span>
                          <span className="row-subtitle">{produto.codigo_barras}</span>
                        </div>
                        <div className="row-meta">
                          <span className="row-category">{produto.categoria}</span>
                        </div>
                      </div>
                      <div className="row-value">
                        <span className={`stock-status ${getEstoqueStatus(produto.estoque_status)}`}>
                          {produto.estoque_atual} unids
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="table-footer">
              <button className="btn-view-all">Gerenciar estoque →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
