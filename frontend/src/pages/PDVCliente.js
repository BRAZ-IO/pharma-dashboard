import React, { useState, useEffect } from 'react';
import { FaUser, FaTimes, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PDV.css';

const PDVCliente = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data.clientes || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const buscarClientes = async () => {
    if (!buscaCliente.trim()) {
      carregarClientes();
      return;
    }

    setLoadingClientes(true);
    try {
      const response = await api.get(`/clientes?busca=${encodeURIComponent(buscaCliente)}`);
      setClientes(response.data.clientes || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const registrarNovoCliente = async () => {
    if (!novoCliente.nome.trim()) {
      setErro('Nome do cliente é obrigatório');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await api.post('/clientes', {
        nome: novoCliente.nome,
        cpf: novoCliente.cpf || null,
        telefone: novoCliente.telefone || null,
        email: novoCliente.email || null
      });

      const clienteRegistrado = response.data;
      
      // Salvar cliente no localStorage para o PDV usar
      localStorage.setItem('pdv_cliente', JSON.stringify(clienteRegistrado));
      
      setNovoCliente({ nome: '', cpf: '', telefone: '', email: '' });
      setClientes([]);
      alert('Cliente registrado com sucesso!');
      
      // Voltar para o PDV
      navigate('/app/pdv');
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      setErro('Erro ao registrar cliente: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const selecionarCliente = (clienteSelecionado) => {
    // Salvar cliente no localStorage para o PDV usar
    localStorage.setItem('pdv_cliente', JSON.stringify(clienteSelecionado));
    alert('Cliente selecionado com sucesso!');
    navigate('/app/pdv');
  };

  const voltarParaPDV = () => {
    navigate('/app/pdv');
  };

  return (
    <div className="pdv-content">
      <div className="pdv-cliente-container">
        <div className="cliente-header">
          <button className="back-btn" onClick={voltarParaPDV}>
            <FaArrowLeft /> Voltar para PDV
          </button>
          <h1><FaUser /> Gerenciar Clientes</h1>
        </div>

        <div className="cliente-content">
          {/* Busca de Clientes */}
          <div className="client-search-section">
            <h2>Buscar Cliente</h2>
            <div className="client-search">
              <input
                type="text"
                placeholder="Buscar cliente por nome ou CPF..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                className="client-search-input"
              />
              <button 
                onClick={buscarClientes}
                disabled={loadingClientes}
                className="search-client-btn"
              >
                Buscar
              </button>
            </div>

            {/* Lista de Clientes Encontrados */}
            {clientes.length > 0 && (
              <div className="client-list">
                <h3>Clientes Encontrados:</h3>
                {clientes.map(clienteEncontrado => (
                  <div 
                    key={clienteEncontrado.id}
                    className="client-item"
                    onClick={() => selecionarCliente(clienteEncontrado)}
                  >
                    <div className="client-item-info">
                      <span className="client-item-name">{clienteEncontrado.nome}</span>
                      {clienteEncontrado.cpf && <span className="client-item-cpf">CPF: {clienteEncontrado.cpf}</span>}
                      {clienteEncontrado.telefone && <span className="client-item-phone">{clienteEncontrado.telefone}</span>}
                    </div>
                    <FaCheck className="select-icon" />
                  </div>
                ))}
              </div>
            )}

            {clientes.length === 0 && !loadingClientes && buscaCliente && (
              <div className="no-results">
                <p>Nenhum cliente encontrado para "{buscaCliente}"</p>
              </div>
            )}
          </div>

          {/* Registrar Novo Cliente */}
          <div className="register-client-section">
            <h2>Registrar Novo Cliente</h2>
            <div className="new-client-form">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                  placeholder="Nome completo"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  value={novoCliente.cpf}
                  onChange={(e) => setNovoCliente({...novoCliente, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={novoCliente.email}
                  onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                  placeholder="email@exemplo.com"
                  className="form-input"
                />
              </div>
              
              {erro && <div className="error-message">{erro}</div>}
              
              <button 
                onClick={registrarNovoCliente}
                disabled={loading}
                className="register-client-btn"
              >
                {loading ? 'Registrando...' : 'Registrar Cliente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDVCliente;
