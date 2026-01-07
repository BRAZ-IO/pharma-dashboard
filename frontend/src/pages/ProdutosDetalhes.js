import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProdutosDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const produtos = [
    { id: 1, name: 'Paracetamol 750mg', price: 12.50, stock: 45, category: 'Analgésico', barcode: '7891234567890', status: 'ativo', description: 'Analgésico e antitérmico indicado para dores leves a moderadas e febre.', manufacturer: 'EMS', minStock: 10, maxStock: 100, unit: 'comprimido' },
    { id: 2, name: 'Dipirona 500mg', price: 8.90, stock: 32, category: 'Analgésico', barcode: '7891234567891', status: 'ativo', description: 'Analgésico e antitérmico para dores e febre.', manufacturer: 'Medley', minStock: 15, maxStock: 80, unit: 'comprimido' },
    { id: 3, name: 'Amoxicilina 500mg', price: 15.80, stock: 28, category: 'Antibiótico', barcode: '7891234567892', status: 'ativo', description: 'Antibiótico de amplo espectro para infecções bacterianas.', manufacturer: 'Eurofarma', minStock: 10, maxStock: 60, unit: 'cápsula' },
    { id: 4, name: 'Ibuprofeno 400mg', price: 18.50, stock: 15, category: 'Anti-inflamatório', barcode: '7891234567893', status: 'ativo', description: 'Anti-inflamatório não esteroidal para dores e inflamações.', manufacturer: 'Neo Química', minStock: 8, maxStock: 50, unit: 'comprimido' },
    { id: 5, name: 'Vitamina D3', price: 35.90, stock: 22, category: 'Vitamina', barcode: '7891234567894', status: 'ativo', description: 'Suplemento vitamínico para fortalecimento ósseo.', manufacturer: 'Sundown', minStock: 5, maxStock: 40, unit: 'cápsula' },
    { id: 6, name: 'Omeprazol 20mg', price: 22.30, stock: 18, category: 'Antiácido', barcode: '7891234567895', status: 'ativo', description: 'Inibidor de bomba de prótons para tratamento de úlceras e refluxo.', manufacturer: 'Aché', minStock: 10, maxStock: 50, unit: 'cápsula' },
    { id: 7, name: 'Loratadina 10mg', price: 25.80, stock: 35, category: 'Antialérgico', barcode: '7891234567896', status: 'ativo', description: 'Anti-histamínico para alergias e rinite.', manufacturer: 'Cimed', minStock: 12, maxStock: 60, unit: 'comprimido' },
    { id: 8, name: 'Ácido Fólico 5mg', price: 28.90, stock: 12, category: 'Vitamina', barcode: '7891234567897', status: 'inativo', description: 'Vitamina do complexo B essencial para gestantes.', manufacturer: 'Vitamedic', minStock: 5, maxStock: 30, unit: 'comprimido' },
  ];

  const produto = produtos.find(p => p.id === parseInt(id));

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

  if (!produto) {
    return (
      <div className="produto-detalhes">
        <div className="produto-not-found">
          <h2>Produto não encontrado</h2>
          <p>O produto com ID {id} não existe.</p>
          <button className="btn-secondary" onClick={() => navigate('/app/produtos')}>
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(produto.stock, produto.minStock);

  return (
    <div className="produto-detalhes">
      <div className="produto-detalhes-header">
        <div className="produto-title">
          <h2>{produto.name}</h2>
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
              <span className="info-value barcode">{produto.barcode}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Categoria</span>
              <span className="info-value">
                <span className="category-badge">{produto.category}</span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Fabricante</span>
              <span className="info-value">{produto.manufacturer}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Unidade</span>
              <span className="info-value">{produto.unit}</span>
            </div>
          </div>
          <div className="info-item full-width">
            <span className="info-label">Descrição</span>
            <span className="info-value description">{produto.description}</span>
          </div>
        </div>

        <div className="produto-preco-card">
          <h3>Preço</h3>
          <div className="preco-display">
            <span className="preco-valor">{formatCurrency(produto.price)}</span>
            <span className="preco-unidade">por {produto.unit}</span>
          </div>
        </div>

        <div className="produto-estoque-card">
          <h3>Estoque</h3>
          <div className="estoque-info">
            <div className="estoque-atual">
              <span className="estoque-valor">{produto.stock}</span>
              <span className="estoque-label">unidades</span>
              <span className={`stock-badge ${stockStatus.class}`}>
                {stockStatus.label}
              </span>
            </div>
            <div className="estoque-limites">
              <div className="limite-item">
                <span className="limite-label">Mínimo</span>
                <span className="limite-valor">{produto.minStock} un</span>
              </div>
              <div className="limite-item">
                <span className="limite-label">Máximo</span>
                <span className="limite-valor">{produto.maxStock} un</span>
              </div>
            </div>
          </div>
          <div className="estoque-bar">
            <div 
              className="estoque-bar-fill"
              style={{ width: `${Math.min((produto.stock / produto.maxStock) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdutosDetalhes;
