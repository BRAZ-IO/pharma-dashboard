import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EstoqueMovimentacoes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterDate, setFilterDate] = useState('todos');

  const [movimentacoes] = useState([
    { id: 1, produto: 'Paracetamol 750mg', tipo: 'entrada', quantidade: 50, motivo: 'Compra', responsavel: 'João Silva', data: '2026-01-07T10:30:00', lote: 'L20240115', observacao: 'Pedido #1234' },
    { id: 2, produto: 'Dipirona 500mg', tipo: 'saida', quantidade: 10, motivo: 'Venda', responsavel: 'Sistema PDV', data: '2026-01-07T09:15:00', lote: 'L20240120', observacao: 'Venda #VND-001' },
    { id: 3, produto: 'Amoxicilina 500mg', tipo: 'entrada', quantidade: 30, motivo: 'Compra', responsavel: 'Maria Santos', data: '2026-01-06T14:20:00', lote: 'L20240118', observacao: 'Pedido #1233' },
    { id: 4, produto: 'Ibuprofeno 400mg', tipo: 'saida', quantidade: 5, motivo: 'Venda', responsavel: 'Sistema PDV', data: '2026-01-06T11:45:00', lote: 'L20240110', observacao: 'Venda #VND-002' },
    { id: 5, produto: 'Vitamina D3', tipo: 'ajuste', quantidade: -2, motivo: 'Ajuste de Inventário', responsavel: 'João Silva', data: '2026-01-05T16:00:00', lote: 'L20240125', observacao: 'Produto danificado' },
    { id: 6, produto: 'Omeprazol 20mg', tipo: 'entrada', quantidade: 25, motivo: 'Compra', responsavel: 'Maria Santos', data: '2026-01-05T10:00:00', lote: 'L20240112', observacao: 'Pedido #1232' },
    { id: 7, produto: 'Loratadina 10mg', tipo: 'saida', quantidade: 8, motivo: 'Venda', responsavel: 'Sistema PDV', data: '2026-01-05T15:30:00', lote: 'L20240122', observacao: 'Venda #VND-003' },
    { id: 8, produto: 'Ácido Fólico 5mg', tipo: 'saida', quantidade: 3, motivo: 'Venda', responsavel: 'Sistema PDV', data: '2026-01-04T13:20:00', lote: 'L20240105', observacao: 'Venda #VND-004' },
    { id: 9, produto: 'Azitromicina 500mg', tipo: 'saida', quantidade: 5, motivo: 'Venda', responsavel: 'Sistema PDV', data: '2026-01-03T10:10:00', lote: 'L20231220', observacao: 'Venda #VND-005' },
    { id: 10, produto: 'Dorflex', tipo: 'entrada', quantidade: 60, motivo: 'Compra', responsavel: 'João Silva', data: '2026-01-03T09:00:00', lote: 'L20240128', observacao: 'Pedido #1231' },
    { id: 11, produto: 'Paracetamol 750mg', tipo: 'saida', quantidade: 12, motivo: 'Venda', responsavel: 'Sistema PDV', data: '2026-01-02T14:45:00', lote: 'L20240115', observacao: 'Venda #VND-006' },
    { id: 12, produto: 'Dipirona 500mg', tipo: 'ajuste', quantidade: 5, motivo: 'Ajuste de Inventário', responsavel: 'Maria Santos', data: '2026-01-02T11:30:00', lote: 'L20240120', observacao: 'Correção de contagem' },
  ]);

  const getTipoInfo = (tipo) => {
    switch (tipo) {
      case 'entrada':
        return { label: 'Entrada', icon: '📥', class: 'tipo-entrada' };
      case 'saida':
        return { label: 'Saída', icon: '📤', class: 'tipo-saida' };
      case 'ajuste':
        return { label: 'Ajuste', icon: '⚙️', class: 'tipo-ajuste' };
      default:
        return { label: tipo, icon: '📋', class: '' };
    }
  };

  const getDateFilter = (data) => {
    const hoje = new Date();
    const dataMovimentacao = new Date(data);
    const diffTime = Math.abs(hoje - dataMovimentacao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (filterDate === 'hoje' && diffDays > 1) return false;
    if (filterDate === 'semana' && diffDays > 7) return false;
    if (filterDate === 'mes' && diffDays > 30) return false;
    return true;
  };

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchesSearch = mov.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || mov.tipo === filterType;
    const matchesDate = getDateFilter(mov.data);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const stats = {
    entradas: movimentacoes.filter(m => m.tipo === 'entrada').reduce((sum, m) => sum + m.quantidade, 0),
    saidas: movimentacoes.filter(m => m.tipo === 'saida').reduce((sum, m) => sum + m.quantidade, 0),
    ajustes: movimentacoes.filter(m => m.tipo === 'ajuste').length,
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="estoque-movimentacoes">
      <div className="movimentacoes-header">
        <div className="movimentacoes-stats">
          <div className="stat-card entrada">
            <span className="stat-icon">📥</span>
            <div className="stat-info">
              <span className="stat-value">{stats.entradas}</span>
              <span className="stat-label">Total Entradas</span>
            </div>
          </div>
          <div className="stat-card saida">
            <span className="stat-icon">📤</span>
            <div className="stat-info">
              <span className="stat-value">{stats.saidas}</span>
              <span className="stat-label">Total Saídas</span>
            </div>
          </div>
          <div className="stat-card ajuste">
            <span className="stat-icon">⚙️</span>
            <div className="stat-info">
              <span className="stat-value">{stats.ajustes}</span>
              <span className="stat-label">Ajustes</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-voltar"
          onClick={() => navigate('/app/estoque')}
        >
          ← Voltar ao Estoque
        </button>
      </div>

      <div className="movimentacoes-controls">
        <input
          type="text"
          placeholder="Buscar por produto, lote ou responsável..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="type-select"
        >
          <option value="todos">Todos os Tipos</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
          <option value="ajuste">Ajustes</option>
        </select>
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-select"
        >
          <option value="todos">Todo o Período</option>
          <option value="hoje">Hoje</option>
          <option value="semana">Última Semana</option>
          <option value="mes">Último Mês</option>
        </select>
      </div>

      <div className="movimentacoes-timeline">
        {filteredMovimentacoes.map(mov => {
          const tipoInfo = getTipoInfo(mov.tipo);
          const isPositive = mov.tipo === 'entrada' || (mov.tipo === 'ajuste' && mov.quantidade > 0);
          
          return (
            <div key={mov.id} className={`movimentacao-card ${tipoInfo.class}`}>
              <div className="movimentacao-icon">
                <span>{tipoInfo.icon}</span>
              </div>
              <div className="movimentacao-content">
                <div className="movimentacao-header-card">
                  <div className="movimentacao-title">
                    <h3>{mov.produto}</h3>
                    <span className={`tipo-badge ${tipoInfo.class}`}>
                      {tipoInfo.label}
                    </span>
                  </div>
                  <div className={`movimentacao-quantidade ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{mov.quantidade} un
                  </div>
                </div>
                <div className="movimentacao-details">
                  <div className="detail-item">
                    <span className="detail-label">Motivo:</span>
                    <span className="detail-value">{mov.motivo}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Lote:</span>
                    <span className="detail-value">{mov.lote}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Responsável:</span>
                    <span className="detail-value">{mov.responsavel}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Data:</span>
                    <span className="detail-value">{formatDateTime(mov.data)}</span>
                  </div>
                  {mov.observacao && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Observação:</span>
                      <span className="detail-value">{mov.observacao}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredMovimentacoes.length === 0 && (
          <div className="no-results">
            <p>Nenhuma movimentação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstoqueMovimentacoes;
