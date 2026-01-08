import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Transferencias.css';

const Transferencias = () => {
  const navigate = useNavigate();
  const [transferencias, setTransferencias] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    filial_origem_id: 'todos',
    filial_destino_id: 'todos',
    data_inicio: '',
    data_fim: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [novaTransferencia, setNovaTransferencia] = useState({
    filial_origem_id: '',
    filial_destino_id: '',
    produto_id: '',
    quantidade: '',
    lote: '',
    motivo_transferencia: ''
  });

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar transferências
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== 'todos') {
          params.append(key, value);
        }
      });

      const responseTransferencias = await fetch(`/api/transferencias?${params}`);
      const dataTransferencias = await responseTransferencias.json();
      
      // Carregar filiais
      const responseFiliais = await fetch('/api/filiais');
      const dataFiliais = await responseFiliais.json();
      
      setTransferencias(dataTransferencias.transferencias || []);
      setFiliais(dataFiliais.filiais || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      solicitada: { label: 'Solicitada', color: '#ff9800', icon: '⏳' },
      aprovada: { label: 'Aprovada', color: '#2196f3', icon: '✅' },
      rejeitada: { label: 'Rejeitada', color: '#f44336', icon: '❌' },
      em_transito: { label: 'Em Trânsito', color: '#9c27b0', icon: '🚚' },
      concluida: { label: 'Concluída', color: '#4caf50', icon: '🎉' },
      cancelada: { label: 'Cancelada', color: '#757575', icon: '🚫' }
    };
    return statusMap[status] || { label: status, color: '#757575', icon: '❓' };
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleString('pt-BR');
  };

  const handleAprovar = async (id) => {
    try {
      const response = await fetch(`/api/transferencias/${id}/aprovar`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        carregarDados();
        alert('Transferência aprovada com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao aprovar transferência');
      }
    } catch (error) {
      console.error('Erro ao aprovar transferência:', error);
      alert('Erro ao aprovar transferência');
    }
  };

  const handleIniciarTransporte = async (id) => {
    try {
      const response = await fetch(`/api/transferencias/${id}/iniciar-transporte`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        carregarDados();
        alert('Transporte iniciado com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao iniciar transporte');
      }
    } catch (error) {
      console.error('Erro ao iniciar transporte:', error);
      alert('Erro ao iniciar transporte');
    }
  };

  const handleConfirmarRecebimento = async (id) => {
    const quantidade = prompt('Quantidade recebida:');
    if (!quantidade) return;

    try {
      const response = await fetch(`/api/transferencias/${id}/confirmar-recebimento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantidade_recebida: parseInt(quantidade) })
      });
      
      if (response.ok) {
        carregarDados();
        alert('Recebimento confirmado com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao confirmar recebimento');
      }
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      alert('Erro ao confirmar recebimento');
    }
  };

  const handleCriarTransferencia = async () => {
    try {
      const response = await fetch('/api/transferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaTransferencia)
      });
      
      if (response.ok) {
        setShowModal(false);
        setNovaTransferencia({
          filial_origem_id: '',
          filial_destino_id: '',
          produto_id: '',
          quantidade: '',
          lote: '',
          motivo_transferencia: ''
        });
        carregarDados();
        alert('Transferência criada com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar transferência');
      }
    } catch (error) {
      console.error('Erro ao criar transferência:', error);
      alert('Erro ao criar transferência');
    }
  };

  const handleCancelar = async (id) => {
    const motivo = prompt('Motivo do cancelamento:');
    if (!motivo) return;

    try {
      const response = await fetch(`/api/transferencias/${id}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo_cancelamento: motivo })
      });
      
      if (response.ok) {
        carregarDados();
        alert('Transferência cancelada com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao cancelar transferência');
      }
    } catch (error) {
      console.error('Erro ao cancelar transferência:', error);
      alert('Erro ao cancelar transferência');
    }
  };

  const stats = {
    total: transferencias.length,
    solicitadas: transferencias.filter(t => t.status === 'solicitada').length,
    em_transito: transferencias.filter(t => t.status === 'em_transito').length,
    concluidas: transferencias.filter(t => t.status === 'concluida').length
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="transferencias-page">
      <div className="transferencias-header">
        <h1>Transferências entre Filiais</h1>
        <button 
          className="btn-nova-transferencia"
          onClick={() => setShowModal(true)}
        >
          + Nova Transferência
        </button>
      </div>

      <div className="transferencias-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-value">{stats.solicitadas}</span>
          <span className="stat-label">Solicitadas</span>
        </div>
        <div className="stat-card info">
          <span className="stat-value">{stats.em_transito}</span>
          <span className="stat-label">Em Trânsito</span>
        </div>
        <div className="stat-card success">
          <span className="stat-value">{stats.concluidas}</span>
          <span className="stat-label">Concluídas</span>
        </div>
      </div>

      <div className="transferencias-controls">
        <select
          value={filtros.status}
          onChange={(e) => setFiltros({...filtros, status: e.target.value})}
          className="filter-select"
        >
          <option value="todos">Todos os Status</option>
          <option value="solicitada">Solicitadas</option>
          <option value="aprovada">Aprovadas</option>
          <option value="em_transito">Em Trânsito</option>
          <option value="concluida">Concluídas</option>
          <option value="cancelada">Canceladas</option>
        </select>

        <select
          value={filtros.filial_origem_id}
          onChange={(e) => setFiltros({...filtros, filial_origem_id: e.target.value})}
          className="filter-select"
        >
          <option value="todos">Todas as Origens</option>
          {filiais.map(filial => (
            <option key={filial.id} value={filial.id}>
              {filial.nome_fantasia}
            </option>
          ))}
        </select>

        <select
          value={filtros.filial_destino_id}
          onChange={(e) => setFiltros({...filtros, filial_destino_id: e.target.value})}
          className="filter-select"
        >
          <option value="todos">Todos os Destinos</option>
          {filiais.map(filial => (
            <option key={filial.id} value={filial.id}>
              {filial.nome_fantasia}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filtros.data_inicio}
          onChange={(e) => setFiltros({...filtros, data_inicio: e.target.value})}
          className="date-input"
          placeholder="Data Início"
        />

        <input
          type="date"
          value={filtros.data_fim}
          onChange={(e) => setFiltros({...filtros, data_fim: e.target.value})}
          className="date-input"
          placeholder="Data Fim"
        />
      </div>

      <div className="transferencias-grid">
        {transferencias.map(transferencia => {
          const statusInfo = getStatusInfo(transferencia.status);
          
          return (
            <div key={transferencia.id} className="transferencia-card">
              <div className="transferencia-header">
                <div className="transferencia-status">
                  <span className="status-icon">{statusInfo.icon}</span>
                  <span 
                    className="status-label"
                    style={{ color: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <span className="transferencia-data">
                  {formatarData(transferencia.data_solicitacao)}
                </span>
              </div>

              <div className="transferencia-rota">
                <div className="rota-item origem">
                  <span className="rota-label">Origem:</span>
                  <span className="rota-nome">
                    {transferencia.filialOrigem?.nome_fantasia}
                  </span>
                </div>
                <div className="rota-seta">→</div>
                <div className="rota-item destino">
                  <span className="rota-label">Destino:</span>
                  <span className="rota-nome">
                    {transferencia.filialDestino?.nome_fantasia}
                  </span>
                </div>
              </div>

              <div className="transferencia-produto">
                <div className="produto-info">
                  <span className="produto-nome">
                    {transferencia.produto?.nome}
                  </span>
                  {transferencia.lote && (
                    <span className="produto-lote">
                      Lote: {transferencia.lote}
                    </span>
                  )}
                </div>
                <div className="produto-quantidade">
                  <span className="quantidade">{transferencia.quantidade}</span>
                  <span className="unidade">un</span>
                </div>
              </div>

              {transferencia.motivo_transferencia && (
                <div className="transferencia-motivo">
                  <span className="motivo-label">Motivo:</span>
                  <span className="motivo-texto">
                    {transferencia.motivo_transferencia}
                  </span>
                </div>
              )}

              <div className="transferencia-actions">
                {transferencia.status === 'solicitada' && (
                  <>
                    <button 
                      className="btn-action btn-approve"
                      onClick={() => handleAprovar(transferencia.id)}
                      title="Aprovar"
                    >
                      ✅ Aprovar
                    </button>
                    <button 
                      className="btn-action btn-cancel"
                      onClick={() => handleCancelar(transferencia.id)}
                      title="Cancelar"
                    >
                      🚫 Cancelar
                    </button>
                  </>
                )}
                
                {transferencia.status === 'aprovada' && (
                  <button 
                    className="btn-action btn-transport"
                    onClick={() => handleIniciarTransporte(transferencia.id)}
                    title="Iniciar Transporte"
                  >
                    🚚 Iniciar Transporte
                  </button>
                )}
                
                {transferencia.status === 'em_transito' && (
                  <button 
                    className="btn-action btn-receive"
                    onClick={() => handleConfirmarRecebimento(transferencia.id)}
                    title="Confirmar Recebimento"
                  >
                    📦 Receber
                  </button>
                )}
                
                <button 
                  className="btn-action btn-view"
                  onClick={() => navigate(`/app/transferencias/${transferencia.id}`)}
                  title="Ver Detalhes"
                >
                  👁️ Ver
                </button>
              </div>
            </div>
          );
        })}

        {transferencias.length === 0 && (
          <div className="no-results">
            <p>Nenhuma transferência encontrada</p>
          </div>
        )}
      </div>

      {/* Modal Nova Transferência */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nova Transferência</h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Filial de Origem</label>
                <select
                  value={novaTransferencia.filial_origem_id}
                  onChange={(e) => setNovaTransferencia({
                    ...novaTransferencia, 
                    filial_origem_id: e.target.value
                  })}
                  required
                >
                  <option value="">Selecione...</option>
                  {filiais.map(filial => (
                    <option key={filial.id} value={filial.id}>
                      {filial.nome_fantasia}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Filial de Destino</label>
                <select
                  value={novaTransferencia.filial_destino_id}
                  onChange={(e) => setNovaTransferencia({
                    ...novaTransferencia, 
                    filial_destino_id: e.target.value
                  })}
                  required
                >
                  <option value="">Selecione...</option>
                  {filiais
                    .filter(f => f.id !== novaTransferencia.filial_origem_id)
                    .map(filial => (
                      <option key={filial.id} value={filial.id}>
                        {filial.nome_fantasia}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Produto</label>
                <input
                  type="text"
                  placeholder="Digite o nome do produto..."
                  value={novaTransferencia.produto_id}
                  onChange={(e) => setNovaTransferencia({
                    ...novaTransferencia, 
                    produto_id: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={novaTransferencia.quantidade}
                    onChange={(e) => setNovaTransferencia({
                      ...novaTransferencia, 
                      quantidade: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Lote (opcional)</label>
                  <input
                    type="text"
                    value={novaTransferencia.lote}
                    onChange={(e) => setNovaTransferencia({
                      ...novaTransferencia, 
                      lote: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Motivo da Transferência</label>
                <textarea
                  value={novaTransferencia.motivo_transferencia}
                  onChange={(e) => setNovaTransferencia({
                    ...novaTransferencia, 
                    motivo_transferencia: e.target.value
                  })}
                  rows={3}
                  placeholder="Descreva o motivo da transferência..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary"
                onClick={handleCriarTransferencia}
              >
                Criar Transferência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transferencias;
