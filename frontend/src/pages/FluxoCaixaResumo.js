import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './FluxoCaixaResumo.css';

const FluxoCaixaResumo = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dados, setDados] = useState({
    saldoAnterior: 0,
    entradas: 0,
    saidas: 0,
    saldoAtual: 0
  });
  const [transacoes, setTransacoes] = useState([]);

  const carregarDadosFluxoCaixa = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Calcular datas para o período selecionado
      const hoje = new Date();
      let dataInicio, dataFim;
      
      switch (periodo) {
        case 'dia':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
          dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
          break;
        case 'semana':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - hoje.getDay());
          dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + (6 - hoje.getDay()), 23, 59, 59);
          break;
        case 'mes':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
          break;
        case 'ano':
          dataInicio = new Date(hoje.getFullYear(), 0, 1);
          dataFim = new Date(hoje.getFullYear() + 1, 0, 0, 23, 59, 59);
          break;
        default:
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
      }
      
      const params = new URLSearchParams({
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString()
      });
      
      const response = await api.get(`/fluxo-caixa/resumo?${params}`);
      const dadosFluxo = response.data;
      
      setDados({
        saldoAnterior: dadosFluxo.saldo_anterior || 0,
        entradas: dadosFluxo.totalEntradas || 0,
        saidas: dadosFluxo.totalSaidas || 0,
        saldoAtual: dadosFluxo.saldo || 0
      });
      
      setTransacoes(dadosFluxo.transacoesRecentes || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar dados do fluxo de caixa:', error);
      setError('Não foi possível carregar os dados do fluxo de caixa: ' + error.message);
      
      // Não usar mais dados mockados - mostrar o erro real
      setDados({
        saldoAnterior: 0,
        entradas: 0,
        saidas: 0,
        saldoAtual: 0
      });
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    carregarDadosFluxoCaixa();
  }, [carregarDadosFluxoCaixa]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getDadosEvolucao = () => {
    // Agrupar transações por dia para o gráfico
    const dadosAgrupados = {};
    
    transacoes.forEach(transacao => {
      const data = new Date(transacao.data).toLocaleDateString('pt-BR');
      if (!dadosAgrupados[data]) {
        dadosAgrupados[data] = 0;
      }
      const valor = parseFloat(transacao.valor) || 0;
      dadosAgrupados[data] += transacao.tipo === 'entrada' ? valor : -valor;
    });
    
    // Criar array para o gráfico
    const dias = Object.keys(dadosAgrupados).sort();
    let saldoAcumulado = parseFloat(dados.saldoAnterior) || 0;
    
    return dias.map(dia => ({
      dia: dia,
      saldo: saldoAcumulado += dadosAgrupados[dia] || 0
    }));
  };

  const getChartPoints = () => {
    const dados = getDadosEvolucao();
    if (dados.length === 0) return '';
    
    const maxValue = Math.max(...dados.map(item => Math.abs(item.valor) || 1));
    return dados.map((d, i) => {
      const y = 250 - (d.valor || 0) / maxValue * 200;
      return `${50 + i * 80},${y}`;
    }).join(' ');
  };

  const getDadosDistribuicao = () => {
    const distribuicao = {};
    
    transacoes.forEach(transacao => {
      if (!distribuicao[transacao.categoria]) {
        distribuicao[transacao.categoria] = 0;
      }
      const valor = parseFloat(transacao.valor) || 0;
      distribuicao[transacao.categoria] += valor;
    });
    
    return Object.entries(distribuicao).map(([categoria, valor]) => ({
      categoria,
      valor: valor || 0,
      cor: categoria === 'Vendas' ? '#26de81' : 
            categoria === 'Serviços' ? '#64b5f6' : 
            categoria === 'Compras' ? '#e74c3c' : 
            categoria === 'Despesas' ? '#ffa502' : '#95a5a6'
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando fluxo de caixa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={carregarDadosFluxoCaixa} className="btn-retry">
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="fluxo-caixa-resumo">
      <div className="resumo-header">
        <h2>Resumo do Fluxo de Caixa</h2>
        <select 
          className="periodo-select"
          value={periodo} 
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="dia">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="ano">Este Ano</option>
        </select>
      </div>

      <div className="resumo-cards">
        <div className="card saldo-anterior">
          <h3>Saldo Anterior</h3>
          <p className="valor">R$ {dados.saldoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card entradas">
          <h3>Entradas</h3>
          <p className="valor positivo">+R$ {dados.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card saidas">
          <h3>Saídas</h3>
          <p className="valor negativo">-R$ {dados.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card saldo-atual">
          <h3>Saldo Atual</h3>
          <p className="valor">R$ {dados.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="resumo-graficos">
        <div className="grafico-container">
          <div className="grafico-header">
            <h3>Evolução Financeira</h3>
            <div className="grafico-subtitle">Análise de Saldo Período</div>
          </div>
          <div className="evolucao-container">
            <div className="chart-wrapper">
              <div className="chart-line">
                <div className="chart-container">
                  <svg width="100%" height="250" viewBox="0 0 600 250" className="chart-svg">
                    {[0, 1, 2, 3, 4].map(i => (
                      <line
                        key={`grid-${i}`}
                        x1="50"
                        y1={50 + i * 40}
                        x2="550"
                        y2={50 + i * 40}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {[0, 1, 2, 3, 4].map(i => (
                      <text
                        key={`y-label-${i}`}
                        x="40"
                        y={55 + i * 40}
                        fill="#78909c"
                        fontSize="11"
                        textAnchor="end"
                      >
                        {getDadosEvolucao()[4 - i]?.valor || 0}
                      </text>
                    ))}
                    
                    <polyline
                      points={getChartPoints()}
                      fill="none"
                      stroke="#64b5f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    <polygon
                      points={`50,250 ${getChartPoints()} 450,250`}
                      fill="rgba(100, 181, 246, 0.2)"
                    />
                    
                    {getDadosEvolucao().map((d, i) => {
                      const maxValue = Math.max(...getDadosEvolucao().map(item => Math.abs(item.valor) || 1));
                      const y = 250 - (d.valor || 0) / maxValue * 200;
                      return (
                        <g key={`point-${i}`}>
                          <circle
                            cx={50 + i * 80}
                            cy={y}
                            r="5"
                            fill="#64b5f6"
                            className="chart-point"
                          />
                          <circle
                            cx={50 + i * 80}
                            cy={y}
                            r="8"
                            fill="rgba(100, 181, 246, 0.3)"
                            className="chart-point-hover"
                          />
                        </g>
                      );
                    })}
                    
                    {getDadosEvolucao().map((d, i) => (
                      <text
                        key={`x-label-${i}`}
                        x={50 + i * 80}
                        y="245"
                        fill="#78909c"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        {d.dia}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
            <div className="evolucao-stats">
              <div className="stat-item">
                <span className="stat-label">Maior Saldo</span>
                <span className="stat-value positive">
                  {formatCurrency(getDadosEvolucao().length > 0 ? Math.max(...getDadosEvolucao().map(d => d.valor || 0)) : 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Menor Saldo</span>
                <span className="stat-value negative">
                  {formatCurrency(getDadosEvolucao().length > 0 ? Math.min(...getDadosEvolucao().map(d => d.valor || 0)) : 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Média</span>
                <span className="stat-value">
                  {formatCurrency(getDadosEvolucao().length > 0 ? getDadosEvolucao().reduce((sum, d) => sum + (d.valor || 0), 0) / getDadosEvolucao().length : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grafico-container">
          <div className="grafico-header">
            <h3>Distribuição Financeira</h3>
            <div className="grafico-subtitle">Entradas vs Saídas</div>
          </div>
          <div className="distribuicao-container">
            <div className="pizza-wrapper">
              <div className="chart-container">
                <svg width="250" height="250" viewBox="0 0 250 250" className="pie-chart">
                  {getDadosDistribuicao().map((d, i) => {
                    const total = getDadosDistribuicao().reduce((sum, item) => sum + item.valor, 0);
                    const percentage = (d.valor / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = getDadosDistribuicao().slice(0, i).reduce((sum, item) => 
                      sum + (item.valor / total) * 360, 0
                    );
                    
                    const startAngleRad = (startAngle - 90) * Math.PI / 180;
                    const endAngleRad = (startAngle + angle - 90) * Math.PI / 180;
                    
                    const x1 = 125 + 100 * Math.cos(startAngleRad);
                    const y1 = 125 + 100 * Math.sin(startAngleRad);
                    const x2 = 125 + 100 * Math.cos(endAngleRad);
                    const y2 = 125 + 100 * Math.sin(endAngleRad);
                    
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    return (
                      <g key={`slice-${i}`} className="pie-slice">
                        <path
                          d={`M 125 125 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={d.cor}
                          className="pie-segment"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="distribuicao-legend">
              <h4>Resumo Financeiro</h4>
              <div className="legend-items">
                {getDadosDistribuicao().map((d, i) => (
                  <div key={`legend-${i}`} className="legend-item-modern">
                    <div className="legend-info">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: d.cor }}
                      ></div>
                      <div className="legend-details">
                        <span className="legend-category">{d.categoria}</span>
                        <span className="legend-amount">{formatCurrency(d.valor)}</span>
                      </div>
                    </div>
                    <div className="legend-percentage">
                      {((d.valor / getDadosDistribuicao().reduce((sum, item) => sum + item.valor, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="total-distribuicao">
                <span className="total-label">Total</span>
                <span className="total-value">
                  {formatCurrency(getDadosDistribuicao().reduce((sum, item) => sum + item.valor, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="resumo-transacoes-recentes">
        <h3>Transações Recentes</h3>
        <div className="tabela-container">
          <table className="transacoes-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#adb5bd' }}>
                    Nenhuma transação encontrada no período
                  </td>
                </tr>
              ) : (
                transacoes.map((transacao, index) => (
                  <tr key={transacao.id || index}>
                    <td>{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                    <td>{transacao.descricao}</td>
                    <td>{transacao.categoria}</td>
                    <td className={transacao.tipo === 'entrada' ? 'tipo-entrada' : 'tipo-saida'}>
                      {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </td>
                    <td className={`valor ${transacao.tipo === 'entrada' ? 'positivo' : 'negativo'}`}>
                      {transacao.tipo === 'entrada' ? '+' : '-'}R$ {parseFloat(transacao.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixaResumo;
