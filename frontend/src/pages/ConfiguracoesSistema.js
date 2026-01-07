import React, { useState } from 'react';

const ConfiguracoesSistema = () => {
  const [formData, setFormData] = useState({
    tema: 'dark',
    idioma: 'pt-BR',
    moeda: 'BRL',
    formatoData: 'DD/MM/YYYY',
    formatoHora: '24h',
    timezone: 'America/Sao_Paulo',
    backupAutomatico: true,
    frequenciaBackup: 'diario',
    retencaoBackup: '30',
    logAtividades: true,
    nivelLog: 'info',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Configurações de sistema salvas:', formData);
    alert('Configurações de sistema salvas com sucesso!');
  };

  return (
    <div className="configuracoes-sistema">
      <div className="configuracoes-header">
        <h2>Configurações do Sistema</h2>
        <p>Preferências de interface, backup e logs do sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="configuracoes-form">
        <div className="form-section">
          <h3>Interface</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tema">Tema</label>
              <select
                id="tema"
                name="tema"
                value={formData.tema}
                onChange={handleChange}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idioma">Idioma</label>
              <select
                id="idioma"
                name="idioma"
                value={formData.idioma}
                onChange={handleChange}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="moeda">Moeda</label>
              <select
                id="moeda"
                name="moeda"
                value={formData.moeda}
                onChange={handleChange}
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Fuso Horário</label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="formatoData">Formato de Data</label>
              <select
                id="formatoData"
                name="formatoData"
                value={formData.formatoData}
                onChange={handleChange}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="formatoHora">Formato de Hora</label>
              <select
                id="formatoHora"
                name="formatoHora"
                value={formData.formatoHora}
                onChange={handleChange}
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Backup e Segurança</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="backupAutomatico"
                  checked={formData.backupAutomatico}
                  onChange={handleChange}
                />
                <span>Ativar backup automático</span>
              </label>
            </div>

            {formData.backupAutomatico && (
              <>
                <div className="form-group">
                  <label htmlFor="frequenciaBackup">Frequência de Backup</label>
                  <select
                    id="frequenciaBackup"
                    name="frequenciaBackup"
                    value={formData.frequenciaBackup}
                    onChange={handleChange}
                  >
                    <option value="horario">A cada hora</option>
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="retencaoBackup">Retenção de Backup (dias)</label>
                  <input
                    type="number"
                    id="retencaoBackup"
                    name="retencaoBackup"
                    value={formData.retencaoBackup}
                    onChange={handleChange}
                    min="1"
                    max="365"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Logs e Auditoria</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="logAtividades"
                  checked={formData.logAtividades}
                  onChange={handleChange}
                />
                <span>Registrar atividades do sistema</span>
              </label>
            </div>

            {formData.logAtividades && (
              <div className="form-group">
                <label htmlFor="nivelLog">Nível de Log</label>
                <select
                  id="nivelLog"
                  name="nivelLog"
                  value={formData.nivelLog}
                  onChange={handleChange}
                >
                  <option value="error">Apenas Erros</option>
                  <option value="warning">Avisos e Erros</option>
                  <option value="info">Informações</option>
                  <option value="debug">Debug (Detalhado)</option>
                </select>
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

export default ConfiguracoesSistema;
