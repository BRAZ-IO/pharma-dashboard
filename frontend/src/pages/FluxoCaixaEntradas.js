import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FluxoCaixaEntradas.css';

const FluxoCaixaEntradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    categoria: '',
    forma_pagamento: ''
  });

  useEffect(() => {
    carregarEntradas();
  }, [filtros]);

  const carregarEntradas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.forma_pagamento) params.append('forma_pagamento', filtros.forma_pagamento);

      const response = await api.get(`/fluxo-caixa?tipo=entrada&${params}`);
      setEntradas(response.data.transacoes || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      setError('Não foi possível carregar as entradas');
      setEntradas([]);
    } finally {
      setLoading(false);
    }
  };

  const totalEntradas = entradas.reduce((sum, e) => sum + (parseFloat(e.valor) || 0), 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="fluxo-caixa-entradas">
      <div className="entradas-header">
        <h2>Entradas de Caixa</h2>
        <button className="btn btn-primary">
          + Registrar Entrada
        </button>
      </div>

      <div className="entradas-stats">
        <div className="stat-card">
          <h3>Total do Período</h3>
          <p className="stat-number">{formatCurrency(totalEntradas)}</p>
        </div>
        <div className="stat-card">
          <h3>Qtd. Transações</h3>
          <p className="stat-number">{entradas.length}</p>
        </div>
        <div className="stat-card">
          <h3>Média por Transação</h3>
          <p className="stat-number">{entradas.length > 0 ? formatCurrency(totalEntradas / entradas.length) : formatCurrency(0)}</p>
        </div>
      </div>

      <div className="entradas-filters">
        <div className="filter-group">
          <label>Data Início:</label>
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <label>Data Fim:</label>
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
          />
        </div>
        <div className="filter-group">
          <label>Categoria:</label>
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
          >
            <option value="">Todas</option>
            <option value="Vendas">Vendas</option>
            <option value="Serviços">Serviços</option>
            <option value="Contas a Receber">Contas a Receber</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Forma Pagamento:</label>
          <select
            value={filtros.forma_pagamento}
            onChange={(e) => setFiltros({...filtros, forma_pagamento: e.target.value})}
          >
            <option value="">Todas</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão Crédito">Cartão Crédito</option>
            <option value="Cartão Débito">Cartão Débito</option>
            <option value="PIX">PIX</option>
            <option value="Transferência">Transferência</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando entradas...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={carregarEntradas} className="btn btn-primary">
            🔄 Tentar novamente
          </button>
        </div>
      ) : (
        <div className="entradas-table-container">
          {entradas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma entrada encontrada no período</p>
            </div>
          ) : (
            <table className="entradas-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Forma Pagamento</th>
                  <th>Responsável</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entradas.map((entrada) => (
                  <tr key={entrada.id}>
                    <td>{formatDate(entrada.data)}</td>
                    <td className="descricao-col">{entrada.descricao}</td>
                    <td>{entrada.categoria}</td>
                    <td>{entrada.forma_pagamento}</td>
                    <td>{entrada.responsavel}</td>
                    <td className="valor-col positivo">+{formatCurrency(entrada.valor)}</td>
                    <td className="acoes-col">
                      <button className="btn btn-sm btn-outline-primary">Editar</button>
                      <button className="btn btn-sm btn-outline-danger">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default FluxoCaixaEntradas;
