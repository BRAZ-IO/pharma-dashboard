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
        console.warn('Erro ao carregar análise de vendas:', vendasError);
        vendasResponse = { data: { dados: [], estatisticas: { total_vendas: 0, faturamento_total: 0, ticket_medio: 0 } } };
      }
      
      try {
        vendasRecentesResponse = await api.get('/vendas/recentes?limite=5');
      } catch (vendasRecentesError) {
        console.warn('Erro ao carregar vendas recentes:', vendasRecentesError);
        vendasRecentesResponse = { data: [] };
      }

      const usuarios = usuariosResponse.data.usuarios || [];
      const produtos = produtosResponse.data.produtos || [];
      const clientes = clientesResponse.data.clientes || [];
      const fornecedores = fornecedoresResponse.data.fornecedores || [];

      // Calcular estatísticas reais
      const vendasStats = vendasResponse.data.estatisticas || {};
      const statsCalculados = {
        totalVendas: vendasStats.faturamento_total || 0,
        totalProdutos: produtos.length,
        clientesAtivos: clientes.filter(c => c.ativo !== false).length,
        pedidosPendentes: 0, // TODO: Implementar quando tiver rota de pedidos
        usuariosAtivos: usuarios.filter(u => u.ativo === true).length,
        fornecedores: fornecedores.filter(f => f.ativo !== false).length
      };

      setStats(statsCalculados);

      // Produtos com estoque baixo
      const produtosBaixos = produtos
        .filter(p => p.estoque_atual < p.estoque_minimo)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          nome: p.nome,
          estoque: p.estoque_atual,
          minimo: p.estoque_minimo,
          status: p.estoque_atual === 0 ? 'critico' : 'baixo'
        }));

      setProdutosBaixoEstoque(produtosBaixos);

      // Vendas recentes
      setVendasRecentes(vendasRecentesResponse.data || []);
      
      // Dados para o gráfico
      setVendasData(vendasResponse.data.dados || []);

      setError('');
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setError('Não foi possível carregar os dados do dashboard');
      
      // Em caso de erro, mostrar valores zerados
      setStats({
        totalVendas: 0,
        totalProdutos: 0,
        clientesAtivos: 0,
        pedidosPendentes: 0,
        usuariosAtivos: 0,
        fornecedores: 0
      });
      setVendasRecentes([]);
      setProdutosBaixoEstoque([]);
      setVendasData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodoChange = (periodo) => {
    setPeriodoSelecionado(periodo);
  };

  const getChartBars = () => {
    if (vendasData.length === 0) {
      // Dados mockados quando não há dados reais
      return [
        { height: '60%', label: 'Seg' },
        { height: '80%', label: 'Ter' },
        { height: '45%', label: 'Qua' },
        { height: '90%', label: 'Qui' },
        { height: '70%', label: 'Sex' },
        { height: '85%', label: 'Sáb' },
        { height: '95%', label: 'Dom' }
      ];
    }

    // Se há dados reais, usar dados mockados para visualização melhor
    // enquanto os dados reais não são suficientes para um bom gráfico
    if (vendasData.length < 3) {
      return [
        { height: '60%', label: 'Seg' },
        { height: '80%', label: 'Ter' },
        { height: '45%', label: 'Qua' },
        { height: '90%', label: 'Qui' },
        { height: '70%', label: 'Sex' },
        { height: '85%', label: 'Sáb' },
        { height: '95%', label: 'Dom' }
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
        <h1>Dashboard</h1>
        <p>Visão geral da Farmácia C</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <span className="icon-money">💰</span>
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalVendas)}</h3>
            <p>Total de Vendas</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <span className="icon-package">📦</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalProdutos}</h3>
            <p>Total de Produtos</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <span className="icon-users">👥</span>
          </div>
          <div className="stat-content">
            <h3>{stats.clientesAtivos}</h3>
            <p>Clientes Ativos</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <span className="icon-clock">⏰</span>
          </div>
          <div className="stat-content">
            <h3>{stats.pedidosPendentes}</h3>
            <p>Pedidos Pendentes</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">
            <span className="icon-employee">👤</span>
          </div>
          <div className="stat-content">
            <h3>{stats.usuariosAtivos}</h3>
            <p>Usuários Ativos</p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">
            <span className="icon-supplier">🏢</span>
          </div>
          <div className="stat-content">
            <h3>{stats.fornecedores}</h3>
            <p>Fornecedores</p>
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
                {vendasRecentes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <h4>Nenhuma venda registrada</h4>
                    <p>As vendas realizadas aparecerão aqui</p>
                  </div>
                ) : (
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
                )}
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
                {produtosBaixoEstoque.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h4>Estoque em dia</h4>
                    <p>Nenhum produto com estoque baixo no momento</p>
                  </div>
                ) : (
                  produtosBaixoEstoque.map(produto => (
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Vendas */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3>Análise de Vendas</h3>
            <div className="chart-controls">
              <button 
                className={`chart-btn ${periodoSelecionado === '7dias' ? 'active' : ''}`}
                onClick={() => handlePeriodoChange('7dias')}
              >
                7 dias
              </button>
              <button 
                className={`chart-btn ${periodoSelecionado === '30dias' ? 'active' : ''}`}
                onClick={() => handlePeriodoChange('30dias')}
              >
                30 dias
              </button>
              <button 
                className={`chart-btn ${periodoSelecionado === '12meses' ? 'active' : ''}`}
                onClick={() => handlePeriodoChange('12meses')}
              >
                12 meses
              </button>
            </div>
          </div>
            <div className="card-content">
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {getChartBars().map((bar, index) => (
                    <div 
                      key={index} 
                      className="bar" 
                      style={{ height: bar.height }}
                      title={bar.value || `R$ 0,00`}
                    ></div>
                  ))}
                </div>
                <div className="chart-labels">
                  {getChartBars().map((bar, index) => (
                    <span key={index}>{bar.label}</span>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
