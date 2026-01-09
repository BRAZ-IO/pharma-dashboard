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
        entradas: dadosFluxo.total_entradas || 0,
        saidas: dadosFluxo.total_saidas || 0,
        saldoAtual: dadosFluxo.saldo_atual || 0
      });
      
      setTransacoes(dadosFluxo.transacoes || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar dados do fluxo de caixa:', error);
      setError('Não foi possível carregar os dados do fluxo de caixa');
      
      // Fallback para dados mock se a API falhar
      setDados({
        saldoAnterior: 15000,
        entradas: 28500,
        saidas: 12300,
        saldoAtual: 31200
      });
      setTransacoes([
        { id: 1, descricao: 'Venda PDV - Pedido #1234', tipo: 'entrada', valor: 450, data: '2026-01-08', categoria: 'Vendas' },
        { id: 2, descricao: 'Pagamento Cliente', tipo: 'entrada', valor: 1500, data: '2026-01-07', categoria: 'Contas a Receber' },
        { id: 3, descricao: 'Compra de Medicamentos', tipo: 'saida', valor: 1200, data: '2026-01-08', categoria: 'Compras' },
        { id: 4, descricao: 'Pagamento de Aluguel', tipo: 'saida', valor: 3500, data: '2026-01-08', categoria: 'Despesas Fixas' },
        { id: 5, descricao: 'Salário Funcionários', tipo: 'saida', valor: 8500, data: '2026-01-05', categoria: 'Folha de Pagamento' }
      ]);
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
      dadosAgrupados[data] += transacao.tipo === 'entrada' ? transacao.valor : -transacao.valor;
    });
    
    // Criar array para o gráfico
    const dias = Object.keys(dadosAgrupados).sort();
    let saldoAcumulado = dados.saldoAnterior;
    
    return dias.map(dia => ({
      dia: dia,
      saldo: saldoAcumulado += dadosAgrupados[dia]
    }));
  };

  const getDadosDistribuicao = () => {
    const distribuicao = {};
    
    transacoes.forEach(transacao => {
      if (!distribuicao[transacao.categoria]) {
        distribuicao[transacao.categoria] = 0;
      }
      distribuicao[transacao.categoria] += transacao.valor;
    });
    
    return Object.entries(distribuicao).map(([categoria, valor]) => ({
      categoria,
      valor,
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
          <h3>Evolução do Saldo</h3>
          <div className="grafico-linha">
            <div className="chart-container">
              <div className="chart-line">
                <svg width="100%" height="200" viewBox="0 0 600 200" className="chart-svg">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line
                      key={`grid-${i}`}
                      x1="50"
                      y1={40 + i * 40}
                      x2="550"
                      y2={40 + i * 40}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeDasharray="2,2"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <text
                      key={`label-${i}`}
                      x="40"
                      y={45 + i * 40}
                      fill="#78909c"
                      fontSize="12"
                      textAnchor="end"
                    >
                      {formatCurrency(35000 - i * 7500)}
                    </text>
                  ))}
                  
                  {/* Line chart */}
                  <polyline
                    points={getDadosEvolucao().map((d, i) => 
                      `${50 + i * 80},${180 - (d.saldo / 35000) * 140}`
                    ).join(' ')}
                    fill="none"
                    stroke="#64b5f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points */}
                  {getDadosEvolucao().map((d, i) => (
                    <g key={`point-${i}`}>
                      <circle
                        cx={50 + i * 80}
                        cy={180 - (d.saldo / 35000) * 140}
                        r="5"
                        fill="#64b5f6"
                        className="chart-point"
                      />
                      <circle
                        cx={50 + i * 80}
                        cy={180 - (d.saldo / 35000) * 140}
                        r="8"
                        fill="rgba(100, 181, 246, 0.3)"
                        className="chart-point-hover"
                      />
                    </g>
                  ))}
                  
                  {/* X-axis labels */}
                  {getDadosEvolucao().map((d, i) => (
                    <text
                      key={`x-label-${i}`}
                      x={50 + i * 80}
                      y="195"
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
        </div>
        
        <div className="grafico-container">
          <h3>Distribuição Entradas vs Saídas</h3>
          <div className="grafico-pizza">
            <div className="chart-container">
              <svg width="200" height="200" viewBox="0 0 200 200" className="pie-chart">
                {getDadosDistribuicao().map((d, i) => {
                  const total = getDadosDistribuicao().reduce((sum, item) => sum + item.valor, 0);
                  const percentage = (d.valor / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const startAngle = getDadosDistribuicao().slice(0, i).reduce((sum, item) => 
                    sum + (item.valor / total) * 360, 0
                  );
                  
                  const startAngleRad = (startAngle - 90) * Math.PI / 180;
                  const endAngleRad = (startAngle + angle - 90) * Math.PI / 180;
                  
                  const x1 = 100 + 80 * Math.cos(startAngleRad);
                  const y1 = 100 + 80 * Math.sin(startAngleRad);
                  const x2 = 100 + 80 * Math.cos(endAngleRad);
                  const y2 = 100 + 80 * Math.sin(endAngleRad);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  return (
                    <g key={`slice-${i}`} className="pie-slice">
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={d.cor}
                        className="pie-segment"
                      />
                    </g>
                  );
                })}
              </svg>
              
              <div className="pie-legend">
                {getDadosDistribuicao().map((d, i) => (
                  <div key={`legend-${i}`} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: d.cor }}
                    ></div>
                    <span className="legend-text">{d.categoria}</span>
                    <span className="legend-value">{formatCurrency(d.valor)}</span>
                  </div>
                ))}
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
              <tr>
                <td>08/01/2026</td>
                <td>Venda PDV - Pedido #1234</td>
                <td>Vendas</td>
                <td className="tipo-entrada">Entrada</td>
                <td className="valor positivo">+R$ 450,00</td>
              </tr>
              <tr>
                <td>08/01/2026</td>
                <td>Compra de Medicamentos</td>
                <td>Compras</td>
                <td className="tipo-saida">Saída</td>
                <td className="valor negativo">-R$ 1.200,00</td>
              </tr>
              <tr>
                <td>07/01/2026</td>
                <td>Venda PDV - Pedido #1233</td>
                <td>Vendas</td>
                <td className="tipo-entrada">Entrada</td>
                <td className="valor positivo">+R$ 320,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixaResumo;
