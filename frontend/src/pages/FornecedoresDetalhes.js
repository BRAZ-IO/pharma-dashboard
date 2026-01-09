import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const FornecedoresDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fornecedor, setFornecedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    carregarFornecedor();
  }, [id]);

  const carregarFornecedor = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/fornecedores/${id}`);
      setFornecedor(response.data);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar fornecedor:', error);
      if (error.response?.status === 404) {
        setError('Fornecedor não encontrado');
      } else if (error.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else {
        setError('Não foi possível carregar os dados do fornecedor');
      }
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
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleEdit = () => {
    navigate(`/app/fornecedores/cadastro/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor ${fornecedor?.nome}?`)) {
      alert('Funcionalidade em desenvolvimento');
    }
  };

  const handleToggleStatus = () => {
    const newStatus = fornecedor.ativo ? 'inativo' : 'ativo';
    // Implementar mudança de status via API
    setFornecedor(prev => ({ ...prev, ativo: newStatus }));
    alert(`Status alterado para ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="fornecedor-detalhes">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!fornecedor) {
    return (
      <div className="fornecedor-detalhes">
        <div className="error-container">
          <p>Fornecedor não encontrado</p>
          <button onClick={() => navigate('/app/fornecedores')} className="btn-primary">
            Voltar para Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fornecedor-detalhes">
      <div className="fornecedor-detalhes-header">
        <div className="header-left">
          <button onClick={() => navigate('/app/fornecedores')} className="btn-back">
            ← Voltar
          </button>
          <div className="fornecedor-title">
            <div className="fornecedor-avatar">{fornecedor.nome?.charAt(0) || 'F'}</div>
            <div>
              <h1>{fornecedor.nome || 'Nome não informado'}</h1>
              <p className="fornecedor-cnpj">{fornecedor.cnpj || 'CNPJ não informado'}</p>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <span className={`status-badge ${fornecedor.ativo ? 'ativo' : 'inativo'}`}>
            {fornecedor.ativo ? '✓ Ativo' : '✗ Inativo'}
          </span>
          <button onClick={handleEdit} className="btn-primary">
            ✏️ Editar
          </button>
          <button onClick={handleToggleStatus} className="btn-secondary">
            {fornecedor.ativo ? '🔒 Desativar' : '🔓 Ativar'}
          </button>
          <button onClick={handleDelete} className="btn-danger">
            🗑️ Excluir
          </button>
        </div>
      </div>

      <div className="fornecedor-tabs">
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          📋 Informações
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Estatísticas
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Pedidos
        </button>
        <button
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📝 Observações
        </button>
      </div>

      <div className="fornecedor-content">
        {/* Tab Informações */}
        {activeTab === 'info' && (
          <div className="tab-content">
            <div className="info-grid">
              <div className="info-section">
                <h3>Informações Básicas</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Razão Social:</span>
                    <span className="info-value">{fornecedor.nome}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">CNPJ:</span>
                    <span className="info-value">{fornecedor.cnpj}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`info-value status-${fornecedor.status}`}>
                      {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Website:</span>
                    <span className="info-value">
                      <a href={`https://${fornecedor.website}`} target="_blank" rel="noopener noreferrer">
                        {fornecedor.website}
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Contato</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Contato:</span>
                    <span className="info-value">{fornecedor.contato}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">
                      <a href={`mailto:${fornecedor.email}`}>{fornecedor.email}</a>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Telefone:</span>
                    <span className="info-value">{fornecedor.telefone}</span>
                  </div>
                  {fornecedor.celular && (
                    <div className="info-item">
                      <span className="info-label">Celular:</span>
                      <span className="info-value">{fornecedor.celular}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>Endereço</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Endereço:</span>
                    <span className="info-value">{fornecedor.endereco}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">CEP:</span>
                    <span className="info-value">{fornecedor.cep}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Condições Comerciais</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="info-label">Prazo de Pagamento:</span>
                    <span className="info-value">{fornecedor.prazo_pagamento || 'Não informado'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Prazo de Entrega:</span>
                    <span className="info-value">{fornecedor.prazo_entrega || 'Não informado'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Categorias:</span>
                    <span className="info-value">
                      {fornecedor.categorias ? fornecedor.categorias.join(', ') : 'Não informado'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Avaliação:</span>
                    <span className="info-value">
                      ⭐ {fornecedor.avaliacao || '0'} / 5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Estatísticas */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{fornecedor.total_pedidos || '0'}</h3>
                  <p>Total de Pedidos</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{formatCurrency(fornecedor.valor_total || 0)}</h3>
                  <p>Valor Total</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{formatCurrency(fornecedor.ticket_medio || 0)}</h3>
                  <p>Ticket Médio</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{formatDate(fornecedor.created_at)}</h3>
                  <p>Cliente desde</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-placeholder">
                <div className="placeholder-icon">📊</div>
                <h3>Estatísticas de Compras</h3>
                <p>Os gráficos de estatísticas serão exibidos quando houver dados de compras registrados.</p>
                <p>Comece a fazer pedidos com este fornecedor para visualizar as estatísticas aqui.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Pedidos */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <div className="orders-header">
              <h3>Histórico de Pedidos</h3>
              <p>Último pedido: {formatDateTime(fornecedor.lastOrder)}</p>
            </div>
            
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Nº Pedido</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#12345</td>
                    <td>{formatDateTime(fornecedor.lastOrder)}</td>
                    <td>{formatCurrency(2456.78)}</td>
                    <td><span className="status-badge delivered">Entregue</span></td>
                    <td>
                      <button className="btn-action">📋 Ver</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#12344</td>
                    <td>05/01/2026 10:30</td>
                    <td>{formatCurrency(1890.45)}</td>
                    <td><span className="status-badge delivered">Entregue</span></td>
                    <td>
                      <button className="btn-action">📋 Ver</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#12343</td>
                    <td>28/12/2025 14:15</td>
                    <td>{formatCurrency(3234.90)}</td>
                    <td><span className="status-badge processing">Processando</span></td>
                    <td>
                      <button className="btn-action">📋 Ver</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Observações */}
        {activeTab === 'notes' && (
          <div className="tab-content">
            <div className="notes-section">
              <h3>Observações Internas</h3>
              <div className="notes-content">
                <p>{fornecedor.observacoes || 'Nenhuma observação registrada.'}</p>
              </div>
              
              <div className="notes-add">
                <textarea 
                  placeholder="Adicionar nova observação..."
                  rows={4}
                ></textarea>
                <button className="btn-primary">Adicionar Observação</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FornecedoresDetalhes;
