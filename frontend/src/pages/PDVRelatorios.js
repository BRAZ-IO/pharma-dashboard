import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PDVRelatorios.css';

const PDVRelatorios = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState('7dias');
  const [vendasPorDia, setVendasPorDia] = useState([]);
  const [vendasPorMes, setVendasPorMes] = useState([]);
  const [topProdutos, setTopProdutos] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('vendas');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      // Vendas por dia (últimos 7 dias)
      setVendasPorDia([
        { dia: 'Segunda', data: '2024-01-01', vendas: 12, total: 456.78 },
        { dia: 'Terça', data: '2024-01-02', vendas: 15, total: 623.45 },
        { dia: 'Quarta', data: '2024-01-03', vendas: 18, total: 789.23 },
        { dia: 'Quinta', data: '2024-01-04', vendas: 22, total: 945.67 },
        { dia: 'Sexta', data: '2024-01-05', vendas: 25, total: 1234.56 },
        { dia: 'Sábado', data: '2024-01-06', vendas: 8, total: 345.67 },
        { dia: 'Domingo', data: '2024-01-07', vendas: 5, total: 234.89 }
      ]);

      // Vendas por mês (últimos 6 meses)
      setVendasPorMes([
        { mes: 'Agosto/2023', vendas: 342, total: 12456.78 },
        { mes: 'Setembro/2023', vendas: 389, total: 14234.56 },
        { mes: 'Outubro/2023', vendas: 425, total: 15678.90 },
        { mes: 'Novembro/2023', vendas: 467, total: 17890.12 },
        { mes: 'Dezembro/2023', vendas: 512, total: 19456.78 },
        { mes: 'Janeiro/2024', vendas: 445, total: 16789.34 }
      ]);

      // Top produtos
      setTopProdutos([
        { nome: 'Paracetamol 750mg', vendas: 156, total: 1950.00, codigo: 'PAR750' },
        { nome: 'Dipirona 500mg', vendas: 134, total: 1192.60, codigo: 'DIP500' },
        { nome: 'Amoxicilina 500mg', vendas: 98, total: 1548.40, codigo: 'AMO500' },
        { nome: 'Ibuprofeno 400mg', vendas: 87, total: 1609.50, codigo: 'IBU400' },
        { nome: 'Vitamina D3', vendas: 76, total: 2728.40, codigo: 'VITD3' },
        { nome: 'Losartana 50mg', vendas: 65, total: 1878.50, codigo: 'LOS50' },
        { nome: 'Omeprazol 20mg', vendas: 54, total: 1204.20, codigo: 'OME20' },
        { nome: 'Metformina 850mg', vendas: 48, total: 897.60, codigo: 'MET850' }
      ]);

      // Formas de pagamento
      setFormasPagamento([
        { nome: 'Dinheiro', valor: 8234.56, percentual: 45.2, icon: '💵' },
        { nome: 'Cartão de Crédito', valor: 6789.34, percentual: 37.2, icon: '💳' },
        { nome: 'PIX', valor: 2456.78, percentual: 13.4, icon: '📱' },
        { nome: 'Cartão de Débito', valor: 1234.56, percentual: 6.8, icon: '💰' }
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

  const getTotalVendas = () => {
    const data = periodo === '7dias' ? vendasPorDia : periodo === '30dias' ? vendasPorMes : vendasPorMes;
    return data.reduce((sum, item) => sum + item.total, 0);
  };

  const getMediaMovel = () => {
    const data = periodo === '7dias' ? vendasPorDia : periodo === '30dias' ? vendasPorMes : vendasPorMes;
    const total = data.reduce((sum, item) => sum + item.total, 0);
    return total / data.length;
  };

  const getMelhorDia = () => {
    const data = periodo === '7dias' ? vendasPorDia : vendasPorMes;
    if (data.length === 0) return { dia: '-', total: 0 };
    return data.reduce((max, item) => item.total > max.total ? item : max);
  };

  const getPiorDia = () => {
    const data = periodo === '7dias' ? vendasPorDia : vendasPorMes;
    if (data.length === 0) return { dia: '-', total: 0 };
    return data.reduce((min, item) => item.total < min.total ? item : min);
  };

  const getChartData = () => {
    return selectedChart === 'vendas' ? vendasPorDia : vendasPorMes;
  };

  const getMaxValue = () => {
    const data = getChartData();
    if (data.length === 0) return 0;
    return Math.max(...data.map(item => item.total));
  };

  const handleExport = () => {
    // Simular exportação
    const csvContent = [
      ['Período', periodo],
      ['Total de Vendas', formatCurrency(getTotalVendas())],
      ['Média Diária', formatCurrency(getMediaMovel())],
      ['Melhor Dia', `${getMelhorDia().dia}: ${formatCurrency(getMelhorDia().total)}`],
      ['Pior Dia', `${getPiorDia().dia}: ${formatCurrency(getPiorDia().total)}`],
      [],
      ['Top Produtos'],
      ...topProdutos.map(produto => [produto.nome, produto.vendas, formatCurrency(produto.total)]),
      [],
      ['Formas de Pagamento'],
      ...formasPagamento.map(pagamento => [pagamento.nome, formatCurrency(pagamento.valor), `${pagamento.percentual}%`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${periodo}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pdv-relatorios-page">
      <div className="pdv-relatorios-header">
        <div className="header-content">
          <button 
            className="btn-back"
            onClick={() => navigate('/app/pdv')}
          >
            ← Voltar
          </button>
          <div className="header-title">
            <h1>Relatórios</h1>
            <p>Análise detalhada de vendas</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={handleExport}>
            📊 Exportar CSV
          </button>
        </div>
      </div>

      <div className="pdv-relatorios-content">
        {/* Período */}
        <div className="period-selector">
          <div className="period-header">
            <h3>Período de Análise</h3>
            <div className="period-buttons">
              <button 
                className={`period-btn ${periodo === '7dias' ? 'active' : ''}`}
                onClick={() => setPeriodo('7dias')}
              >
                7 dias
              </button>
              <button 
                className={`period-btn ${periodo === '30dias' ? 'active' : ''}`}
                onClick={() => setPeriodo('30dias')}
              >
                30 dias
              </button>
              <button 
                className={`period-btn ${periodo === '6meses' ? 'active' : ''}`}
                onClick={() => setPeriodo('6meses')}
              >
                6 meses
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando relatórios...</p>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <div className="relatorios-summary">
              <div className="summary-cards">
                <div className="summary-card primary">
                  <div className="summary-icon">💰</div>
                  <div className="summary-content">
                    <h3>Total de Vendas</h3>
                    <p className="summary-value">{formatCurrency(getTotalVendas())}</p>
                    <span className="summary-period">{periodo === '7dias' ? '(últimos 7 dias)' : periodo === '30dias' ? '(últimos 30 dias)' : '(últimos 6 meses)'}</span>
                  </div>
                </div>
                <div className="summary-card success">
                  <div className="summary-icon">📈</div>
                  <div className="summary-content">
                    <h3>Média Diária</h3>
                    <p className="summary-value">{formatCurrency(getMediaMovel())}</p>
                    <span className="summary-period">por dia</span>
                  </div>
                </div>
                <div className="summary-card info">
                  <div className="summary-icon">🏆</div>
                  <div className="summary-content">
                    <h3>Melhor Dia</h3>
                    <p className="summary-value">{getMelhorDia().dia}</p>
                    <span className="summary-period">{formatCurrency(getMelhorDia().total)}</span>
                  </div>
                </div>
                <div className="summary-card warning">
                  <div className="summary-icon">📉</div>
                  <div className="summary-content">
                    <h3>Pior Dia</h3>
                    <p className="summary-value">{getPiorDia().dia}</p>
                    <span className="summary-period">{formatCurrency(getPiorDia().total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="relatorios-charts">
              <div className="chart-section">
                <div className="chart-header">
                  <h3>Análise de Vendas</h3>
                  <div className="chart-toggle">
                    <button 
                      className={`chart-btn ${selectedChart === 'vendas' ? 'active' : ''}`}
                      onClick={() => setSelectedChart('vendas')}
                    >
                      Por Dia
                    </button>
                    <button 
                      className={`chart-btn ${selectedChart === 'meses' ? 'active' : ''}`}
                      onClick={() => setSelectedChart('meses')}
                    >
                      Por Mês
                    </button>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="chart-bars">
                    {getChartData().map((item, index) => {
                      const maxValue = getMaxValue();
                      const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
                      return (
                        <div key={index} className="chart-bar-wrapper">
                          <div 
                            className="chart-bar" 
                            style={{ height: `${height}%` }}
                            title={`${selectedChart === 'vendas' ? item.dia : item.mes}: ${formatCurrency(item.total)}`}
                          ></div>
                          <div className="chart-label">
                            <span>{selectedChart === 'vendas' ? item.dia.substring(0, 3) : item.mes.substring(0, 3)}</span>
                          </div>
                          <div className="chart-value">
                            <span>{formatCurrency(item.total)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Produtos */}
            <div className="top-products-section">
              <div className="section-header">
                <h3>Top Produtos</h3>
                <span className="section-subtitle">Mais vendidos no período</span>
              </div>
              <div className="products-list">
                {topProdutos.map((produto, index) => (
                  <div key={index} className="product-rank">
                    <div className="rank-number">{index + 1}</div>
                    <div className="product-info">
                      <h4>{produto.nome}</h4>
                      <p className="product-stats">
                        <span className="vendas-count">{produto.vendas} vendas</span>
                        <span className="product-total">{formatCurrency(produto.total)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div className="payment-methods-section">
              <h2>Formas de Pagamento</h2>
              <div className="payment-stats">
                {formasPagamento.map((forma, index) => (
                  <div key={index} className="payment-stat">
                    <div className="payment-info">
                      <h4>{forma.nome}</h4>
                      <p className="payment-stats">
                        <span className="payment-value">{formatCurrency(forma.valor)}</span>
                        <span className="payment-percent">({forma.percentual}%)</span>
                      </p>
                    </div>
                    <div className="payment-bar">
                      <div 
                        className="payment-bar-fill"
                        style={{ width: `${forma.percentual}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exportar */}
            <div className="export-section">
              <button className="btn-export">
                📊 Exportar Relatório Completo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDVRelatorios;
