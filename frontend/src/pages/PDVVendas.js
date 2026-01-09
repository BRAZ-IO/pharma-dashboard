import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PDVVendas.css';

const PDVVendas = () => {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('data');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar vendas do backend
      const response = await api.get('/vendas');
      setVendas(response.data.vendas || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setError('Não foi possível carregar as vendas');
      setVendas([]);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return '#26de81';
      case 'pendente': return '#ffa502';
      case 'cancelado': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido': return '✅';
      case 'pendente': return '⏳';
      case 'cancelado': return '❌';
      default: return '📋';
    }
  };

  const getPaymentIcon = (formaPagamento) => {
    switch (formaPagamento) {
      case 'Dinheiro': return '💵';
      case 'Cartão': return '💳';
      case 'PIX': return '📱';
      case 'Débito': return '💰';
      default: return '💳';
    }
  };

  const filteredVendas = vendas.filter(venda => {
    const matchesStatus = filtroStatus === 'todos' || venda.status === filtroStatus;
    const matchesDataInicio = !dataInicio || new Date(venda.data) >= new Date(dataInicio);
    const matchesDataFim = !dataFim || new Date(venda.data) <= new Date(dataFim);
    const matchesSearch = !searchTerm || 
      venda.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cupomFiscal?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesDataInicio && matchesDataFim && matchesSearch;
  });

  const sortedVendas = [...filteredVendas].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'data':
        comparison = new Date(a.data) - new Date(b.data);
        break;
      case 'total':
        comparison = a.total - b.total;
        break;
      case 'cliente':
        comparison = a.cliente.localeCompare(b.cliente);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const paginatedVendas = sortedVendas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedVendas.length / itemsPerPage);

  const totalVendas = filteredVendas.reduce((sum, venda) => sum + venda.total, 0);
  const totalConcluidas = filteredVendas.filter(v => v.status === 'concluido').length;
  const totalPendentes = filteredVendas.filter(v => v.status === 'pendente').length;
  const totalCanceladas = filteredVendas.filter(v => v.status === 'cancelado').length;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      setSortBy(field);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExportCSV = () => {
    const header = ['ID', 'Cliente', 'CPF', 'Produtos', 'Total', 'Forma Pagamento', 'Status', 'Data', 'Vendedor', 'Cupom Fiscal'].join(',');
    const rows = filteredVendas.map(venda => [
      venda.id,
      venda.cliente,
      venda.cpf,
      venda.produtos.map(p => `${p.quantidade}x ${p.nome} (${p.codigo})`).join('; '),
      venda.total.toFixed(2),
      venda.formaPagamento,
      venda.status,
      new Date(venda.data).toLocaleString('pt-BR'),
      venda.vendedor,
      venda.cupomFiscal
    ].join(','));
    
    const csvContent = header + '\n' + rows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando vendas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={carregarVendas} className="btn-retry">
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="pdv-vendas-page">
      <div className="pdv-vendas-header">
        <div className="header-content">
          <button 
            className="btn-back"
            onClick={() => navigate('/app/pdv')}
          >
            ← Voltar
          </button>
          <div className="header-title">
            <h1>Histórico de Vendas</h1>
            <p>Total de vendas: {filteredVendas.length}</p>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn-export"
            onClick={handleExportCSV}
            disabled={vendas.length === 0}
          >
            📊 Exportar CSV
          </button>
        </div>
      </div>

      <div className="pdv-vendas-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{formatCurrency(totalVendas)}</h3>
            <p>Total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{totalConcluidas}</h3>
            <p>Concluídas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{totalPendentes}</h3>
            <p>Pendentes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{totalCanceladas}</h3>
            <p>Canceladas</p>
          </div>
        </div>
      </div>

      <div className="pdv-vendas-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="concluido">Concluídas</option>
            <option value="pendente">Pendentes</option>
            <option value="cancelado">Canceladas</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Data Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Data Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Buscar por cliente, ID ou cupom fiscal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="filter-select"
          >
            <option value="data">Data</option>
            <option value="total">Total</option>
            <option value="cliente">Cliente</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="pdv-vendas-table-container">
        <table className="vendas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Produtos</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Data</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendas.map(venda => (
              <tr key={venda.id}>
                <td className="venda-id">{venda.id}</td>
                <td className="venda-cliente">{venda.cliente || 'Não informado'}</td>
                <td className="venda-produtos">
                  <div className="produtos-list">
                    {venda.produtos?.map((produto, index) => (
                      <div key={index} className="produto-item">
                        <span>{produto.quantidade}x {produto.nome}</span>
                        <span>{formatCurrency(produto.preco)}</span>
                      </div>
                    )) || <span className="sem-produtos">Sem produtos</span>}
                  </div>
                </td>
                <td className="venda-total">{formatCurrency(venda.total)}</td>
                <td className="venda-pagamento">
                  <span>{getPaymentIcon(venda.formaPagamento)} {venda.formaPagamento}</span>
                </td>
                <td className="venda-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(venda.status) }}
                  >
                    {getStatusIcon(venda.status)} {venda.status}
                  </span>
                </td>
                <td className="venda-data">{new Date(venda.data).toLocaleString('pt-BR')}</td>
                <td className="venda-vendedor">{venda.vendedor || 'Não informado'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn-pagination"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          <button 
            className="btn-pagination"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo →
          </button>
        </div>
      )}

      {filteredVendas.length === 0 && !loading && !error && (
        <div className="no-results">
          <div className="no-results-icon">📋</div>
          <h3>Nenhuma venda encontrada</h3>
          <p>
            {searchTerm || filtroStatus !== 'todos' || dataInicio || dataFim
              ? 'Tente ajustar os filtros de busca.'
              : 'Nenhuma venda registrada no sistema.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDVVendas;
