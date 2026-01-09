import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Perfil.css';

const Perfil = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('informacoes');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    dataAdmissao: '',
    cpf: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cargo: user.cargo || '',
        departamento: user.departamento || '',
        dataAdmissao: user.dataAdmissao || '',
        cpf: user.cpf || '',
        endereco: user.endereco || '',
        cidade: user.cidade || '',
        estado: user.estado || '',
        cep: user.cep || ''
      }));
    }
  }, [user]);

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvarInformacoes = (e) => {
    e.preventDefault();
    console.log('Salvando informações:', formData);
  };

  const handleAlterarSenha = (e) => {
    e.preventDefault();
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Alterando senha');
    setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-avatar-section">
          <div className="perfil-avatar-large">
            <span>{formData.nome.charAt(0).toUpperCase()}</span>
          </div>
          <button className="btn-alterar-foto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Alterar Foto
          </button>
        </div>
        <div className="perfil-info-header">
          <h1>{formData.nome}</h1>
          <p className="perfil-cargo">{formData.cargo}</p>
          <div className="perfil-badges">
            <span className="badge badge-success">Ativo</span>
            <span className="badge badge-info">{formData.departamento}</span>
          </div>
        </div>
      </div>

      <div className="perfil-tabs">
        <button 
          className={`tab-btn ${activeTab === 'informacoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('informacoes')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Informações Pessoais
        </button>
        <button 
          className={`tab-btn ${activeTab === 'seguranca' ? 'active' : ''}`}
          onClick={() => setActiveTab('seguranca')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Segurança
        </button>
        <button 
          className={`tab-btn ${activeTab === 'atividade' ? 'active' : ''}`}
          onClick={() => setActiveTab('atividade')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
          </svg>
          Atividade Recente
        </button>
      </div>

      <div className="perfil-content">
        {activeTab === 'informacoes' && (
          <div className="tab-content">
            <form onSubmit={handleSalvarInformacoes}>
              <div className="form-section">
                <h2>Dados Pessoais</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Informações Profissionais</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Cargo</label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Departamento</label>
                    <input
                      type="text"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Data de Admissão</label>
                    <input
                      type="date"
                      name="dataAdmissao"
                      value={formData.dataAdmissao}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Endereço</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Endereço</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado</label>
                    <input
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="tab-content">
            <form onSubmit={handleAlterarSenha}>
              <div className="form-section">
                <h2>Alterar Senha</h2>
                <div className="form-grid-single">
                  <div className="form-group">
                    <label>Senha Atual</label>
                    <input
                      type="password"
                      name="senhaAtual"
                      value={senhaData.senhaAtual}
                      onChange={handleSenhaChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input
                      type="password"
                      name="novaSenha"
                      value={senhaData.novaSenha}
                      onChange={handleSenhaChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={senhaData.confirmarSenha}
                      onChange={handleSenhaChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Alterar Senha
                </button>
              </div>
            </form>

            <div className="form-section">
              <h2>Autenticação de Dois Fatores</h2>
              <div className="security-option">
                <div className="security-option-info">
                  <h3>Ativar 2FA</h3>
                  <p>Adicione uma camada extra de segurança à sua conta</p>
                </div>
                <button className="btn btn-outline">Configurar</button>
              </div>
            </div>

            <div className="form-section">
              <h2>Sessões Ativas</h2>
              <div className="sessions-list">
                <div className="session-item">
                  <div className="session-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div className="session-info">
                    <h4>Windows - Chrome</h4>
                    <p>São Paulo, Brasil • Ativo agora</p>
                  </div>
                  <span className="session-badge current">Atual</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'atividade' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Atividades Recentes</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <h4>Login realizado</h4>
                    <p>Hoje às 14:30</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <h4>Perfil atualizado</h4>
                    <p>Ontem às 10:15</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon warning">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div className="activity-info">
                    <h4>Tentativa de login falhou</h4>
                    <p>2 dias atrás às 22:45</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
