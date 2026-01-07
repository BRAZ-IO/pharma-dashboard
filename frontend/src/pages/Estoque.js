import React, { useState } from 'react';
import './Estoque.css';

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');

  const movimentacoes = [
    { produto: 'Dipirona 500mg (10 comp)', tipo: 'entrada', quantidade: '+10', estoqueAtual: 25, data: '06/01/2026', responsavel: 'João Silva' },
    { produto: 'Paracetamol 750mg (20 comp)', tipo: 'saida', quantidade: '-5', estoqueAtual: 15, data: '06/01/2026', responsavel: 'Maria Santos' },
    { produto: 'Amoxicilina 500mg (21 caps)', tipo: 'entrada', quantidade: '+20', estoqueAtual: 45, data: '05/01/2026', responsavel: 'Pedro Costa' },
  ];

  const filtered = movimentacoes.filter(m => {
    const matchSearch = m.produto.toLowerCase().includes(searchTerm.toLowerCase()) || m.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filterTipo === 'todos' || m.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  return (
    <div className="estoque-page">
      <div className="page-header">
        <h1>Estoque</h1>
        <p>Controle de estoque e inventário</p>
      </div>

      <div className="content-wrapper-inner">
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>567</h3>
                <p>Itens em Estoque</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>23</h3>
                <p>Estoque Baixo</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <h3>45</h3>
                <p>Movimentações Hoje</p>
              </div>
            </div>
          </div>
        </div>
      
        <div className="content-card">
          <div className="estoque-header">
            <h3>Movimentação de Estoque</h3>
            <button className="btn-primary">Nova Movimentação</button>
          </div>

          <div className="estoque-filtros">
            <div className="filtro-item">
              <input
                type="text"
                placeholder="Buscar por produto ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filtro-input"
              />
            </div>
            <div className="filtro-item">
              <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="filtro-select">
                <option value="todos">Todos tipos</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
          </div>
        
          {/* Desktop: tabela */}
          <div className="table-wrapper desktop-only">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Estoque Atual</th>
                  <th>Data</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => (
                  <tr key={idx}>
                    <td>{m.produto}</td>
                    <td><span className={`movement-badge ${m.tipo}`}>{m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span></td>
                    <td>{m.quantidade}</td>
                    <td>{m.estoqueAtual}</td>
                    <td>{m.data}</td>
                    <td>{m.responsavel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="cards-wrapper mobile-only">
            {filtered.map((m, idx) => (
              <div key={idx} className="movimentacao-card">
                <div className="movimentacao-card-header">
                  <h4>{m.produto}</h4>
                  <span className={`movement-badge ${m.tipo}`}>{m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                </div>
                <div className="movimentacao-card-body">
                  <div className="movimentacao-info">
                    <span className="info-label">Quantidade</span>
                    <span className="info-value">{m.quantidade}</span>
                  </div>
                  <div className="movimentacao-info">
                    <span className="info-label">Estoque Atual</span>
                    <span className="info-value">{m.estoqueAtual}</span>
                  </div>
                  <div className="movimentacao-info">
                    <span className="info-label">Data</span>
                    <span className="info-value">{m.data}</span>
                  </div>
                  <div className="movimentacao-info">
                    <span className="info-label">Responsável</span>
                    <span className="info-value">{m.responsavel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estoque;
