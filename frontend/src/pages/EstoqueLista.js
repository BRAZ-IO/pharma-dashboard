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
      setError('');
      
      // Buscar produtos da API real
      const response = await api.get('/produtos', {
        params: {
          limit: 1000, // Buscar todos os produtos
          ativo: true  // Apenas produtos ativos
        }
      });
      
      setProdutos(response.data.produtos || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
      if (error.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else if (error.response?.status === 403) {
        setError('Acesso negado. Verifique suas permissões.');
      } else if (error.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError('Não foi possível carregar os dados do estoque');
      }
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Todos', ...new Set(produtos.map(p => p.categoria || 'Sem categoria'))];

  const getStockStatus = (estoque_atual, estoque_minimo) => {
    if (estoque_atual === 0) return { label: 'Esgotado', class: 'estoque-baixo', priority: 3 };
    if (estoque_atual < estoque_minimo) return { label: 'Crítico', class: 'estoque-baixo', priority: 2 };
    if (estoque_atual < estoque_minimo * 1.5) return { label: 'Baixo', class: 'estoque-medio', priority: 1 };
    return { label: 'Normal', class: 'estoque-alto', priority: 0 };
  };

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo_barras?.includes(searchTerm) ||
                         product.fabricante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.principio_ativo?.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="estoque-loading">
        <div className="loading-spinner"></div>
        <p>Carregando estoque...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estoque-error">
        <div className="error-icon">⚠️</div>
        <h3>Erro ao carregar estoque</h3>
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
        <div className="estoque-lista-controls">
          <div className="estoque-search">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="estoque-filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="estoque-filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="estoque-filter-select"
            >
              <option value="todos">Todos</option>
              <option value="critico">Crítico</option>
              <option value="baixo">Baixo</option>
            </select>
          </div>
          
          <div className="estoque-actions">
            <button 
              className="btn-novo-produto"
              onClick={() => navigate('/app/produtos/cadastro')}
            >
              + Novo Produto
            </button>
          </div>
        </div>
      </div>
      
      <div className="estoque-stats">
        <div className="stat-card total">
          <h3>{stockStats.total}</h3>
          <p>Total de Produtos</p>
        </div>
        <div className="stat-card estoque-baixo">
          <h3>{stockStats.critical}</h3>
          <p>Estoque Crítico</p>
        </div>
        <div className="stat-card estoque-medio">
          <h3>{stockStats.low}</h3>
          <p>Estoque Baixo</p>
        </div>
        <div className="stat-card estoque-alto">
          <h3>{stockStats.ok}</h3>
          <p>Estoque Normal</p>
        </div>
      </div>
      
      <div className="estoque-grid">
        {filteredProducts.map(produto => (
          <div key={produto.id} className="produto-card" onClick={() => navigate(`/app/produtos/${produto.id}`)}>
            <div className="produto-card-header">
              <div className="produto-imagem">
                📦
              </div>
              <div className="produto-info">
                <h3>{produto.nome || 'Sem nome'}</h3>
                <p>{produto.codigo_barras || 'Sem código'}</p>
              </div>
            </div>
            
            <div className="produto-details">
              <div className="produto-detail codigo">
                🏷️ {produto.codigo_barras || 'N/A'}
              </div>
              {produto.fabricante && (
                <div className="produto-detail fabricante">
                  🏭 {produto.fabricante}
                </div>
              )}
              {produto.categoria && (
                <div className="produto-detail categoria">
                  � {produto.categoria}
                </div>
              )}
              {produto.preco_venda && (
                <div className="produto-detail preco">
                  💰 {formatCurrency(produto.preco_venda)}
                </div>
              )}
              {produto.requer_receita && (
                <div className="produto-detail receita">
                  📄 Receita Obrigatória
                </div>
              )}
              {produto.controlado && (
                <div className="produto-detail controlado">
                  ⚠️ Produto Controlado
                </div>
              )}
            </div>
            
            <div className="produto-card-footer">
              <div className="produto-quantidade">
                <span className="quantidade">{produto.estoque_atual || 0}</span>
                <span className="unidade">unidades</span>
              </div>
              
              <span className={`produto-status ${getStockStatus(produto.estoque_atual, produto.estoque_minimo).class}`}>
                {getStockStatus(produto.estoque_atual, produto.estoque_minimo).label}
              </span>
              
              <div className="produto-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAjusteEstoque(produto);
                  }}
                  title="Ajustar Estoque"
                >
                  📊
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovimentacoes(produto);
                  }}
                  title="Movimentações"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="estoque-empty">
          <div className="estoque-empty-icon">📦</div>
          <h3>Nenhum produto encontrado</h3>
          <p>Cadastre seu primeiro produto para começar</p>
          <button className="btn-novo-produto" onClick={() => navigate('/app/produtos/cadastro')}>
            + Cadastrar Produto
          </button>
        </div>
      )}
    </div>
  );
};

export default EstoqueLista;