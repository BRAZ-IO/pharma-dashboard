import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PDVVendas.css';

const PDVVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simular carregamento de vendas
    setTimeout(() => {
      setVendas([
        {
          id: 'VND-1640589123456',
          cliente: 'João Silva',
          produtos: [
            { nome: 'Paracetamol 750mg', quantidade: 2, preco: 12.50 },
            { nome: 'Dipirona 500mg', quantidade: 1, preco: 8.90 }
          ],
          total: 33.90,
          formaPagamento: 'Dinheiro',
          status: 'concluido',
          data: '2024-01-07 14:30:00',
          vendedor: 'Maria Santos'
        },
        {
          id: 'VND-1640589123457',
          cliente: 'Maria Santos',
          produtos: [
            { nome: 'Amoxicilina 500mg', quantidade: 1, preco: 15.80 },
            { nome: 'Ibuprofeno 400mg', quantidade: 3, preco: 18.50 }
          ],
          total: 71.30,
          formaPagamento: 'Cartão',
          status: 'concluido',
          data: '2024-01-07 14:15:00',
          vendedor: 'João Silva'
        },
        {
          id: 'VND-1640589123458',
          cliente: 'Carlos Oliveira',
          produtos: [
            { nome: 'Vitamina D3', quantidade: 2, preco: 35.90 }
          ],
          total: 71.80,
          formaPagamento: 'PIX',
          status: 'pendente',
          data: '2024-01-07 14:00:00',
          vendedor: 'Ana Costa'
        },
        {
          id: 'VND-1640589123459',
          cliente: 'Ana Costa',
          produtos: [
            { nome: 'Omeprazol 20mg', quantidade: 1, preco: 22.30 },
            { nome: 'Loratadina 10mg', quantidade: 2, preco: 25.80 }
          ],
          total: 73.90,
          formaPagamento: 'Débito',
          status: 'cancelado',
          data: '2024-01-07 13:45:00',
          vendedor: 'Pedro Lima'
        },
        {
          id: 'VND-1640589123460',
          cliente: 'Pedro Lima',
          produtos: [
            { nome: 'Ácido Fólico 5mg', quantidade: 1, preco: 28.90 }
          ],
          total: 28.90,
          formaPagamento: 'Dinheiro',
          status: 'concluido',
          data: '2024-01-07 13:30:00',
          vendedor: 'Carlos Oliveira'
        }
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

  const filteredVendas = vendas.filter(venda => {
    const matchesStatus = filtroStatus === 'todos' || venda.status === filtroStatus;
    const matchesDataInicio = !dataInicio || new Date(venda.data) >= new Date(dataInicio);
    const matchesDataFim = !dataFim || new Date(venda.data) <= new Date(dataFim);
    return matchesStatus && matchesDataInicio && matchesDataFim;
  });

  const totalVendas = filteredVendas.reduce((sum, venda) => sum + venda.total, 0);
  const totalConcluidas = filteredVendas.filter(v => v.status === 'concluido').length;
  const totalPendentes = filteredVendas.filter(v => v.status === 'pendente').length;
  const totalCanceladas = filteredVendas.filter(v => v.status === 'cancelado').length;

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
            <h1>Vendas</h1>
            <p>Histórico de transações</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
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
        <button className="btn-export">
          📊 Exportar
        </button>
      </div>

      <div className="pdv-vendas-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando vendas...</p>
          </div>
        ) : (
          <div className="vendas-table">
            <table>
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
                {filteredVendas.map(venda => (
                  <tr key={venda.id}>
                    <td className="venda-id">{venda.id}</td>
                    <td className="venda-cliente">{venda.cliente}</td>
                    <td className="venda-produtos">
                      <div className="produtos-list">
                        {venda.produtos.map((produto, index) => (
                          <div key={index} className="produto-item">
                            <span>{produto.quantidade}x {produto.nome}</span>
                            <span>{formatCurrency(produto.preco)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="venda-total">{formatCurrency(venda.total)}</td>
                    <td className="venda-pagamento">{venda.formaPagamento}</td>
                    <td className="venda-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(venda.status) }}
                      >
                        {getStatusIcon(venda.status)} {venda.status}
                      </span>
                    </td>
                    <td className="venda-data">{new Date(venda.data).toLocaleString('pt-BR')}</td>
                    <td className="venda-vendedor">{venda.vendedor}</td>
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

export default PDVVendas;
