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
        { nome: 'Paracetamol 750mg', vendas: 156, total: 1950.00 },
        { nome: 'Dipirona 500mg', vendas: 134, total: 1192.60 },
        { nome: 'Amoxicilina 500mg', vendas: 98, total: 1548.40 },
        { nome: 'Ibuprofeno 400mg', vendas: 87, total: 1609.50 },
        { nome: 'Vitamina D3', vendas: 76, total: 2728.40 }
      ]);

      // Formas de pagamento
      setFormasPagamento([
        { nome: 'Dinheiro', valor: 8234.56, percentual: 45.2 },
        { nome: 'Cartão de Crédito', valor: 6789.34, percentual: 37.2 },
        { nome: 'PIX', valor: 2456.78, percentual: 13.4 },
        { nome: 'Cartão de Débito', valor: 1234.56, percentual: 6.8 }
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
    return vendasPorDia.reduce((sum, dia) => sum + dia.total, 0);
  };

  const getMediaMovel = () => {
    const total = getTotalVendas();
    return total / vendasPorDia.length;
  };

  const getMelhorDia = () => {
    return vendasPorDia.reduce((melhor, dia) => dia.total > melhor.total ? dia : melhor, vendasPorDia[0]);
  };

  const getPiorDia = () => {
    return vendasPorDia.reduce((pior, dia) => dia.total < pior.total ? dia : pior, vendasPorDia[0]);
  };

  const getTotalMes = () => {
    return vendasPorMes.reduce((sum, mes) => sum + mes.total, 0);
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
            <p>Análise de vendas e métricas</p>
          </div>
        </div>
      </div>

      <div className="pdv-relatorios-content">
        {/* Período */}
        <div className="period-selector">
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
                <div className="summary-card">
                  <h3>Total de Vendas</h3>
                  <p className="summary-value">{formatCurrency(getTotalVendas())}</p>
                  <span className="summary-period">{periodo === '7dias' ? '(últimos 7 dias)' : periodo === '30dias' ? '(últimos 30 dias)' : '(últimos 6 meses)'}</span>
                </div>
                <div className="summary-card">
                  <h3>Média Diária</h3>
                  <p className="summary-value">{formatCurrency(getMediaMovel())}</p>
                  <span className="summary-period">por dia</span>
                </div>
                <div className="summary-card">
                  <h3>Melhor Dia</h3>
                  <p className="summary-value">{getMelhorDia().dia}</p>
                  <span className="summary-value">{formatCurrency(getMelhorDia().total)}</span>
                </div>
                <div className="summary-card">
                  <h3>Pior Dia</h3>
                  <p className="summary-value">{getPiorDia().dia}</p>
                  <span className="summary-value">{formatCurrency(getPiorDia().total)}</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Vendas */}
            <div className="chart-section">
              <h2>Vendas por {periodo === '7dias' ? 'Dia' : periodo === '30dias' ? 'Dia' : 'Mês'}</h2>
              <div className="chart-container">
                {periodo === '7dias' ? (
                  <div className="chart-bars">
                    {vendasPorDia.map((dia, index) => (
                      <div key={index} className="chart-bar-wrapper">
                        <div className="chart-bar" style={{ height: `${(dia.total / getMelhorDia().total) * 100}%` }}></div>
                        <div className="chart-label">{dia.dia}</div>
                        <div className="chart-value">{formatCurrency(dia.total)}</div>
                      </div>
                    ))}
                  </div>
                ) : periodo === '30dias' ? (
                  <div className="chart-bars">
                    {vendasPorDia.map((dia, index) => (
                      <div key={index} className="chart-bar-wrapper">
                        <div className="chart-bar" style={{ height: `${(dia.total / getMelhorDia().total) * 100}%` }}></div>
                        <div className="chart-label">{dia.dia}</div>
                        <div className="chart-value">{formatCurrency(dia.total)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="chart-bars">
                    {vendasPorMes.map((mes, index) => (
                      <div key={index} className="chart-bar-wrapper">
                        <div className="chart-bar" style={{ height: `${(mes.total / getTotalMes()) * 100}%` }}></div>
                        <div className="chart-label">{mes.mes}</div>
                        <div className="chart-value">{formatCurrency(mes.total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Produtos */}
            <div className="top-products-section">
              <h2>Produtos Mais Vendidos</h2>
              <div className="products-list">
                {topProdutos.map((produto, index) => (
                  <div key={index} className="product-rank">
                    <div className="rank-number">#{index + 1}</div>
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
