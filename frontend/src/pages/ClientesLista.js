import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ClientesLista.css';

const ClientesLista = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Timeout de 10 segundos para evitar loop infinito
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na requisição')), 10000)
      );
      
      // Adicionar delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await Promise.race([
        api.get('/clientes'),
        timeoutPromise
      ]);
      
      setClientes(response.data.clientes || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      if (error.message === 'Timeout na requisição') {
        setError('Tempo esgotado. Verifique se o backend está rodando.');
      } else if (error.response?.status === 429) {
        setError('Muitas requisições. Tente novamente em alguns instantes.');
      } else if (error.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else {
        setError('Não foi possível carregar os clientes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Limpar cache e recarregar
    setClientes([]);
    carregarClientes();
  };

  if (loading) {
    return (
      <div className="clientes-loading">
        <div className="loading-spinner"></div>
        <p>Carregando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clientes-error">
        <div className="error-icon">⚠️</div>
        <h3>Erro ao carregar clientes</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={handleRetry}>
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="clientes-lista">
      <div className="clientes-lista-header">
        <div className="clientes-lista-controls">
          <div className="clientes-search">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="clientes-filters">
            <select className="clientes-filter-select">
              <option value="todos">Todos</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>
          
          <div className="clientes-actions">
            <button className="btn-novo-cliente" onClick={() => navigate('/app/clientes/cadastro')}>
              + Novo Cliente
            </button>
          </div>
        </div>
      </div>
      
      <div className="clientes-stats">
        <div className="stat-card total">
          <h3>{clientes.length}</h3>
          <p>Total de Clientes</p>
        </div>
        <div className="stat-card ativos">
          <h3>{clientes.filter(c => c.status === 'ativo').length}</h3>
          <p>Clientes Ativos</p>
        </div>
        <div className="stat-card inativos">
          <h3>{clientes.filter(c => c.status === 'inativo').length}</h3>
          <p>Clientes Inativos</p>
        </div>
      </div>
      
      <div className="clientes-grid">
        {clientes.map(cliente => (
          <div key={cliente.id} className="cliente-card" onClick={() => navigate(`/app/clientes/${cliente.id}`)}>
            <div className="cliente-card-header">
              <div className="cliente-avatar">
                {cliente.nome?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="cliente-info">
                <h3>{cliente.nome || 'Sem nome'}</h3>
                <p>{cliente.email || 'Sem email'}</p>
              </div>
            </div>
            
            <div className="cliente-details">
              {cliente.cpf && (
                <div className="cliente-detail cpf">
                  {cliente.cpf}
                </div>
              )}
              {cliente.telefone && (
                <div className="cliente-detail telefone">
                  {cliente.telefone}
                </div>
              )}
              {cliente.email && (
                <div className="cliente-detail email">
                  {cliente.email}
                </div>
              )}
            </div>
            
            <div className="cliente-card-footer">
              <span className={`cliente-status ${cliente.status || 'ativo'}`}>
                {cliente.status || 'Ativo'}
              </span>
              
              <div className="cliente-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/clientes/editar/${cliente.id}`);
                  }}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
                      setClientes(prev => prev.filter(c => c.id !== cliente.id));
                      
                      api.delete(`/clientes/${cliente.id}`).catch(err => {
                        console.error('Erro ao excluir cliente:', err);
                        alert('Erro ao excluir cliente');
                        carregarClientes();
                      });
                    }
                  }}
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {clientes.length === 0 && (
        <div className="clientes-empty">
          <div className="clientes-empty-icon">📋</div>
          <h3>Nenhum cliente encontrado</h3>
          <p>Cadastre seu primeiro cliente para começar</p>
          <button className="btn-novo-cliente" onClick={() => navigate('/app/clientes/cadastro')}>
            + Cadastrar Cliente
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientesLista;