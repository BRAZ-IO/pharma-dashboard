import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ClientesCadastro.css';

const ClientesCadastro = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    genero: '',
    status: 'ativo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do cliente:', formData);
    // Aqui viria a lógica de salvar
  };

  return (
    <div className="clientes-cadastro">
      <div className="cadastro-header">
        <div className="cadastro-nav">
          <Link to="../" className="btn btn-outline-secondary">
            ← Voltar
          </Link>
          <h2>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="form-section">
          <h3>Informações Pessoais</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genero">Gênero</label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Endereço</h3>
          <div className="form-group">
            <label htmlFor="endereco">Endereço Completo</label>
            <textarea
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              rows={3}
              className="form-control"
              placeholder="Rua, número, bairro, cidade, estado"
            />
          </div>
        </div>

        <div className="form-actions">
          <Link to="../" className="btn btn-outline-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientesCadastro;
