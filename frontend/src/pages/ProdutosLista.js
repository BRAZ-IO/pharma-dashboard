import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Produtos.css';

const ProdutosLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProdutos(response.data.produtos || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Não foi possível carregar os produtos');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const categories = ['Todos', ...new Set(produtos.map(p => p.categoria || 'Sem categoria'))];

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo_barras?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (estoque_atual, estoque_minimo) => {
    if (estoque_atual === 0) return { label: 'Sem estoque', class: 'stock-empty' };
    if (estoque_atual < estoque_minimo) return { label: 'Estoque baixo', class: 'stock-low' };
    if (estoque_atual < estoque_minimo * 2) return { label: 'Estoque médio', class: 'stock-medium' };
    return { label: 'Em estoque', class: 'stock-ok' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={carregarProdutos} className="btn-retry">
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="produtos-lista">
      <div className="produtos-lista-header">
        <div className="produtos-stats">
          <div className="stat-card">
            <span className="stat-value">{produtos.length}</span>
            <span className="stat-label">Total de Produtos</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{produtos.filter(p => p.ativo !== false).length}</span>
            <span className="stat-label">Produtos Ativos</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{produtos.filter(p => p.estoque_atual < (p.estoque_minimo || 10)).length}</span>
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
          const stockStatus = getStockStatus(produto.estoque_atual, produto.estoque_minimo);
          return (
            <div key={produto.id} className="produto-card">
              <div className="produto-header">
                <div className="produto-info">
                  <h3>{produto.nome}</h3>
                  <p className="produto-barcode">{produto.codigo_barras || 'Sem código'}</p>
                </div>
                <div className={`produto-status ${produto.ativo !== false ? 'ativo' : 'inativo'}`}>
                  {produto.ativo !== false ? '✓' : '✗'}
                </div>
              </div>

              <div className="produto-details">
                <div className="detail-row">
                  <span className="detail-label">Preço</span>
                  <span className="detail-value price">{formatCurrency(produto.preco_venda || 0)}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Estoque</span>
                  <span className={`detail-value ${stockStatus.class}`}>
                    {produto.estoque_atual || 0} unid.
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Categoria</span>
                  <span className="detail-value">{produto.categoria || 'Sem categoria'}</span>
                </div>
              </div>

              <div className="produto-actions">
                <button 
                  className="btn-action btn-view"
                  onClick={() => navigate(`/app/produtos/${produto.id}`)}
                  title="Ver detalhes"
                >
                  👁️
                </button>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/app/produtos/cadastro/${produto.id}`)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  className="btn-action btn-stock"
                  onClick={() => navigate(`/app/estoque/movimentacoes?produto=${produto.id}`)}
                  title="Gerenciar estoque"
                >
                  📦
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
