import React, { useState } from 'react';
import './Fornecedores.css';

const Fornecedores = () => {
  const [fornecedores] = useState([
    {
      id: '1',
      nome: 'Distribuidora Medicamentos Ltda',
      cnpj: '12.345.678/0001-90',
      contato: 'João Contato',
      email: 'contato@distmed.com.br',
      telefone: '(11) 3456-7890',
      status: 'ativo',
      endereco: 'Rua das Distribuidoras, 123 - São Paulo/SP'
    },
    {
      id: '2',
      nome: 'Laboratório Saúde S/A',
      cnpj: '98.765.432/0001-10',
      contato: 'Maria Atendente',
      email: 'vendas@labsaude.com.br',
      telefone: '(21) 2345-6789',
      status: 'ativo',
      endereco: 'Av. Central, 456 - Rio de Janeiro/RJ'
    },
    {
      id: '3',
      nome: 'FarmaSupply Indústria',
      cnpj: '55.666.777/0001-33',
      contato: 'Carlos Vendedor',
      email: 'comercial@farmasupply.com',
      telefone: '(31) 9876-5432',
      status: 'inativo',
      endereco: 'Alameda dos Fornecedores, 789 - Belo Horizonte/MG'
    }
  ]);

  const handleEdit = (id) => {
    console.log('Editar fornecedor:', id);
  };

  const handleDelete = (id) => {
    console.log('Excluir fornecedor:', id);
  };

  const handleAdd = () => {
    console.log('Adicionar novo fornecedor');
  };

  return (
    <div className="fornecedores-page">
      <div className="fornecedores-header">
        <h1>Fornecedores</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Novo Fornecedor
        </button>
      </div>

      <div className="fornecedores-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p className="stat-number">{fornecedores.length}</p>
        </div>
        <div className="stat-card">
          <h3>Ativos</h3>
          <p className="stat-number">{fornecedores.filter(f => f.status === 'ativo').length}</p>
        </div>
        <div className="stat-card">
          <h3>Inativos</h3>
          <p className="stat-number">{fornecedores.filter(f => f.status === 'inativo').length}</p>
        </div>
      </div>

      <div className="fornecedores-table-container">
        <table className="fornecedores-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Contato</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td className="nome-col">{fornecedor.nome}</td>
                <td className="cnpj-col">{fornecedor.cnpj}</td>
                <td className="contato-col">{fornecedor.contato}</td>
                <td className="email-col">{fornecedor.email}</td>
                <td className="telefone-col">{fornecedor.telefone}</td>
                <td className="status-col">
                  <span className={`status-badge ${fornecedor.status}`}>
                    {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="acoes-col">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(fornecedor.id)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(fornecedor.id)}
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

export default Fornecedores;
