import React, { useState } from 'react';

const ConfiguracoesGeral = () => {
  const [formData, setFormData] = useState({
    nomeEmpresa: 'Pharma Dashboard',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 3456-7890',
    email: 'contato@pharmadashboard.com',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    cep: '01310-100',
    horarioAbertura: '08:00',
    horarioFechamento: '18:00',
    diasFuncionamento: ['seg', 'ter', 'qua', 'qui', 'sex'],
  });

  const diasSemana = [
    { id: 'seg', label: 'Segunda' },
    { id: 'ter', label: 'Terça' },
    { id: 'qua', label: 'Quarta' },
    { id: 'qui', label: 'Quinta' },
    { id: 'sex', label: 'Sexta' },
    { id: 'sab', label: 'Sábado' },
    { id: 'dom', label: 'Domingo' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiaToggle = (diaId) => {
    setFormData(prev => ({
      ...prev,
      diasFuncionamento: prev.diasFuncionamento.includes(diaId)
        ? prev.diasFuncionamento.filter(d => d !== diaId)
        : [...prev.diasFuncionamento, diaId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Configurações salvas:', formData);
    alert('Configurações gerais salvas com sucesso!');
  };

  return (
    <div className="configuracoes-geral">
      <div className="configuracoes-header">
        <h2>Configurações Gerais</h2>
        <p>Informações básicas da empresa e horário de funcionamento</p>
      </div>

      <form onSubmit={handleSubmit} className="configuracoes-form">
        <div className="form-section">
          <h3>Informações da Empresa</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="nomeEmpresa">Nome da Empresa *</label>
              <input
                type="text"
                id="nomeEmpresa"
                name="nomeEmpresa"
                value={formData.nomeEmpresa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="endereco">Endereço *</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cep">CEP *</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Horário de Funcionamento</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="horarioAbertura">Horário de Abertura *</label>
              <input
                type="time"
                id="horarioAbertura"
                name="horarioAbertura"
                value={formData.horarioAbertura}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="horarioFechamento">Horário de Fechamento *</label>
              <input
                type="time"
                id="horarioFechamento"
                name="horarioFechamento"
                value={formData.horarioFechamento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Dias de Funcionamento *</label>
              <div className="dias-semana-grid">
                {diasSemana.map(dia => (
                  <div
                    key={dia.id}
                    className={`dia-card ${formData.diasFuncionamento.includes(dia.id) ? 'selected' : ''}`}
                    onClick={() => handleDiaToggle(dia.id)}
                  >
                    <div className="dia-checkbox">
                      {formData.diasFuncionamento.includes(dia.id) ? '✓' : ''}
                    </div>
                    <span className="dia-label">{dia.label}</span>
                  </div>
                ))}
              </div>
            </div>
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

export default ConfiguracoesGeral;
