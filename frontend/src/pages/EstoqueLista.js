import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './EstoqueLista.css';

const EstoqueLista = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProdutos(response.data.produtos || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      setError('Não foi possível carregar os dados do estoque');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Todos', ...new Set(produtos.map(p => p.categoria || 'Sem categoria'))];

  const getStockStatus = (estoque_atual, estoque_minimo) => {
    if (estoque_atual === 0) return { label: 'Esgotado', class: 'stock-empty', priority: 3 };
    if (estoque_atual < estoque_minimo) return { label: 'Crítico', class: 'stock-critical', priority: 2 };
    if (estoque_atual < estoque_minimo * 1.5) return { label: 'Baixo', class: 'stock-low', priority: 1 };
    return { label: 'Normal', class: 'stock-ok', priority: 0 };
  };

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo_barras?.includes(searchTerm) ||
                         product.lote?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
    
    let matchesStatus = true;
    if (filterStatus === 'critico') {
      const status = getStockStatus(product.estoque_atual, product.estoque_minimo);
      matchesStatus = status.priority >= 2;
    } else if (filterStatus === 'baixo') {
      const status = getStockStatus(product.estoque_atual, product.estoque_minimo);
      matchesStatus = status.priority >= 1;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stockStats = {
    total: produtos.length,
    critical: produtos.filter(p => getStockStatus(p.estoque_atual, p.estoque_minimo).priority >= 2).length,
    low: produtos.filter(p => getStockStatus(p.estoque_atual, p.estoque_minimo).priority === 1).length,
    ok: produtos.filter(p => getStockStatus(p.estoque_atual, p.estoque_minimo).priority === 0).length,
  };

  const handleAjusteEstoque = (produto) => {
    const quantidade = prompt(`Ajustar estoque de ${produto.nome}\nEstoque atual: ${produto.estoque_atual}\n\nDigite a quantidade (use + ou - para adicionar/remover):`);
    if (quantidade) {
      console.log(`Ajustando estoque do produto ${produto.nome}: ${quantidade}`);
      alert(`Ajuste de estoque implementado! (Funcionalidade em desenvolvimento)`);
    }
  };

  const handleMovimentacoes = (produto) => {
    navigate(`/app/estoque/movimentacoes?produto=${produto.id}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando estoque...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={carregarEstoque} className="btn-retry">
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="estoque-lista">
      <div className="estoque-lista-header">
        <div className="estoque-stats">
          <div className="stat-card">
            <span className="stat-value">{stockStats.total}</span>
            <span className="stat-label">Total de Produtos</span>
          </div>
          <div className="stat-card critical">
            <span className="stat-value">{stockStats.critical}</span>
            <span className="stat-label">Estoque Crítico</span>
          </div>
          <div className="stat-card low">
            <span className="stat-value">{stockStats.low}</span>
            <span className="stat-label">Estoque Baixo</span>
          </div>
          <div className="stat-card ok">
            <span className="stat-value">{stockStats.ok}</span>
            <span className="stat-label">Estoque Normal</span>
          </div>
        </div>

        <button 
          className="btn-movimentacao"
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
          <option value="todos">Todos os status</option>
          <option value="critico">Crítico</option>
          <option value="baixo">Baixo</option>
        </select>
      </div>

      <div className="estoque-grid">
        {filteredProducts.map(produto => {
          const stockStatus = getStockStatus(produto.estoque_atual, produto.estoque_minimo);
          return (
            <div key={produto.id} className={`estoque-card ${stockStatus.class}`}>
              <div className="estoque-header">
                <div className="produto-info">
                  <h3>{produto.nome}</h3>
                  <p className="produto-barcode">{produto.codigo_barras || 'Sem código'}</p>
                </div>
                <div className={`stock-badge ${stockStatus.class}`}>
                  {stockStatus.label}
                </div>
              </div>

              <div className="estoque-body">
                <div className="stock-info">
                  <div className="stock-quantity">
                    <span className="stock-label">Estoque Atual</span>
                    <span className="stock-value">{produto.estoque_atual || 0}</span>
                  </div>
                  <div className="stock-limits">
                    <div className="stock-min">
                      <span className="limit-label">Mínimo</span>
                      <span className="limit-value">{produto.estoque_minimo || 0}</span>
                    </div>
                    <div className="stock-max">
                      <span className="limit-label">Máximo</span>
                      <span className="limit-value">{produto.estoque_maximo || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="produto-details">
                  <div className="detail-row">
                    <span className="detail-label">Categoria:</span>
                    <span className="detail-value">{produto.categoria || 'Sem categoria'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lote:</span>
                    <span className="detail-value">{produto.lote || 'Não informado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Localização:</span>
                    <span className="detail-value">{produto.localizacao || 'Não informada'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Valor:</span>
                    <span className="detail-value">{formatCurrency(produto.preco_venda || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="estoque-actions">
                <button 
                  className="btn-action btn-adjust"
                  onClick={() => handleAjusteEstoque(produto)}
                  title="Ajustar estoque"
                >
                  ⚖️ Ajustar
                </button>
                <button 
                  className="btn-action btn-movimentacoes"
                  onClick={() => handleMovimentacoes(produto)}
                  title="Ver movimentações"
                >
                  📋 Movimentações
                </button>
                <button 
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/app/produtos/cadastro/${produto.id}`)}
                  title="Editar produto"
                >
                  ✏️ Editar
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">📦</div>
            <h3>Nenhum produto encontrado</h3>
            <p>
              {searchTerm || selectedCategory !== 'Todos' || filterStatus !== 'todos'
                ? 'Tente ajustar os filtros de busca.'
                : 'Nenhum produto cadastrado no estoque.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstoqueLista;
