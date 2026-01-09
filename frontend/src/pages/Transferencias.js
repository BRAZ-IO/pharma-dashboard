import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Transferencias.css';

const Transferencias = () => {
  const navigate = useNavigate();
  const [transferencias, setTransferencias] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setError('');
      
      // Carregar transferências
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== 'todos') {
          params.append(key, value);
        }
      });

      const responseTransferencias = await api.get(`/transferencias?${params}`);
      const dataTransferencias = responseTransferencias.data;
      
      // Carregar filiais
      const responseFiliais = await api.get('/filiais');
      const dataFiliais = responseFiliais.data;
      
      setTransferencias(dataTransferencias.transferencias || []);
      setFiliais(dataFiliais.filiais || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Não foi possível carregar os dados');
      setTransferencias([]);
      setFiliais([]);
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
      const response = await api.put(`/transferencias/${id}/aprovar`);
      
      if (response.status === 200) {
        carregarDados();
        alert('Transferência aprovada com sucesso!');
      } else {
        alert('Erro ao aprovar transferência');
      }
    } catch (error) {
      console.error('Erro ao aprovar transferência:', error);
      alert('Erro ao aprovar transferência');
    }
  };

  const handleIniciarTransporte = async (id) => {
    try {
      const response = await api.put(`/transferencias/${id}/iniciar-transporte`);
      
      if (response.status === 200) {
        carregarDados();
        alert('Transporte iniciado com sucesso!');
      } else {
        alert('Erro ao iniciar transporte');
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
      const response = await api.put(`/transferencias/${id}/confirmar-recebimento`, {
        quantidade_recebida: parseInt(quantidade)
      });
      
      if (response.status === 200) {
        carregarDados();
        alert('Recebimento confirmado com sucesso!');
      } else {
        alert('Erro ao confirmar recebimento');
      }
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      alert('Erro ao confirmar recebimento');
    }
  };

  const handleCriarTransferencia = async () => {
    try {
      const response = await api.post('/transferencias', novaTransferencia);
      
      if (response.status === 201) {
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
        alert('Erro ao criar transferência');
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
      const response = await api.put(`/transferencias/${id}/cancelar`, {
        motivo_cancelamento: motivo
      });
      
      if (response.status === 200) {
        carregarDados();
        alert('Transferência cancelada com sucesso!');
      } else {
        alert('Erro ao cancelar transferência');
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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando transferências...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={carregarDados} className="btn-retry">
          🔄 Tentar novamente
        </button>
      </div>
    );
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
          className="filter-input"
        />

        <input
          type="date"
          value={filtros.data_fim}
          onChange={(e) => setFiltros({...filtros, data_fim: e.target.value})}
          className="filter-input"
        />
      </div>

      {transferencias.length === 0 ? (
        <div className="no-transferencias">
          <div className="no-transferencias-icon">📦</div>
          <h3>Nenhuma transferência encontrada</h3>
          <p>
            {filtros.status !== 'todos' || filtros.filial_origem_id !== 'todos' || filtros.filial_destino_id !== 'todos'
              ? 'Tente ajustar os filtros para ver mais transferências.'
              : 'Nenhuma transferência registrada. Clique em "Nova Transferência" para começar.'}
          </p>
        </div>
      ) : (
        <div className="transferencias-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transferencias.map(transferencia => (
                <tr key={transferencia.id}>
                  <td>{transferencia.id}</td>
                  <td>{transferencia.filial_origem?.nome_fantasia || '-'}</td>
                  <td>{transferencia.filial_destino?.nome_fantasia || '-'}</td>
                  <td>{transferencia.produto?.nome || '-'}</td>
                  <td>{transferencia.quantidade}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusInfo(transferencia.status).color }}
                    >
                      {getStatusInfo(transferencia.status).icon} {getStatusInfo(transferencia.status).label}
                    </span>
                  </td>
                  <td>{formatarData(transferencia.data_solicitacao)}</td>
                  <td>
                    <div className="acoes-buttons">
                      {transferencia.status === 'solicitada' && (
                        <>
                          <button 
                            className="btn-aprovar"
                            onClick={() => handleAprovar(transferencia.id)}
                          >
                            Aprovar
                          </button>
                          <button 
                            className="btn-cancelar"
                            onClick={() => handleCancelar(transferencia.id)}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {transferencia.status === 'aprovada' && (
                        <button 
                          className="btn-iniciar"
                          onClick={() => handleIniciarTransporte(transferencia.id)}
                        >
                          Iniciar Transporte
                        </button>
                      )}
                      {transferencia.status === 'em_transito' && (
                        <button 
                          className="btn-receber"
                          onClick={() => handleConfirmarRecebimento(transferencia.id)}
                        >
                          Receber
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nova Transferência */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Nova Transferência</h2>
              <button 
                className="btn-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Filial de Origem:</label>
                <select
                  value={novaTransferencia.filial_origem_id}
                  onChange={(e) => setNovaTransferencia({...novaTransferencia, filial_origem_id: e.target.value})}
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
                <label>Filial de Destino:</label>
                <select
                  value={novaTransferencia.filial_destino_id}
                  onChange={(e) => setNovaTransferencia({...novaTransferencia, filial_destino_id: e.target.value})}
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
                <label>Produto:</label>
                <select
                  value={novaTransferencia.produto_id}
                  onChange={(e) => setNovaTransferencia({...novaTransferencia, produto_id: e.target.value})}
                  required
                >
                  <option value="">Selecione...</option>
                  {/* Aqui você pode carregar produtos do backend */}
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade:</label>
                <input
                  type="number"
                  value={novaTransferencia.quantidade}
                  onChange={(e) => setNovaTransferencia({...novaTransferencia, quantidade: e.target.value})}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Lote:</label>
                <input
                  type="text"
                  value={novaTransferencia.lote}
                  onChange={(e) => setNovaTransferencia({...novaTransferencia, lote: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Motivo:</label>
                <textarea
                  value={novaTransferencia.motivo_transferencia}
                  onChange={(e) => setNovaTransferencia({...novaTransferencia, motivo_transferencia: e.target.value})}
                  rows="3"
                  required
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
