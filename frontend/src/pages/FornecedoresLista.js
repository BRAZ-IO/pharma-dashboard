import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FornecedoresLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const [fornecedores] = useState([
    { 
      id: 1, 
      nome: 'Distribuidora Medicamentos Ltda', 
      cnpj: '12.345.678/0001-90', 
      contato: 'João Contato', 
      email: 'contato@distmed.com.br', 
      telefone: '(11) 3456-7890', 
      status: 'ativo', 
      endereco: 'Rua das Distribuidoras, 123 - São Paulo/SP',
      avatar: '🏢',
      createdAt: '2025-06-15',
      lastOrder: '2026-01-07T14:30:00'
    },
    { 
      id: 2, 
      nome: 'Laboratório Saúde S/A', 
      cnpj: '98.765.432/0001-10', 
      contato: 'Maria Atendente', 
      email: 'vendas@labsaude.com.br', 
      telefone: '(21) 2345-6789', 
      status: 'ativo', 
      endereco: 'Av. Central, 456 - Rio de Janeiro/RJ',
      avatar: '🏥',
      createdAt: '2025-07-20',
      lastOrder: '2026-01-06T10:15:00'
    },
    { 
      id: 3, 
      nome: 'FarmaSupply Indústria', 
      cnpj: '55.666.777/0001-33', 
      contato: 'Carlos Vendedor', 
      email: 'comercial@farmasupply.com', 
      telefone: '(31) 9876-5432', 
      status: 'inativo', 
      endereco: 'Alameda dos Fornecedores, 789 - Belo Horizonte/MG',
      avatar: '🏭',
      createdAt: '2025-08-10',
      lastOrder: '2025-12-20T16:20:00'
    },
    { 
      id: 4, 
      nome: 'PharmaExpress Distribuidora', 
      cnpj: '88.999.777/0001-44', 
      contato: 'Ana Representante', 
      email: 'ana@pharmaexpress.com.br', 
      telefone: '(19) 3456-2345', 
      status: 'ativo', 
      endereco: 'Rodovia Expressa, 1000 - Campinas/SP',
      avatar: '🚚',
      createdAt: '2025-09-05',
      lastOrder: '2026-01-07T09:45:00'
    },
    { 
      id: 5, 
      nome: 'MedLab Central', 
      cnpj: '33.444.555/0001-22', 
      contato: 'Roberto Gerente', 
      email: 'roberto@medlab.com', 
      telefone: '(16) 3333-4444', 
      status: 'ativo', 
      endereco: 'Avenida Laboratórios, 500 - Ribeirão Preto/SP',
      avatar: '🔬',
      createdAt: '2025-10-12',
      lastOrder: '2026-01-05T11:30:00'
    }
  ]);

  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.contato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || fornecedor.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: fornecedores.length,
    ativos: fornecedores.filter(f => f.status === 'ativo').length,
    inativos: fornecedores.filter(f => f.status === 'inativo').length,
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleToggleStatus = (fornecedor) => {
    const newStatus = fornecedor.status === 'ativo' ? 'inativo' : 'ativo';
    console.log(`Alterando status de ${fornecedor.nome} para ${newStatus}`);
    alert(`Status alterado! (Funcionalidade em desenvolvimento)`);
  };

  const handleDeleteFornecedor = (fornecedor) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor ${fornecedor.nome}?`)) {
      console.log(`Excluindo fornecedor ${fornecedor.nome}`);
      alert(`Fornecedor excluído! (Funcionalidade em desenvolvimento)`);
    }
  };

  return (
    <div className="fornecedores-lista">
      <div className="fornecedores-lista-header">
        <div className="fornecedores-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total de Fornecedores</span>
          </div>
          <div className="stat-card success">
            <span className="stat-value">{stats.ativos}</span>
            <span className="stat-label">Fornecedores Ativos</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">{stats.inativos}</span>
            <span className="stat-label">Fornecedores Inativos</span>
          </div>
        </div>

        <button 
          className="btn-novo-fornecedor"
          onClick={() => navigate('/app/fornecedores/cadastro')}
        >
          + Novo Fornecedor
        </button>
      </div>

      <div className="fornecedores-controls">
        <input
          type="text"
          placeholder="Buscar por nome, CNPJ ou contato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-select"
        >
          <option value="todos">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      <div className="fornecedores-grid">
        {filteredFornecedores.map(fornecedor => (
          <div key={fornecedor.id} className="fornecedor-card">
            <div className="fornecedor-header">
              <div className="fornecedor-avatar">{fornecedor.avatar}</div>
              <div className="fornecedor-info">
                <h3>{fornecedor.nome}</h3>
                <p className="fornecedor-cnpj">{fornecedor.cnpj}</p>
              </div>
              <span className={`status-badge ${fornecedor.status}`}>
                {fornecedor.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
              </span>
            </div>

            <div className="fornecedor-details">
              <div className="detail-row">
                <span className="detail-label">Contato:</span>
                <span className="detail-value">{fornecedor.contato}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{fornecedor.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Telefone:</span>
                <span className="detail-value">{fornecedor.telefone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Último pedido:</span>
                <span className="detail-value">{formatDateTime(fornecedor.lastOrder)}</span>
              </div>
            </div>

            <div className="fornecedor-actions">
              <button 
                className="btn-action btn-view"
                onClick={() => navigate(`/app/fornecedores/${fornecedor.id}`)}
                title="Ver detalhes"
              >
                👁️ Ver
              </button>
              <button 
                className="btn-action btn-edit"
                onClick={() => navigate(`/app/fornecedores/cadastro/${fornecedor.id}`)}
                title="Editar"
              >
                ✏️ Editar
              </button>
              <button 
                className="btn-action btn-toggle"
                onClick={() => handleToggleStatus(fornecedor)}
                title={fornecedor.status === 'ativo' ? 'Desativar' : 'Ativar'}
              >
                {fornecedor.status === 'ativo' ? '🔒' : '🔓'}
              </button>
              <button 
                className="btn-action btn-delete"
                onClick={() => handleDeleteFornecedor(fornecedor)}
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {filteredFornecedores.length === 0 && (
          <div className="no-results">
            <p>Nenhum fornecedor encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FornecedoresLista;
