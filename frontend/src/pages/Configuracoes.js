import React from 'react';
import './Configuracoes.css';

const Configuracoes = () => {
  return (
    <div className="configuracoes-page">
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Configurações gerais do sistema</p>
      </div>

      <div className="content-wrapper-inner">
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="content-card">
              <h3>Configurações Gerais</h3>
              <div className="config-section">
                <div className="config-item">
                  <label>Nome da Empresa</label>
                  <input type="text" className="form-input" defaultValue="Farmácia Central LTDA" />
                </div>
                <div className="config-item">
                  <label>Email de Contato</label>
                  <input type="email" className="form-input" defaultValue="contato@farmaciacentral.com.br" />
                </div>
                <div className="config-item">
                  <label>Telefone</label>
                  <input type="tel" className="form-input" defaultValue="(11) 99999-9999" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <div className="content-card">
              <h3>Preferências do Sistema</h3>
              <div className="config-section">
                <div className="config-item">
                  <label>Tema</label>
                  <select className="form-select">
                    <option>Escuro</option>
                    <option>Claro</option>
                    <option>Automático</option>
                  </select>
                </div>
                <div className="config-item">
                  <label>Idioma</label>
                  <select className="form-select">
                    <option>Português (BR)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div className="config-item">
                  <label>Fuso Horário</label>
                  <select className="form-select">
                    <option>America/Sao_Paulo</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="content-card">
              <h3>Notificações</h3>
              <div className="config-section">
                <div className="config-toggle">
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <label htmlFor="email-notifications">Notificações por Email</label>
                </div>
                <div className="config-toggle">
                  <input type="checkbox" id="push-notifications" defaultChecked />
                  <label htmlFor="push-notifications">Notificações Push</label>
                </div>
                <div className="config-toggle">
                  <input type="checkbox" id="sms-notifications" />
                  <label htmlFor="sms-notifications">Notificações por SMS</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <div className="content-card">
              <h3>Segurança</h3>
              <div className="config-section">
                <div className="config-toggle">
                  <input type="checkbox" id="two-factor" defaultChecked />
                  <label htmlFor="two-factor">Autenticação de Dois Fatores</label>
                </div>
                <div className="config-toggle">
                  <input type="checkbox" id="login-alerts" defaultChecked />
                  <label htmlFor="login-alerts">Alertas de Login</label>
                </div>
                <div className="config-item">
                  <button className="btn-secondary">Alterar Senha</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="actions-footer">
          <button className="btn-secondary">Cancelar</button>
          <button className="btn-primary">Salvar Configurações</button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
