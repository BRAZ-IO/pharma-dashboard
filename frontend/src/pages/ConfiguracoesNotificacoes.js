import React, { useState } from 'react';

const ConfiguracoesNotificacoes = () => {
  const [formData, setFormData] = useState({
    emailNotificacoes: true,
    emailEstoqueBaixo: true,
    emailVendasDiarias: true,
    emailBackup: false,
    emailErros: true,
    pushNotificacoes: true,
    pushEstoqueCritico: true,
    pushVendasImportantes: true,
    pushAtualizacoes: false,
    smsNotificacoes: false,
    smsEstoqueCritico: false,
    smsVendasAltas: false,
    horarioSilencioso: false,
    horarioInicio: '22:00',
    horarioFim: '08:00',
  });

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Configurações de notificações salvas:', formData);
    alert('Configurações de notificações salvas com sucesso!');
  };

  return (
    <div className="configuracoes-notificacoes">
      <div className="configuracoes-header">
        <h2>Configurações de Notificações</h2>
        <p>Gerencie como e quando você deseja receber notificações</p>
      </div>

      <form onSubmit={handleSubmit} className="configuracoes-form">
        <div className="form-section">
          <h3>Notificações por E-mail</h3>
          <div className="notificacoes-list">
            <div className="notificacao-item">
              <div className="notificacao-info">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="emailNotificacoes"
                    checked={formData.emailNotificacoes}
                    onChange={handleChange}
                  />
                  <span className="notificacao-title">Ativar notificações por e-mail</span>
                </label>
                <p className="notificacao-description">Receba atualizações importantes por e-mail</p>
              </div>
            </div>

            {formData.emailNotificacoes && (
              <>
                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="emailEstoqueBaixo"
                        checked={formData.emailEstoqueBaixo}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Estoque baixo</span>
                    </label>
                    <p className="notificacao-description">Alertas quando produtos atingirem estoque mínimo</p>
                  </div>
                </div>

                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="emailVendasDiarias"
                        checked={formData.emailVendasDiarias}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Resumo de vendas diárias</span>
                    </label>
                    <p className="notificacao-description">Relatório diário de vendas enviado ao final do dia</p>
                  </div>
                </div>

                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="emailBackup"
                        checked={formData.emailBackup}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Confirmação de backup</span>
                    </label>
                    <p className="notificacao-description">Notificação quando backup for concluído</p>
                  </div>
                </div>

                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="emailErros"
                        checked={formData.emailErros}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Erros do sistema</span>
                    </label>
                    <p className="notificacao-description">Alertas de erros críticos do sistema</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Notificações Push</h3>
          <div className="notificacoes-list">
            <div className="notificacao-item">
              <div className="notificacao-info">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="pushNotificacoes"
                    checked={formData.pushNotificacoes}
                    onChange={handleChange}
                  />
                  <span className="notificacao-title">Ativar notificações push</span>
                </label>
                <p className="notificacao-description">Receba notificações instantâneas no navegador</p>
              </div>
            </div>

            {formData.pushNotificacoes && (
              <>
                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="pushEstoqueCritico"
                        checked={formData.pushEstoqueCritico}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Estoque crítico</span>
                    </label>
                    <p className="notificacao-description">Alertas urgentes de estoque crítico</p>
                  </div>
                </div>

                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="pushVendasImportantes"
                        checked={formData.pushVendasImportantes}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Vendas importantes</span>
                    </label>
                    <p className="notificacao-description">Notificações de vendas de alto valor</p>
                  </div>
                </div>

                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="pushAtualizacoes"
                        checked={formData.pushAtualizacoes}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Atualizações do sistema</span>
                    </label>
                    <p className="notificacao-description">Notificações sobre novas funcionalidades</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Notificações por SMS</h3>
          <div className="notificacoes-list">
            <div className="notificacao-item">
              <div className="notificacao-info">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="smsNotificacoes"
                    checked={formData.smsNotificacoes}
                    onChange={handleChange}
                  />
                  <span className="notificacao-title">Ativar notificações por SMS</span>
                </label>
                <p className="notificacao-description">Receba alertas críticos por mensagem de texto</p>
              </div>
            </div>

            {formData.smsNotificacoes && (
              <>
                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="smsEstoqueCritico"
                        checked={formData.smsEstoqueCritico}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Estoque crítico</span>
                    </label>
                    <p className="notificacao-description">SMS quando estoque atingir nível crítico</p>
                  </div>
                </div>

                <div className="notificacao-item sub-item">
                  <div className="notificacao-info">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="smsVendasAltas"
                        checked={formData.smsVendasAltas}
                        onChange={handleChange}
                      />
                      <span className="notificacao-title">Vendas de alto valor</span>
                    </label>
                    <p className="notificacao-description">SMS para vendas acima de R$ 1.000</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Horário Silencioso</h3>
          <div className="notificacoes-list">
            <div className="notificacao-item">
              <div className="notificacao-info">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="horarioSilencioso"
                    checked={formData.horarioSilencioso}
                    onChange={handleChange}
                  />
                  <span className="notificacao-title">Ativar horário silencioso</span>
                </label>
                <p className="notificacao-description">Não receber notificações não urgentes durante este período</p>
              </div>
            </div>

            {formData.horarioSilencioso && (
              <div className="horario-silencioso-config">
                <div className="form-group">
                  <label htmlFor="horarioInicio">Início</label>
                  <input
                    type="time"
                    id="horarioInicio"
                    name="horarioInicio"
                    value={formData.horarioInicio}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="horarioFim">Fim</label>
                  <input
                    type="time"
                    id="horarioFim"
                    name="horarioFim"
                    value={formData.horarioFim}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracoesNotificacoes;
