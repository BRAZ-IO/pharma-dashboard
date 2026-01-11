import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCalendarAlt, FaFilter, FaSync, FaChartLine } from 'react-icons/fa';
import api from '../services/api';
import './FluxoCaixaPDV.css';

const FluxoCaixaPDV = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totais, setTotais] = useState({ total_entradas: 0, total_vendas: 0 });
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    forma_pagamento: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    carregarTransacoes();
  }, [filtros]);

  const carregarTransacoes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      if (filtros.forma_pagamento) params.append('forma_pagamento', filtros.forma_pagamento);

      const response = await api.get(`/fluxo-caixa/pdv?${params}`);
      setTransacoes(response.data.transacoes || []);
      setTotais(response.data.totais || { total_entradas: 0, total_vendas: 0 });
    } catch (error) {
      console.error('Erro ao carregar transações do PDV:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const limparFiltros = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      forma_pagamento: ''
    });
  };

  const hoje = new Date().toISOString().split('T')[0];
  const ha30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="fluxo-caixa-pdv">
      <div className="header">
        <h2><FaMoneyBillWave /> Fluxo de Caixa - PDV</h2>
        <div className="header-actions">
          <button 
            className="filter-btn"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <FaFilter /> Filtros
          </button>
          <button 
            className="refresh-btn"
            onClick={carregarTransacoes}
            disabled={loading}
          >
            <FaSync className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label><FaCalendarAlt /> Data Início</label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                max={hoje}
              />
            </div>
            <div className="filter-group">
              <label><FaCalendarAlt /> Data Fim</label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                max={hoje}
              />
            </div>
            <div className="filter-group">
              <label>Forma Pagamento</label>
              <select
                value={filtros.forma_pagamento}
                onChange={(e) => setFiltros({...filtros, forma_pagamento: e.target.value})}
              >
                <option value="">Todas</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão Crédito">Cartão Crédito</option>
                <option value="Cartão Débito">Cartão Débito</option>
                <option value="PIX">PIX</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="clear-btn" onClick={limparFiltros}>
                Limpar
              </button>
            </div>
          </div>
          <div className="quick-filters">
            <button 
              className="quick-filter-btn"
              onClick={() => setFiltros({...filtros, dataInicio: hoje, dataFim: hoje})}
            >
              Hoje
            </button>
            <button 
              className="quick-filter-btn"
              onClick={() => setFiltros({...filtros, dataInicio: ha30dias, dataFim: hoje})}
            >
              Últimos 30 dias
            </button>
          </div>
        </div>
      )}

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <div className="card-content">
            <h3>Total de Entradas</h3>
            <p className="value">{formatCurrency(totais.total_entradas)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h3>Total de Vendas</h3>
            <p className="value">{totais.total_vendas}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <div className="card-content">
            <h3>Ticket Médio</h3>
            <p className="value">
              {formatCurrency(totais.total_vendas > 0 ? totais.total_entradas / totais.total_vendas : 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="transactions-list">
        <h3>Transações do PDV</h3>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando transações...</p>
          </div>
        ) : transacoes.length === 0 ? (
          <div className="empty-state">
            <FaMoneyBillWave />
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Descrição</th>
                  <th>Forma Pagamento</th>
                  <th>Responsável</th>
                  <th className="value-column">Valor</th>
                  <th>Venda</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>{formatDate(transacao.data)}</td>
                    <td>
                      <div className="description">
                        <strong>{transacao.descricao}</strong>
                        {transacao.observacoes && (
                          <small>{transacao.observacoes}</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`payment-method ${transacao.forma_pagamento.toLowerCase().replace(' ', '-')}`}>
                        {transacao.forma_pagamento}
                      </span>
                    </td>
                    <td>{transacao.responsavel}</td>
                    <td className="value-column">
                      <span className="value positive">
                        {formatCurrency(transacao.valor)}
                      </span>
                    </td>
                    <td>
                      {transacao.venda && (
                        <span className="sale-link">
                          #{transacao.venda.numero_venda}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FluxoCaixaPDV;
