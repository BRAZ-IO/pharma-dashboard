import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados da Empresa
    nomeEmpresa: '',
    cnpj: '',
    razaoSocial: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    
    // Dados do Administrador
    nomeAdmin: '',
    emailAdmin: '',
    telefoneAdmin: '',
    cpfAdmin: '',
    senha: '',
    confirmarSenha: '',
    
    // Plano
    plano: 'basico',
    
    // Termos
    aceitarTermos: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.nomeEmpresa.trim()) newErrors.nomeEmpresa = 'Nome da empresa é obrigatório';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.nomeAdmin.trim()) newErrors.nomeAdmin = 'Nome do administrador é obrigatório';
    if (!formData.emailAdmin.trim()) newErrors.emailAdmin = 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAdmin)) newErrors.emailAdmin = 'E-mail inválido';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    if (formData.senha.length < 6) newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.aceitarTermos) newErrors.aceitarTermos = 'Você deve aceitar os termos de uso';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    console.log('Registro de empresa:', formData);
    alert('Empresa registrada com sucesso! Você receberá um e-mail de confirmação.');
    navigate('/login');
  };

  const planos = [
    {
      id: 'basico',
      nome: 'Básico',
      preco: 'R$ 99',
      periodo: '/mês',
      recursos: [
        'Até 3 usuários',
        'PDV básico',
        'Controle de estoque',
        'Relatórios simples',
        'Suporte por e-mail',
      ]
    },
    {
      id: 'profissional',
      nome: 'Profissional',
      preco: 'R$ 199',
      periodo: '/mês',
      recursos: [
        'Até 10 usuários',
        'PDV completo',
        'Gestão de estoque avançada',
        'Relatórios completos',
        'Suporte prioritário',
        'Backup automático',
      ],
      destaque: true
    },
    {
      id: 'empresarial',
      nome: 'Empresarial',
      preco: 'R$ 399',
      periodo: '/mês',
      recursos: [
        'Usuários ilimitados',
        'Todas as funcionalidades',
        'API de integração',
        'Relatórios personalizados',
        'Suporte 24/7',
        'Backup em tempo real',
        'Treinamento incluído',
      ]
    }
  ];

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-header">
          <h1>Registrar Nova Empresa</h1>
          <p>Crie sua conta e comece a usar o Pharma Dashboard</p>
        </div>

        <div className="registro-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span className="step-label">Dados da Empresa</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span className="step-label">Administrador</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span className="step-label">Plano</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          {step === 1 && (
            <div className="form-step">
              <h2>Dados da Empresa</h2>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="nomeEmpresa">Nome da Empresa *</label>
                  <input
                    type="text"
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleChange}
                    className={errors.nomeEmpresa ? 'error' : ''}
                    placeholder="Ex: Farmácia São João"
                  />
                  {errors.nomeEmpresa && <span className="error-message">{errors.nomeEmpresa}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cnpj">CNPJ *</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    className={errors.cnpj ? 'error' : ''}
                    placeholder="00.000.000/0000-00"
                  />
                  {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="razaoSocial">Razão Social</label>
                  <input
                    type="text"
                    id="razaoSocial"
                    name="razaoSocial"
                    value={formData.razaoSocial}
                    onChange={handleChange}
                    placeholder="Razão social da empresa"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail da Empresa *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="contato@empresa.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone *</label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={errors.telefone ? 'error' : ''}
                    placeholder="(00) 0000-0000"
                  />
                  {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Cidade"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    {/* Adicionar outros estados */}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="cep">CEP</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Dados do Administrador</h2>
              <p className="step-description">Esta pessoa terá acesso total ao sistema</p>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="nomeAdmin">Nome Completo *</label>
                  <input
                    type="text"
                    id="nomeAdmin"
                    name="nomeAdmin"
                    value={formData.nomeAdmin}
                    onChange={handleChange}
                    className={errors.nomeAdmin ? 'error' : ''}
                    placeholder="Nome do administrador"
                  />
                  {errors.nomeAdmin && <span className="error-message">{errors.nomeAdmin}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="emailAdmin">E-mail *</label>
                  <input
                    type="email"
                    id="emailAdmin"
                    name="emailAdmin"
                    value={formData.emailAdmin}
                    onChange={handleChange}
                    className={errors.emailAdmin ? 'error' : ''}
                    placeholder="admin@empresa.com"
                  />
                  {errors.emailAdmin && <span className="error-message">{errors.emailAdmin}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefoneAdmin">Telefone</label>
                  <input
                    type="text"
                    id="telefoneAdmin"
                    name="telefoneAdmin"
                    value={formData.telefoneAdmin}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cpfAdmin">CPF</label>
                  <input
                    type="text"
                    id="cpfAdmin"
                    name="cpfAdmin"
                    value={formData.cpfAdmin}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="senha">Senha *</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className={errors.senha ? 'error' : ''}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.senha && <span className="error-message">{errors.senha}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className={errors.confirmarSenha ? 'error' : ''}
                    placeholder="Repita a senha"
                  />
                  {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Escolha seu Plano</h2>
              <p className="step-description">Você pode alterar seu plano a qualquer momento</p>
              
              <div className="planos-grid">
                {planos.map(plano => (
                  <div
                    key={plano.id}
                    className={`plano-card ${formData.plano === plano.id ? 'selected' : ''} ${plano.destaque ? 'destaque' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, plano: plano.id }))}
                  >
                    {plano.destaque && <div className="plano-badge">Mais Popular</div>}
                    <h3>{plano.nome}</h3>
                    <div className="plano-preco">
                      <span className="preco">{plano.preco}</span>
                      <span className="periodo">{plano.periodo}</span>
                    </div>
                    <ul className="plano-recursos">
                      {plano.recursos.map((recurso, index) => (
                        <li key={index}>
                          <span className="check">✓</span>
                          {recurso}
                        </li>
                      ))}
                    </ul>
                    <div className="plano-radio">
                      <input
                        type="radio"
                        name="plano"
                        value={plano.id}
                        checked={formData.plano === plano.id}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="termos-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="aceitarTermos"
                    checked={formData.aceitarTermos}
                    onChange={handleChange}
                  />
                  <span>
                    Eu li e aceito os <Link to="/termos" target="_blank">Termos de Uso</Link> e a <Link to="/privacidade" target="_blank">Política de Privacidade</Link>
                  </span>
                </label>
                {errors.aceitarTermos && <span className="error-message">{errors.aceitarTermos}</span>}
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={handleBack}>
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>
                Próximo
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Finalizar Registro
              </button>
            )}
          </div>
        </form>

        <div className="registro-footer">
          <p>Já tem uma conta? <Link to="/login">Fazer login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
