 import React, { useState } from 'react';
import './Produtos.css';

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  const produtos = [
    { id: '001', nome: 'Dipirona 500mg (10 comp)', categoria: 'Medicamento', ean: '7891000100101', preco: 'R$ 8,90', status: 'ativo' },
    { id: '002', nome: 'Paracetamol 750mg (20 comp)', categoria: 'Medicamento', ean: '7891000200202', preco: 'R$ 14,50', status: 'ativo' },
    { id: '003', nome: 'Amoxicilina 500mg (21 caps)', categoria: 'Antibiótico', ean: '7891000300303', preco: 'R$ 29,90', status: 'inativo' },
    { id: '004', nome: 'Protetor Solar FPS 50 (200ml)', categoria: 'Dermocosmético', ean: '7891000600606', preco: 'R$ 59,90', status: 'ativo' },
  ];

  const filtered = produtos.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.ean.includes(searchTerm);
    const matchCategory = filterCategory === 'todos' || p.categoria === filterCategory;
    const matchStatus = filterStatus === 'todos' || p.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Produtos</h1>
        <p>Gerenciamento de produtos do sistema</p>
      </div>

      <div className="content-wrapper-inner">
        <div className="content-card">
          <div className="produtos-header">
            <h3>Lista de Produtos</h3>
            <button className="btn-primary">Adicionar Produto</button>
          </div>
          
          <div className="produtos-filtros">
            <div className="filtro-item">
              <input
                type="text"
                placeholder="Buscar por nome ou EAN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filtro-input"
              />
            </div>
            <div className="filtro-item">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filtro-select">
                <option value="todos">Todas categorias</option>
                <option value="Medicamento">Medicamento</option>
                <option value="Antibiótico">Antibiótico</option>
                <option value="Dermocosmético">Dermocosmético</option>
              </select>
            </div>
            <div className="filtro-item">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filtro-select">
                <option value="todos">Todos status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Desktop: tabela */}
          <div className="table-wrapper desktop-only">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>EAN</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{p.categoria}</td>
                    <td>{p.ean}</td>
                    <td>{p.preco}</td>
                    <td><span className={`status-badge ${p.status}`}>{p.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
                    <td>
                      <button className="btn-sm btn-edit">Editar</button>
                      <button className="btn-sm btn-delete">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="cards-wrapper mobile-only">
            {filtered.map(p => (
              <div key={p.id} className="produto-card">
                <div className="produto-card-header">
                  <h4>{p.nome}</h4>
                  <span className={`status-badge ${p.status}`}>{p.status === 'ativo' ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="produto-card-body">
                  <div className="produto-info">
                    <span className="info-label">ID</span>
                    <span className="info-value">{p.id}</span>
                  </div>
                  <div className="produto-info">
                    <span className="info-label">Categoria</span>
                    <span className="info-value">{p.categoria}</span>
                  </div>
                  <div className="produto-info">
                    <span className="info-label">EAN</span>
                    <span className="info-value">{p.ean}</span>
                  </div>
                  <div className="produto-info">
                    <span className="info-label">Preço</span>
                    <span className="info-value">{p.preco}</span>
                  </div>
                </div>
                <div className="produto-card-footer">
                  <button className="btn-sm btn-edit">Editar</button>
                  <button className="btn-sm btn-delete">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
