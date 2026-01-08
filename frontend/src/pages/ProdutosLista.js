import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Produtos.css';

const ProdutosLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const [produtos] = useState([
    { id: 1, name: 'Paracetamol 750mg', price: 12.50, stock: 45, category: 'Analgésico', barcode: '7891234567890', status: 'ativo' },
    { id: 2, name: 'Dipirona 500mg', price: 8.90, stock: 32, category: 'Analgésico', barcode: '7891234567891', status: 'ativo' },
    { id: 3, name: 'Amoxicilina 500mg', price: 15.80, stock: 28, category: 'Antibiótico', barcode: '7891234567892', status: 'ativo' },
    { id: 4, name: 'Ibuprofeno 400mg', price: 18.50, stock: 15, category: 'Anti-inflamatório', barcode: '7891234567893', status: 'ativo' },
    { id: 5, name: 'Vitamina D3', price: 35.90, stock: 22, category: 'Vitamina', barcode: '7891234567894', status: 'ativo' },
    { id: 6, name: 'Omeprazol 20mg', price: 22.30, stock: 18, category: 'Antiácido', barcode: '7891234567895', status: 'ativo' },
    { id: 7, name: 'Loratadina 10mg', price: 25.80, stock: 35, category: 'Antialérgico', barcode: '7891234567896', status: 'ativo' },
    { id: 8, name: 'Ácido Fólico 5mg', price: 28.90, stock: 12, category: 'Vitamina', barcode: '7891234567897', status: 'inativo' },
    { id: 9, name: 'Azitromicina 500mg', price: 32.50, stock: 8, category: 'Antibiótico', barcode: '7891234567898', status: 'ativo' },
    { id: 10, name: 'Dorflex', price: 14.90, stock: 50, category: 'Analgésico', barcode: '7891234567899', status: 'ativo' },
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const categories = ['Todos', ...new Set(produtos.map(p => p.category))];

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Sem estoque', class: 'stock-empty' };
    if (stock < 10) return { label: 'Estoque baixo', class: 'stock-low' };
    if (stock < 20) return { label: 'Estoque médio', class: 'stock-medium' };
    return { label: 'Em estoque', class: 'stock-ok' };
  };

  return (
    <div className="produtos-lista">
      <div className="produtos-lista-header">
        <div className="produtos-stats">
          <div className="stat-card">
            <span className="stat-value">{produtos.length}</span>
            <span className="stat-label">Total de Produtos</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{produtos.filter(p => p.status === 'ativo').length}</span>
            <span className="stat-label">Produtos Ativos</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{produtos.filter(p => p.stock < 10).length}</span>
            <span className="stat-label">Estoque Baixo</span>
          </div>
        </div>

        <button 
          className="btn-novo-produto"
          onClick={() => navigate('/app/produtos/cadastro')}
        >
          + Novo Produto
        </button>
      </div>

      <div className="produtos-controls">
        <input
          type="text"
          placeholder="Buscar por nome ou código de barras..."
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
      </div>

      <div className="produtos-grid">
        {filteredProducts.map(produto => {
          const stockStatus = getStockStatus(produto.stock);
          return (
            <div key={produto.id} className="produto-card">
              <div className="produto-header">
                <div className="produto-info">
                  <h3>{produto.name}</h3>
                  <p className="produto-barcode">{produto.barcode}</p>
                </div>
                <span className={`status-badge ${produto.status}`}>
                  {produto.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
                </span>
              </div>

              <div className="produto-details">
                <div className="detail-row">
                  <span className="detail-label">Categoria:</span>
                  <span className="category-badge">{produto.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Preço:</span>
                  <span className="detail-value price">{formatCurrency(produto.price)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estoque:</span>
                  <span className={`stock-badge ${stockStatus.class}`}>
                    {produto.stock} un
                  </span>
                </div>
              </div>

              <div className="produto-actions">
                <button 
                  className="btn-action btn-view"
                  onClick={() => navigate(`/app/produtos/${produto.id}`)}
                  title="Ver detalhes"
                >
                  👁️ Ver
                </button>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/app/produtos/cadastro/${produto.id}`)}
                  title="Editar"
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-action btn-delete"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir o produto ${produto.name}?`)) {
                      console.log(`Excluindo produto ${produto.name}`);
                      alert(`Produto excluído! (Funcionalidade em desenvolvimento)`);
                    }
                  }}
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdutosLista;
