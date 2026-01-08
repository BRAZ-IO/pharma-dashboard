import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FornecedoresCadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    contato: '',
    email: '',
    telefone: '',
    endereco: '',
    status: 'ativo'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }
    
    if (!formData.contato.trim()) {
      newErrors.contato = 'Contato é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do fornecedor:', formData);
      alert('Fornecedor cadastrado com sucesso! (Funcionalidade em desenvolvimento)');
      navigate('/app/fornecedores');
    }
  };

  const handleCancel = () => {
    navigate('/app/fornecedores');
  };

  return (
    <div className="fornecedor-cadastro">
      <div className="fornecedor-cadastro-header">
        <h2>Novo Fornecedor</h2>
        <button className="btn-secondary" onClick={handleCancel}>
          Cancelar
        </button>
      </div>

      <form className="fornecedor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Informações Básicas</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="nome">Nome da Empresa *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Distribuidora Medicamentos Ltda"
                className={errors.nome ? 'error' : ''}
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                className={errors.cnpj ? 'error' : ''}
              />
              {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Informações de Contato</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contato">Nome do Contato *</label>
              <input
                type="text"
                id="contato"
                name="contato"
                value={formData.contato}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                className={errors.contato ? 'error' : ''}
              />
              {errors.contato && <span className="error-message">{errors.contato}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemplo@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
                className={errors.telefone ? 'error' : ''}
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Endereço</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="endereco">Endereço Completo *</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Rua, número - Bairro, Cidade/UF"
                className={errors.endereco ? 'error' : ''}
              />
              {errors.endereco && <span className="error-message">{errors.endereco}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Cadastrar Fornecedor
          </button>
        </div>
      </form>
    </div>
  );
};

export default FornecedoresCadastro;
