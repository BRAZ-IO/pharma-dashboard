import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Produtos.css';

const ProdutosDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarProduto();
  }, [id]);

  const carregarProduto = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/produtos/${id}`);
      setProduto(response.data.produto);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setError('Produto não encontrado');
      setProduto(null);
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

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { label: 'Sem estoque', class: 'stock-empty' };
    if (stock < minStock) return { label: 'Estoque baixo', class: 'stock-low' };
    return { label: 'Em estoque', class: 'stock-ok' };
  };

  if (loading) {
    return (
      <div className="produto-detalhes">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="produto-detalhes">
        <div className="produto-not-found">
          <h2>Produto não encontrado</h2>
          <p>{error || `O produto com ID ${id} não existe.`}</p>
          <button className="btn-secondary" onClick={() => navigate('/app/produtos')}>
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(produto.estoque, produto.estoque_minimo);

  return (
    <div className="produto-detalhes">
      <div className="produto-detalhes-header">
        <div className="produto-title">
          <h2>{produto.nome}</h2>
          <span className={`status-badge ${produto.status}`}>
            {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <div className="produto-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/app/produtos')}
          >
            Voltar
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate(`/app/produtos/cadastro/${produto.id}`)}
          >
            Editar Produto
          </button>
        </div>
      </div>

      <div className="produto-detalhes-grid">
        <div className="produto-info-card">
          <h3>Informações Gerais</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Código de Barras</span>
              <span className="info-value barcode">{produto.codigo_barras}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Categoria</span>
              <span className="info-value">
                <span className="category-badge">{produto.categoria}</span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Fabricante</span>
              <span className="info-value">{produto.fabricante}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Unidade</span>
              <span className="info-value">{produto.unidade}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Descrição</span>
              <span className="info-value description">{produto.descricao}</span>
            </div>
          </div>
        </div>

        <div className="produto-preco-card">
          <h3>Preço</h3>
          <div className="preco-display">
            <span className="preco-valor">{formatCurrency(produto.preco_venda || produto.preco)}</span>
            <span className="preco-unidade">por {produto.unidade}</span>
          </div>
        </div>

        <div className="produto-estoque-card">
          <h3>Estoque</h3>
          <div className="estoque-info">
            <div className="estoque-atual">
              <span className="estoque-valor">{produto.estoque}</span>
              <span className="estoque-label">unidades</span>
              <span className={`stock-badge ${stockStatus.class}`}>
                {stockStatus.label}
              </span>
            </div>
            <div className="estoque-limites">
              <div className="limite-item">
                <span className="limite-label">Mínimo</span>
                <span className="limite-valor">{produto.estoque_minimo} un</span>
              </div>
              <div className="limite-item">
                <span className="limite-label">Máximo</span>
                <span className="limite-valor">{produto.estoque_maximo} un</span>
              </div>
            </div>
          </div>
          <div className="estoque-bar">
            <div 
              className="estoque-bar-fill"
              style={{ width: `${Math.min((produto.estoque / produto.estoque_maximo) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutosDetalhes;
