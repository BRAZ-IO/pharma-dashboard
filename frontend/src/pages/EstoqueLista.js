import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EstoqueLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  const [produtos] = useState([
    { id: 1, name: 'Paracetamol 750mg', stock: 45, minStock: 10, maxStock: 100, category: 'Analgésico', barcode: '7891234567890', lastUpdate: '2026-01-05', supplier: 'EMS', location: 'A1-P2', lote: 'L20240115' },
    { id: 2, name: 'Dipirona 500mg', stock: 32, minStock: 15, maxStock: 80, category: 'Analgésico', barcode: '7891234567891', lastUpdate: '2026-01-04', supplier: 'Medley', location: 'A1-P3', lote: 'L20240120' },
    { id: 3, name: 'Amoxicilina 500mg', stock: 28, minStock: 10, maxStock: 60, category: 'Antibiótico', barcode: '7891234567892', lastUpdate: '2026-01-06', supplier: 'Eurofarma', location: 'B2-P1', lote: 'L20240118' },
    { id: 4, name: 'Ibuprofeno 400mg', stock: 8, minStock: 8, maxStock: 50, category: 'Anti-inflamatório', barcode: '7891234567893', lastUpdate: '2026-01-03', supplier: 'Neo Química', location: 'A2-P4', lote: 'L20240110' },
    { id: 5, name: 'Vitamina D3', stock: 22, minStock: 5, maxStock: 40, category: 'Vitamina', barcode: '7891234567894', lastUpdate: '2026-01-07', supplier: 'Sundown', location: 'C1-P1', lote: 'L20240125' },
    { id: 6, name: 'Omeprazol 20mg', stock: 18, minStock: 10, maxStock: 50, category: 'Antiácido', barcode: '7891234567895', lastUpdate: '2026-01-05', supplier: 'Aché', location: 'B1-P2', lote: 'L20240112' },
    { id: 7, name: 'Loratadina 10mg', stock: 35, minStock: 12, maxStock: 60, category: 'Antialérgico', barcode: '7891234567896', lastUpdate: '2026-01-06', supplier: 'Cimed', location: 'A3-P1', lote: 'L20240122' },
    { id: 8, name: 'Ácido Fólico 5mg', stock: 3, minStock: 5, maxStock: 30, category: 'Vitamina', barcode: '7891234567897', lastUpdate: '2026-01-02', supplier: 'Vitamedic', location: 'C1-P2', lote: 'L20240105' },
    { id: 9, name: 'Azitromicina 500mg', stock: 0, minStock: 8, maxStock: 40, category: 'Antibiótico', barcode: '7891234567898', lastUpdate: '2025-12-28', supplier: 'Eurofarma', location: 'B2-P3', lote: 'L20231220' },
    { id: 10, name: 'Dorflex', stock: 50, minStock: 15, maxStock: 80, category: 'Analgésico', barcode: '7891234567899', lastUpdate: '2026-01-07', supplier: 'Sanofi', location: 'A1-P5', lote: 'L20240128' },
  ]);

  const categories = ['Todos', ...new Set(produtos.map(p => p.category))];

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { label: 'Esgotado', class: 'stock-empty', priority: 3 };
    if (stock < minStock) return { label: 'Crítico', class: 'stock-critical', priority: 2 };
    if (stock < minStock * 1.5) return { label: 'Baixo', class: 'stock-low', priority: 1 };
    return { label: 'Normal', class: 'stock-ok', priority: 0 };
  };

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm) ||
                         product.lote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    
    let matchesStatus = true;
    if (filterStatus === 'critico') {
      const status = getStockStatus(product.stock, product.minStock);
      matchesStatus = status.priority >= 2;
    } else if (filterStatus === 'baixo') {
      const status = getStockStatus(product.stock, product.minStock);
      matchesStatus = status.priority >= 1;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stockStats = {
    total: produtos.length,
    critical: produtos.filter(p => getStockStatus(p.stock, p.minStock).priority >= 2).length,
    low: produtos.filter(p => getStockStatus(p.stock, p.minStock).priority === 1).length,
    ok: produtos.filter(p => getStockStatus(p.stock, p.minStock).priority === 0).length,
  };

  const handleAjusteEstoque = (produto) => {
    const quantidade = prompt(`Ajustar estoque de ${produto.name}\nEstoque atual: ${produto.stock}\n\nDigite a quantidade (use + ou - para adicionar/remover):`);
    if (quantidade) {
      console.log(`Ajustando estoque de ${produto.name}: ${quantidade}`);
      alert(`Estoque ajustado! (Funcionalidade em desenvolvimento)`);
    }
  };

  return (
    <div className="estoque-lista">
      <div className="estoque-lista-header">
        <div className="estoque-stats">
          <div className="stat-card">
            <span className="stat-value">{stockStats.total}</span>
            <span className="stat-label">Total de Itens</span>
          </div>
          <div className="stat-card critical">
            <span className="stat-value">{stockStats.critical}</span>
            <span className="stat-label">Estoque Crítico</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">{stockStats.low}</span>
            <span className="stat-label">Estoque Baixo</span>
          </div>
          <div className="stat-card success">
            <span className="stat-value">{stockStats.ok}</span>
            <span className="stat-label">Estoque Normal</span>
          </div>
        </div>

        <button 
          className="btn-movimentacoes"
          onClick={() => navigate('/app/estoque/movimentacoes')}
        >
          📋 Ver Movimentações
        </button>
      </div>

      <div className="estoque-controls">
        <input
          type="text"
          placeholder="Buscar por nome, código de barras ou lote..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-select"
        >
          <option value="todos">Todos os Status</option>
          <option value="critico">Crítico/Esgotado</option>
          <option value="baixo">Baixo</option>
        </select>
      </div>

      <div className="estoque-table-container">
        <table className="estoque-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Lote</th>
              <th>Localização</th>
              <th>Fornecedor</th>
              <th>Estoque Atual</th>
              <th>Mín/Máx</th>
              <th>Status</th>
              <th>Última Atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(produto => {
              const stockStatus = getStockStatus(produto.stock, produto.minStock);
              const percentage = (produto.stock / produto.maxStock) * 100;
              
              return (
                <tr key={produto.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-name">{produto.name}</span>
                      <span className="product-category">{produto.category}</span>
                    </div>
                  </td>
                  <td className="lote-cell">{produto.lote}</td>
                  <td className="location-cell">{produto.location}</td>
                  <td>{produto.supplier}</td>
                  <td>
                    <div className="stock-cell">
                      <span className="stock-value">{produto.stock} un</span>
                      <div className="stock-bar-mini">
                        <div 
                          className={`stock-bar-fill ${stockStatus.class}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="minmax-cell">
                    <span className="min-value">{produto.minStock}</span>
                    <span className="separator">/</span>
                    <span className="max-value">{produto.maxStock}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${stockStatus.class}`}>
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="date-cell">{new Date(produto.lastUpdate).toLocaleDateString('pt-BR')}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-action btn-adjust"
                      onClick={() => handleAjusteEstoque(produto)}
                      title="Ajustar estoque"
                    >
                      ⚙️
                    </button>
                    <button 
                      className="btn-action btn-view"
                      onClick={() => navigate(`/app/produtos/${produto.id}`)}
                      title="Ver produto"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstoqueLista;
