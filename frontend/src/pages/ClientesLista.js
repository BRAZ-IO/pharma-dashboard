import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientesLista.css';

const ClientesLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const [clientes] = useState([
    { 
      id: 1, 
      nome: 'Ana Silva', 
      cpf: '123.456.789-00', 
      telefone: '(11) 98765-4321', 
      email: 'ana.silva@email.com', 
      status: 'ativo', 
      endereco: 'Rua das Flores, 123 - São Paulo/SP',
      avatar: '👩',
      createdAt: '2025-06-15',
      lastPurchase: '2026-01-07T14:30:00'
    },
    { 
      id: 2, 
      nome: 'Carlos Oliveira', 
      cpf: '987.654.321-00', 
      telefone: '(21) 91234-5678', 
      email: 'carlos.oliveira@email.com', 
      status: 'ativo', 
      endereco: 'Av. Central, 456 - Rio de Janeiro/RJ',
      avatar: '👨',
      createdAt: '2025-07-20',
      lastPurchase: '2026-01-06T10:15:00'
    },
    { 
      id: 3, 
      nome: 'Mariana Costa', 
      cpf: '555.666.777-88', 
      telefone: '(31) 98876-5432', 
      email: 'mariana.costa@email.com', 
      status: 'inativo', 
      endereco: 'Alameda dos Clientes, 789 - Belo Horizonte/MG',
      avatar: '👩',
      createdAt: '2025-08-10',
      lastPurchase: '2025-12-20T16:20:00'
    },
    { 
      id: 4, 
      nome: 'Roberto Santos', 
      cpf: '111.222.333-44', 
      telefone: '(19) 95555-7777', 
      email: 'roberto.santos@email.com', 
      status: 'ativo', 
      endereco: 'Rua Verde, 200 - Campinas/SP',
      avatar: '👨',
      createdAt: '2025-09-05',
      lastPurchase: '2026-01-07T09:45:00'
    },
    { 
      id: 5, 
      nome: 'Juliana Ferreira', 
      cpf: '888.999.777-66', 
      telefone: '(16) 93333-4444', 
      email: 'juliana.ferreira@email.com', 
      status: 'ativo', 
      endereco: 'Avenida Principal, 500 - Ribeirão Preto/SP',
      avatar: '👩',
      createdAt: '2025-10-12',
      lastPurchase: '2026-01-05T11:30:00'
    }
  ]);

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || cliente.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'ativo').length,
    inativos: clientes.filter(c => c.status === 'inativo').length,
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

  const handleToggleStatus = (cliente) => {
    const newStatus = cliente.status === 'ativo' ? 'inativo' : 'ativo';
    console.log(`Alterando status de ${cliente.nome} para ${newStatus}`);
    alert(`Status alterado! (Funcionalidade em desenvolvimento)`);
  };

  const handleDeleteCliente = (cliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)) {
      console.log(`Excluindo cliente ${cliente.nome}`);
      alert(`Cliente excluído! (Funcionalidade em desenvolvimento)`);
    }
  };

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <div className="clientes-nav">
          <button 
            className="btn-novo-cliente"
            onClick={() => navigate('/app/clientes/cadastro')}
          >
            + Novo Cliente
          </button>
        </div>
      </div>

      <div className="clientes-lista">
        <div className="clientes-lista-header">
          <div className="clientes-stats">
            <div className="stat-card">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total de Clientes</span>
            </div>
            <div className="stat-card success">
              <span className="stat-value">{stats.ativos}</span>
              <span className="stat-label">Clientes Ativos</span>
            </div>
            <div className="stat-card warning">
              <span className="stat-value">{stats.inativos}</span>
              <span className="stat-label">Clientes Inativos</span>
            </div>
          </div>
        </div>

        <div className="clientes-controls">
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
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

        <div className="clientes-grid">
          {filteredClientes.map(cliente => (
            <div key={cliente.id} className="cliente-card">
              <div className="cliente-header">
                <div className="cliente-avatar">{cliente.avatar}</div>
                <div className="cliente-info">
                  <h3>{cliente.nome}</h3>
                  <p className="cliente-cpf">{cliente.cpf}</p>
                </div>
                <span className={`status-badge ${cliente.status}`}>
                  {cliente.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
                </span>
              </div>

              <div className="cliente-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{cliente.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Telefone:</span>
                  <span className="detail-value">{cliente.telefone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Endereço:</span>
                  <span className="detail-value">{cliente.endereco}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Última compra:</span>
                  <span className="detail-value">{formatDateTime(cliente.lastPurchase)}</span>
                </div>
              </div>

              <div className="cliente-actions">
                <button 
                  className="btn-action btn-view"
                  onClick={() => navigate(`/app/clientes/${cliente.id}`)}
                  title="Ver detalhes"
                >
                  👁️ Ver
                </button>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/app/clientes/cadastro/${cliente.id}`)}
                  title="Editar"
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-action btn-toggle"
                  onClick={() => handleToggleStatus(cliente)}
                  title={cliente.status === 'ativo' ? 'Desativar' : 'Ativar'}
                >
                  {cliente.status === 'ativo' ? '🔒' : '🔓'}
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => handleDeleteCliente(cliente)}
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {filteredClientes.length === 0 && (
            <div className="no-results">
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientesLista;
