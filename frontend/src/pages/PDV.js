import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import './PDV.css';

const PDV = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saleId, setSaleId] = useState('');
  const navigate = useNavigate();

  // Produtos mock
  const [products] = useState([
    { id: 1, name: 'Paracetamol 750mg', price: 12.50, stock: 45, category: 'Analgésico', barcode: '7891234567890' },
    { id: 2, name: 'Dipirona 500mg', price: 8.90, stock: 32, category: 'Analgésico', barcode: '7891234567891' },
    { id: 3, name: 'Amoxicilina 500mg', price: 15.80, stock: 28, category: 'Antibiótico', barcode: '7891234567892' },
    { id: 4, name: 'Ibuprofeno 400mg', price: 18.50, stock: 15, category: 'Anti-inflamatório', barcode: '7891234567893' },
    { id: 5, name: 'Vitamina D3', price: 35.90, stock: 22, category: 'Vitamina', barcode: '7891234567894' },
    { id: 6, name: 'Omeprazol 20mg', price: 22.30, stock: 18, category: 'Antiácido', barcode: '7891234567895' },
    { id: 7, name: 'Loratadina 10mg', price: 25.80, stock: 35, category: 'Antialérgico', barcode: '7891234567896' },
    { id: 8, name: 'Ácido Fólico 5mg', price: 28.90, stock: 12, category: 'Vitamina', barcode: '7891234567897' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const addToCart = (product) => {
    if (product.stock === 0) {
      alert('Produto sem estoque!');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Estoque insuficiente!');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
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
    if (quantity > product.stock) {
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
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', ...new Set(products.map(p => p.category))];

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
    <div className="pdv-page">
      <div className="pdv-header">
        <h1>Ponto de Venda</h1>
        <div className="pdv-nav">
          <Link to="/app/pdv" className="nav-link active">Vendas</Link>
          <Link to="/app/pdv/vendas" className="nav-link">Histórico</Link>
          <Link to="/app/pdv/relatorios" className="nav-link">Relatórios</Link>
        </div>
        <div className="pdv-actions">
          <button className="btn-secondary" onClick={() => navigate('/app/dashboard')}>
            Voltar
          </button>
        </div>
      </div>

      <div className="pdv-content">
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
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">{formatCurrency(product.price)}</p>
                  <p className="product-stock">Estoque: {product.stock}</p>
                  <p className="product-barcode">{product.barcode}</p>
                </div>
                <div className="product-actions">
                  <button 
                    className="btn-add-cart"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sem Estoque' : 'Adicionar'}
                  </button>
                </div>
              </div>
            ))}
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
              <div className="cart-empty">
                <p>Carrinho vazio</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn-quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn-quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <p>{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <button 
                    className="btn-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <h3>Total: {formatCurrency(total)}</h3>
            </div>
            <button 
              className="btn-payment"
              onClick={handlePayment}
              disabled={cart.length === 0}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-content">
            <h2>Forma de Pagamento</h2>
            <div className="payment-methods">
              <button 
                className={`payment-method-btn ${paymentMethod === 'Dinheiro' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Dinheiro')}
              >
                💵 Dinheiro
              </button>
              <button 
                className={`payment-method-btn ${paymentMethod === 'Cartão' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Cartão')}
              >
                💳 Cartão
              </button>
              <button 
                className={`payment-method-btn ${paymentMethod === 'PIX' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('PIX')}
              >
                📱 PIX
              </button>
              <button 
                className={`payment-method-btn ${paymentMethod === 'Débito' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('Débito')}
              >
                💰 Débito
              </button>
            </div>
            <div className="payment-summary">
              <h3>Total: {formatCurrency(total)}</h3>
            </div>
            <div className="payment-actions">
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
      )}
    </div>
  );
};

export default PDV;
