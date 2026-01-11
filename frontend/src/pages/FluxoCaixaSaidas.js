import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FluxoCaixaSaidas.css';

const FluxoCaixaSaidas = () => {
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    categoria: '',
    forma_pagamento: ''
  });

  useEffect(() => {
    carregarSaidas();
  }, [filtros]);

  const carregarSaidas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.forma_pagamento) params.append('forma_pagamento', filtros.forma_pagamento);

      const response = await api.get(`/fluxo-caixa?tipo=saida&${params}`);
      setSaidas(response.data.transacoes || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar saídas:', error);
      setError('Não foi possível carregar as saídas');
      setSaidas([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSaidas = saidas.reduce((sum, s) => sum + (parseFloat(s.valor) || 0), 0);

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
    <div className="fluxo-caixa-saidas">
      <div className="saidas-header">
        <h2>Saídas de Caixa</h2>
        <button className="btn btn-primary">
          + Registrar Saída
        </button>
      </div>

      <div className="saidas-stats">
        <div className="stat-card">
          <h3>Total do Período</h3>
          <p className="stat-number">{formatCurrency(totalSaidas)}</p>
        </div>
        <div className="stat-card">
          <h3>Qtd. Transações</h3>
          <p className="stat-number">{saidas.length}</p>
        </div>
        <div className="stat-card">
          <h3>Média por Transação</h3>
          <p className="stat-number">{saidas.length > 0 ? formatCurrency(totalSaidas / saidas.length) : formatCurrency(0)}</p>
        </div>
      </div>

      <div className="saidas-filters">
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
            <option value="Compras">Compras</option>
            <option value="Despesas Fixas">Despesas Fixas</option>
            <option value="Folha de Pagamento">Folha de Pagamento</option>
            <option value="Serviços">Serviços</option>
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
            <option value="TED">TED</option>
            <option value="DOC">DOC</option>
            <option value="Boleto">Boleto</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando saídas...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={carregarSaidas} className="btn btn-primary">
            🔄 Tentar novamente
          </button>
        </div>
      ) : (
        <div className="saidas-table-container">
          {saidas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma saída encontrada no período</p>
            </div>
          ) : (
            <table className="saidas-table">
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
                {saidas.map((saida) => (
                  <tr key={saida.id}>
                    <td>{formatDate(saida.data)}</td>
                    <td className="descricao-col">{saida.descricao}</td>
                    <td>{saida.categoria}</td>
                    <td>{saida.forma_pagamento}</td>
                    <td>{saida.responsavel}</td>
                    <td className="valor-col negativo">-{formatCurrency(saida.valor)}</td>
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

export default FluxoCaixaSaidas;
