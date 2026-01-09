import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PDV.css';

const PDVMain = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saleId, setSaleId] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [lastScannedProduct, setLastScannedProduct] = useState(null);

  // Carregar produtos do backend
  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar produtos em uma única requisição
      const response = await api.get('/produtos');
      setProducts(response.data.produtos || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Não foi possível carregar os produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados apenas uma vez no início
    if (products.length === 0) {
      carregarDados();
    }
  }, [products.length]);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.preco_venda * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const addToCart = (product) => {
    if (!product.estoque_atual || product.estoque_atual === 0) {
      alert('Produto sem estoque!');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.estoque_atual) {
        alert('Estoque insuficiente!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1
      }]);
    }
    
    // Feedback visual ao escanear
    setLastScannedProduct(product);
    setTimeout(() => setLastScannedProduct(null), 2000);
  };

  const handleBarcodeScanner = (e) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      const product = products.find(p => p.codigo_barras === barcodeInput.trim());
      
      if (product) {
        addToCart(product);
        setBarcodeInput('');
        // Efeito sonoro ou visual de sucesso
        setScannerActive(true);
        setTimeout(() => setScannerActive(false), 300);
      } else {
        alert('Produto não encontrado!');
        setBarcodeInput('');
      }
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (quantity > product.estoque_atual) {
      alert('Estoque insuficiente!');
      return;
    }

    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento!');
      return;
    }

    // Gerar ID da venda
    const newSaleId = `VND-${Date.now()}`;
    setSaleId(newSaleId);
    
    // Simular processamento
    setTimeout(() => {
      setShowPaymentModal(false);
      setShowSuccessModal(true);
      setCart([]);
      setPaymentMethod('');
    }, 1000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo_barras?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', ...new Set(products.map(p => p.categoria || 'Sem categoria'))];

  if (loading) {
    return (
      <div className="pdv-loading">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdv-error">
        <p>{error}</p>
        <button onClick={carregarDados} className="btn-retry">
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  if (showSuccessModal) {
    return (
      <div className="pdv-page">
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Venda Concluída!</h2>
            <p>ID da Venda: <strong>{saleId}</strong></p>
            <p>Valor Total: <strong>{formatCurrency(total)}</strong></p>
            <p>Forma de Pagamento: <strong>{paymentMethod}</strong></p>
            <button className="btn-primary" onClick={() => navigate('/app/pdv')}>
              Nova Venda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdv-main-layout">
      <div className="pdv-main-grid">
        {/* Scanner de Código de Barras */}
        <div className="barcode-scanner-section">
          <div className={`scanner-container ${scannerActive ? 'scanner-active' : ''}`}>
            <div className="scanner-icon">📷</div>
            <div className="scanner-content">
              <h3>Scanner de Código de Barras</h3>
              <p className="scanner-hint">Digite ou escaneie o código de barras</p>
              <div className="scanner-input-wrapper">
                <input
                  type="text"
                  placeholder="Código de barras..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={handleBarcodeScanner}
                  className="barcode-input"
                  autoFocus
                />
                <button 
                  className="btn-scan"
                  onClick={() => handleBarcodeScanner({ key: 'Enter' })}
                >
                  Escanear
                </button>
              </div>
              {lastScannedProduct && (
                <div className="scan-feedback">
                  <span className="scan-success">✓</span>
                  <span>{lastScannedProduct.nome} adicionado!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="products-section">
          <div className="products-header">
            <h2>Produtos</h2>
            <div className="products-controls">
              <input
                type="text"
                placeholder="Buscar produto ou código de barras..."
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
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.nome}</h3>
                  <p className="product-category">{product.categoria || 'Sem categoria'}</p>
                  <p className="product-price">{formatCurrency(product.preco_venda || 0)}</p>
                  <p className="product-stock">Estoque: {product.estoque_atual || 0}</p>
                  <p className="product-barcode">{product.codigo_barras || 'Sem código'}</p>
                </div>
                <div className="product-actions">
                  <button 
                    className="btn-add-cart"
                    onClick={() => addToCart(product)}
                    disabled={!product.estoque_atual || product.estoque_atual === 0}
                  >
                    {!product.estoque_atual || product.estoque_atual === 0 ? 'Sem Estoque' : 'Adicionar'}
                  </button>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && !loading && !error && (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>Nenhum produto encontrado</h3>
                <p>
                  {searchTerm || selectedCategory !== 'Todos'
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Nenhum produto cadastrado no sistema.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Carrinho */}
        <div className="cart-section">
          <div className="cart-header">
            <h2>Carrinho</h2>
            <button 
              className="btn-clear-cart"
              onClick={() => setCart([])}
              disabled={cart.length === 0}
            >
              Limpar
            </button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Carrinho vazio</h3>
                <p>Adicione produtos para começar</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.nome}</h4>
                    <p className="cart-item-price">{formatCurrency(item.preco_venda)}</p>
                    <p className="cart-item-barcode">{item.codigo_barras || 'Sem código'}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      className="btn-quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="btn-quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <span>{formatCurrency(item.preco_venda * item.quantity)}</span>
                  </div>
                  <div className="cart-item-actions">
                    <button 
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="cart-footer">
            <div className="cart-total">
              <h3>Total: {formatCurrency(total)}</h3>
            </div>
            <button 
              className="btn-checkout"
              onClick={handlePayment}
              disabled={cart.length === 0}
            >
              Finalizar Venda
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h2>Finalizar Venda</h2>
              <button 
                className="btn-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="payment-modal-content">
              <div className="payment-summary">
                <h3>Resumo da Venda</h3>
                <div className="summary-items">
                  {cart.map(item => (
                    <div key={item.id} className="summary-item">
                      <span>{item.quantity}x {item.nome}</span>
                      <span>{formatCurrency(item.preco_venda * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <strong>Total:</strong>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>
              
              <div className="payment-methods">
                <h3>Forma de Pagamento</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="dinheiro"
                      checked={paymentMethod === 'dinheiro'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Dinheiro</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cartao"
                      checked={paymentMethod === 'cartao'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳️ Cartão</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>📱 PIX</span>
                  </label>
                </div>
              </div>
              
              <div className="payment-modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary"
                  onClick={confirmPayment}
                >
                  Confirmar Pagamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDVMain;
