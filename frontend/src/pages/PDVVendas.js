import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PDVVendas.css';

const PDVVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const navigate = useNavigate();

  useEffect(() => {
    // Simular carregamento de vendas
    setTimeout(() => {
      setVendas([
        {
          id: 'VND-1640589123456',
          cliente: 'João Silva',
          cpf: '123.456.789-00',
          produtos: [
            { nome: 'Paracetamol 750mg', quantidade: 2, preco: 12.50, codigo: 'PAR750' },
            { nome: 'Dipirona 500mg', quantidade: 1, preco: 8.90, codigo: 'DIP500' }
          ],
          total: 33.90,
          formaPagamento: 'Dinheiro',
          status: 'concluido',
          data: '2024-01-07 14:30:00',
          vendedor: 'Maria Santos',
          cupomFiscal: 'CUP-2024-0001',
          desconto: 0,
          impostos: 4.18
        },
        {
          id: 'VND-1640589123457',
          cliente: 'Maria Santos',
          cpf: '987.654.321-00',
          produtos: [
            { nome: 'Amoxicilina 500mg', quantidade: 1, preco: 15.80, codigo: 'AMO500' },
            { nome: 'Ibuprofeno 400mg', quantidade: 3, preco: 18.50, codigo: 'IBU400' }
          ],
          total: 71.30,
          formaPagamento: 'Cartão',
          status: 'concluido',
          data: '2024-01-07 14:15:00',
          vendedor: 'João Silva',
          cupomFiscal: 'CUP-2024-0002',
          desconto: 5.00,
          impostos: 8.76
        },
        {
          id: 'VND-1640589123458',
          cliente: 'Carlos Oliveira',
          cpf: '456.789.123-00',
          produtos: [
            { nome: 'Vitamina D3', quantidade: 2, preco: 35.90, codigo: 'VITD3' }
          ],
          total: 71.80,
          formaPagamento: 'PIX',
          status: 'pendente',
          data: '2024-01-07 14:00:00',
          vendedor: 'Ana Costa',
          cupomFiscal: 'CUP-2024-0003',
          desconto: 0,
          impostos: 8.62
        },
        {
          id: 'VND-1640589123459',
          cliente: 'Ana Costa',
          cpf: '789.123.456-00',
          produtos: [
            { nome: 'Omeprazol 20mg', quantidade: 1, preco: 22.30, codigo: 'OME20' },
            { nome: 'Loratadina 10mg', quantidade: 2, preco: 25.80, codigo: 'LOR10' }
          ],
          total: 73.90,
          formaPagamento: 'Débito',
          status: 'cancelado',
          data: '2024-01-07 13:45:00',
          vendedor: 'Pedro Lima',
          cupomFiscal: 'CUP-2024-0004',
          desconto: 10.00,
          impostos: 8.98,
          motivoCancelamento: 'Cliente desistiu'
        },
        {
          id: 'VND-1640589123460',
          cliente: 'Pedro Lima',
          cpf: '321.654.987-00',
          produtos: [
            { nome: 'Ácido Fólico 5mg', quantidade: 1, preco: 28.90, codigo: 'ACID5' }
          ],
          total: 28.90,
          formaPagamento: 'Dinheiro',
          status: 'concluido',
          data: '2024-01-07 13:30:00',
          vendedor: 'Carlos Oliveira',
          cupomFiscal: 'CUP-2024-0005',
          desconto: 0,
          impostos: 3.47
        },
        {
          id: 'VND-1640589123461',
          cliente: 'Fernanda Souza',
          cpf: '654.321.789-00',
          produtos: [
            { nome: 'Cefalexina 500mg', quantidade: 1, preco: 32.50, codigo: 'CEF500' },
            { nome: 'Clonazepam 2mg', quantidade: 2, preco: 45.80, codigo: 'CLO2' }
          ],
          total: 124.10,
          formaPagamento: 'Cartão',
          status: 'concluido',
          data: '2024-01-07 13:15:00',
          vendedor: 'Maria Santos',
          cupomFiscal: 'CUP-2024-0006',
          desconto: 15.00,
          impostos: 15.12
        },
        {
          id: 'VND-1640589123462',
          cliente: 'Ricardo Pereira',
          cpf: '147.258.369-00',
          produtos: [
            { nome: 'Losartana 50mg', quantidade: 2, preco: 28.90, codigo: 'LOS50' },
            { nome: 'Atorvastatina 20mg', quantidade: 1, preco: 42.30, codigo: 'ATOR20' }
          ],
          total: 100.10,
          formaPagamento: 'PIX',
          status: 'concluido',
          data: '2024-01-07 13:00:00',
          vendedor: 'João Silva',
          cupomFiscal: 'CUP-2024-0007',
          desconto: 0,
          impostos: 12.21
        },
        {
          id: 'VND-1640589123463',
          cliente: 'Juliana Mendes',
          cpf: '852.963.741-00',
          produtos: [
            { nome: 'Metformina 850mg', quantidade: 3, preco: 18.70, codigo: 'MET850' }
          ],
          total: 56.10,
          formaPagamento: 'Dinheiro',
          status: 'concluido',
          data: '2024-01-07 12:45:00',
          vendedor: 'Ana Costa',
          cupomFiscal: 'CUP-2024-0008',
          desconto: 0,
          impostos: 6.84
        },
        {
          id: 'VND-1640589123464',
          cliente: 'Marcos Almeida',
          cpf: '369.741.852-00',
          produtos: [
            { nome: 'Sertralina 50mg', quantidade: 1, preco: 38.90, codigo: 'SER50' },
            { nome: 'Risperidona 2mg', quantidade: 1, preco: 52.30, codigo: 'RIS2' }
          ],
          total: 91.20,
          formaPagamento: 'Cartão',
          status: 'pendente',
          data: '2024-01-07 12:30:00',
          vendedor: 'Pedro Lima',
          cupomFiscal: 'CUP-2024-0009',
          desconto: 8.00,
          impostos: 11.14
        },
        {
          id: 'VND-1640589123465',
          cliente: 'Patricia Costa',
          cpf: '741.852.369-00',
          produtos: [
            { nome: 'Insulina NPH', quantidade: 1, preco: 89.50, codigo: 'INSNPH' }
          ],
          total: 89.50,
          formaPagamento: 'Débito',
          status: 'concluido',
          data: '2024-01-07 12:15:00',
          vendedor: 'Carlos Oliveira',
          cupomFiscal: 'CUP-2024-0010',
          desconto: 0,
          impostos: 10.92
        },
        {
          id: 'VND-1640589123466',
          cliente: 'Luiz Fernando',
          cpf: '258.369.741-00',
          produtos: [
            { nome: 'Diclofenaco 50mg', quantidade: 2, preco: 22.80, codigo: 'DIC50' },
            { nome: 'Pregabalina 75mg', quantidade: 1, preco: 67.90, codigo: 'PREG75' }
          ],
          total: 113.50,
          formaPagamento: 'Dinheiro',
          status: 'concluido',
          data: '2024-01-07 12:00:00',
          vendedor: 'Maria Santos',
          cupomFiscal: 'CUP-2024-0011',
          desconto: 12.00,
          impostos: 13.86
        },
        {
          id: 'VND-1640589123467',
          cliente: 'Camila Rocha',
          cpf: '963.741.852-00',
          produtos: [
            { nome: 'Fluoxetina 20mg', quantidade: 1, preco: 45.60, codigo: 'FLU20' }
          ],
          total: 45.60,
          formaPagamento: 'PIX',
          status: 'cancelado',
          data: '2024-01-07 11:45:00',
          vendedor: 'João Silva',
          cupomFiscal: 'CUP-2024-0012',
          desconto: 0,
          impostos: 5.57,
          motivoCancelamento: 'Problema no pagamento'
        },
        {
          id: 'VND-1640589123468',
          cliente: 'Bruno Santos',
          cpf: '147.852.963-00',
          produtos: [
            { nome: 'Alprazolam 1mg', quantidade: 1, preco: 35.40, codigo: 'ALP1' },
            { nome: 'Clonazepam 2mg', quantidade: 1, preco: 45.80, codigo: 'CLO2' }
          ],
          total: 81.20,
          formaPagamento: 'Cartão',
          status: 'concluido',
          data: '2024-01-07 11:30:00',
          vendedor: 'Ana Costa',
          cupomFiscal: 'CUP-2024-0013',
          desconto: 5.00,
          impostos: 9.92
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
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cupomFiscal.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleViewDetails = (venda) => {
    setSelectedVenda(venda);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    // Simular exportação
    const csvContent = [
      ['ID', 'Cliente', 'CPF', 'Total', 'Forma Pagamento', 'Status', 'Data', 'Vendedor', 'Cupom Fiscal'],
      ...filteredVendas.map(venda => [
        venda.id,
        venda.cliente,
        venda.cpf,
        venda.total.toFixed(2),
        venda.formaPagamento,
        venda.status,
        new Date(venda.data).toLocaleString('pt-BR'),
        venda.vendedor,
        venda.cupomFiscal
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
