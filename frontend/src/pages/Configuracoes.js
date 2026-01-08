import React, { useState } from 'react';
import './Configuracoes.css';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('geral');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailVendas: true,
    emailEstoque: true,
    pushNovosPedidos: true,
    pushAtualizacoes: false,
    smsAlertas: false,
    whatsappNotificacoes: true
  });

  const [systemSettings, setSystemSettings] = useState({
    nomeEmpresa: 'Farmácia Teste',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 1234-5678',
    email: 'contato@farmacia.com',
    endereco: 'Rua das Flores, 123 - Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    tema: 'dark',
    idioma: 'pt-BR',
    formatoData: 'DD/MM/YYYY',
    formatoMoeda: 'BRL'
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simular salvamento
    setTimeout(() => {
      setLoading(false);
      alert('Configurações salvas com sucesso!');
    }, 1500);
  };

  const tabs = [
    { id: 'geral', name: 'Geral', icon: '⚙️' },
    { id: 'notificacoes', name: 'Notificações', icon: '🔔' },
    { id: 'sistema', name: 'Sistema', icon: '💻' }
  ];

  return (
    <div className="configuracoes-page">
      <div className="configuracoes-header">
        <h1>Configurações</h1>
        <p>Gerencie as configurações do sistema</p>
      </div>

      <div className="configuracoes-content">
        {/* Sidebar de Navegação */}
        <div className="config-sidebar">
          <div className="config-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`config-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-text">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="config-main">
          {/* Tab Geral */}
          {activeTab === 'geral' && (
            <div className="config-section">
              <div className="section-header">
                <h2>Configurações Gerais</h2>
                <p>Informações básicas da empresa</p>
              </div>

              <div className="config-grid">
                <div className="config-card">
                  <h3>Informações da Empresa</h3>
                  <div className="form-group">
                    <label>Nome da Empresa</label>
                    <input
                      type="text"
                      value={systemSettings.nomeEmpresa}
                      onChange={(e) => handleSystemSettingChange('nomeEmpresa', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>CNPJ</label>
                    <input
                      type="text"
                      value={systemSettings.cnpj}
                      onChange={(e) => handleSystemSettingChange('cnpj', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="text"
                      value={systemSettings.telefone}
                      onChange={(e) => handleSystemSettingChange('telefone', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      value={systemSettings.email}
                      onChange={(e) => handleSystemSettingChange('email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="config-card">
                  <h3>Endereço</h3>
                  <div className="form-group">
                    <label>Endereço</label>
                    <input
                      type="text"
                      value={systemSettings.endereco}
                      onChange={(e) => handleSystemSettingChange('endereco', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Cidade</label>
                      <input
                        type="text"
                        value={systemSettings.cidade}
                        onChange={(e) => handleSystemSettingChange('cidade', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select
                        value={systemSettings.estado}
                        onChange={(e) => handleSystemSettingChange('estado', e.target.value)}
                        className="form-select"
                      >
                        <option value="SP">SP</option>
                        <option value="RJ">RJ</option>
                        <option value="MG">MG</option>
                        <option value="BA">BA</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>CEP</label>
                    <input
                      type="text"
                      value={systemSettings.cep}
                      onChange={(e) => handleSystemSettingChange('cep', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Notificações */}
          {activeTab === 'notificacoes' && (
            <div className="config-section">
              <div className="section-header">
                <h2>Configurações de Notificações</h2>
                <p>Gerencie como e quando você recebe notificações</p>
              </div>

              <div className="config-grid">
                <div className="config-card">
                  <h3>Notificações por E-mail</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Vendas Realizadas</h4>
                      <p>Receba e-mails sobre novas vendas</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailVendas}
                        onChange={() => handleNotificationChange('emailVendas')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Estoque Baixo</h4>
                      <p>Alertas quando produtos estiverem com estoque baixo</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailEstoque}
                        onChange={() => handleNotificationChange('emailEstoque')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="config-card">
                  <h3>Notificações Push</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Novos Pedidos</h4>
                      <p>Notificações instantâneas de novos pedidos</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifications.pushNovosPedidos}
                        onChange={() => handleNotificationChange('pushNovosPedidos')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Atualizações do Sistema</h4>
                      <p>Informações sobre atualizações e melhorias</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifications.pushAtualizacoes}
                        onChange={() => handleNotificationChange('pushAtualizacoes')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="config-card">
                  <h3>Outras Notificações</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Alertas por SMS</h4>
                      <p>Receba alertas importantes por SMS</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifications.smsAlertas}
                        onChange={() => handleNotificationChange('smsAlertas')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>WhatsApp</h4>
                      <p>Notificações via WhatsApp</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifications.whatsappNotificacoes}
                        onChange={() => handleNotificationChange('whatsappNotificacoes')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Sistema */}
          {activeTab === 'sistema' && (
            <div className="config-section">
              <div className="section-header">
                <h2>Configurações do Sistema</h2>
                <p>Personalize a aparência e comportamento do sistema</p>
              </div>

              <div className="config-grid">
                <div className="config-card">
                  <h3>Aparência</h3>
                  <div className="form-group">
                    <label>Tema</label>
                    <select
                      value={systemSettings.tema}
                      onChange={(e) => handleSystemSettingChange('tema', e.target.value)}
                      className="form-select"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Idioma</label>
                    <select
                      value={systemSettings.idioma}
                      onChange={(e) => handleSystemSettingChange('idioma', e.target.value)}
                      className="form-select"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>

                <div className="config-card">
                  <h3>Formatos</h3>
                  <div className="form-group">
                    <label>Formato de Data</label>
                    <select
                      value={systemSettings.formatoData}
                      onChange={(e) => handleSystemSettingChange('formatoData', e.target.value)}
                      className="form-select"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Formato de Moeda</label>
                    <select
                      value={systemSettings.formatoMoeda}
                      onChange={(e) => handleSystemSettingChange('formatoMoeda', e.target.value)}
                      className="form-select"
                    >
                      <option value="BRL">Real (R$)</option>
                      <option value="USD">Dólar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="config-actions">
            <button className="btn-secondary">
              Cancelar
            </button>
            <button 
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
