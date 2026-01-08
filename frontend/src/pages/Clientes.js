import React, { useState } from 'react';
import './Clientes.css';

const Clientes = () => {
  const [clientes] = useState([
    {
      id: '1',
      nome: 'Ana Silva',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'ana.silva@email.com',
      dataCadastro: '2024-01-15',
      status: 'ativo',
      endereco: 'Rua das Flores, 123 - São Paulo/SP'
    },
    {
      id: '2',
      nome: 'Carlos Oliveira',
      cpf: '987.654.321-00',
      telefone: '(21) 91234-5678',
      email: 'carlos.oliveira@email.com',
      dataCadastro: '2024-02-20',
      status: 'ativo',
      endereco: 'Av. Central, 456 - Rio de Janeiro/RJ'
    },
    {
      id: '3',
      nome: 'Mariana Costa',
      cpf: '555.666.777-88',
      telefone: '(31) 98876-5432',
      email: 'mariana.costa@email.com',
      dataCadastro: '2024-03-10',
      status: 'inativo',
      endereco: 'Alameda dos Clientes, 789 - Belo Horizonte/MG'
    }
  ]);

  const handleEdit = (id) => {
    console.log('Editar cliente:', id);
  };

  const handleDelete = (id) => {
    console.log('Excluir cliente:', id);
  };

  const handleAdd = () => {
    console.log('Adicionar novo cliente');
  };

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <h1>Clientes</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Novo Cliente
        </button>
      </div>

      <div className="clientes-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p className="stat-number">{clientes.length}</p>
        </div>
        <div className="stat-card">
          <h3>Ativos</h3>
          <p className="stat-number">{clientes.filter(c => c.status === 'ativo').length}</p>
        </div>
        <div className="stat-card">
          <h3>Inativos</h3>
          <p className="stat-number">{clientes.filter(c => c.status === 'inativo').length}</p>
        </div>
      </div>

      <div className="clientes-table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Cadastro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="nome-col">{cliente.nome}</td>
                <td className="cpf-col">{cliente.cpf}</td>
                <td className="telefone-col">{cliente.telefone}</td>
                <td className="email-col">{cliente.email}</td>
                <td className="data-col">{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</td>
                <td className="status-col">
                  <span className={`status-badge ${cliente.status}`}>
                    {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-col">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(cliente.id)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
