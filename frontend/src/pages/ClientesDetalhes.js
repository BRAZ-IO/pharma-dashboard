import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ClientesDetalhes.css';

const ClientesDetalhes = () => {
  const { id } = useParams();
  
  const [cliente] = useState({
    id: id,
    nome: 'Ana Silva',
    cpf: '123.456.789-00',
    telefone: '(11) 98765-4321',
    email: 'ana.silva@email.com',
    dataCadastro: '2024-01-15',
    status: 'ativo',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    cnpj: null,
    dataNascimento: '1985-03-15',
    genero: 'Feminino'
  });

  return (
    <div className="clientes-detalhes">
      <div className="detalhes-header">
        <div className="detalhes-nav">
          <Link to="../" className="btn btn-outline-secondary">
            ← Voltar
          </Link>
          <Link to={`editar/${cliente.id}`} className="btn btn-primary">
            Editar
          </Link>
        </div>
      </div>

      <div className="detalhes-content">
        <div className="detalhes-card">
          <h2>Informações Pessoais</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Nome:</label>
              <span>{cliente.nome}</span>
            </div>
            <div className="info-item">
              <label>CPF:</label>
              <span>{cliente.cpf}</span>
            </div>
            <div className="info-item">
              <label>Telefone:</label>
              <span>{cliente.telefone}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{cliente.email}</span>
            </div>
            <div className="info-item">
              <label>Data de Nascimento:</label>
              <span>{new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="info-item">
              <label>Gênero:</label>
              <span>{cliente.genero}</span>
            </div>
          </div>
        </div>

        <div className="detalhes-card">
          <h2>Endereço</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Endereço Completo:</label>
              <span>{cliente.endereco}</span>
            </div>
          </div>
        </div>

        <div className="detalhes-card">
          <h2>Informações de Cadastro</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Data de Cadastro:</label>
              <span>{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-badge ${cliente.status}`}>
                {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesDetalhes;
