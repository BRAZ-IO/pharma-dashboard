import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import PDVVendas from './PDVVendas';
import PDVRelatorios from './PDVRelatorios';
import './PDV.css';

const PDV = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/app/pdv' || location.pathname === '/app/pdv/';
  
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showEstornoModal, setShowEstornoModal] = useState(false);
  const [vendaIdEstorno, setVendaIdEstorno] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [newClient, setNewClient] = useState({
    nome: '',
    tipo: 'cpf',
    cpf_cnpj: '',
    telefone: '',
    email: ''
  });

  // Carregar produtos do backend
  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Buscar produtos em uma única requisição
      const response = await api.get('/produtos');
      setProducts(response.data.produtos || []);
      setError('');
      
      // Carregar clientes
      try {
        const clientsResponse = await api.get('/clientes?limit=100');
        setClients(clientsResponse.data.clientes || []);
      } catch (clientError) {
        console.warn('Não foi possível carregar clientes:', clientError);
        setClients([]);
      }
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
    // Verificação mais robusta de estoque
    const estoqueAtual = parseInt(product.estoque_atual || 0);
    
    if (estoqueAtual <= 0) {
      window.alert('Produto sem estoque disponível!');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const novaQuantidade = existingItem.quantity + 1;
      if (novaQuantidade > estoqueAtual) {
        window.alert(`Estoque insuficiente! Disponível: ${estoqueAtual} unidades`);
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: novaQuantidade }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1
      }]);
    }
    
    // Feedback visual ao escanear
    setScanFeedback(true);
    setTimeout(() => setScanFeedback(false), 500);
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
        window.alert('Produto não encontrado!');
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
    const estoqueAtual = parseInt(product.estoque_atual || 0);
    
    if (quantity > estoqueAtual) {
      window.alert(`Estoque insuficiente! Disponível: ${estoqueAtual} unidades`);
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
      window.alert('Carrinho vazio!');
      return;
    }

    // Gerar ID da venda e mostrar confirmação direta
    const newSaleId = `VND-${Date.now()}`;
    const clientName = selectedClient ? selectedClient.nome : 'Consumidor Final';
    
    // Usar window.confirm para evitar ESLint error
    const confirmed = window.confirm(
      `Confirmar venda para ${clientName}?\n\nValor: ${formatCurrency(total)}`
    );
    
    if (confirmed) {
      // Simular processamento
      setTimeout(() => {
        setCart([]);
        setSelectedClient(null); // Limpar cliente após venda
        
        // Mostrar mensagem simples de sucesso
        window.alert(
          `✅ Venda concluída com sucesso!\n\nID: ${newSaleId}\nCliente: ${clientName}\nValor: ${formatCurrency(total)}`
        );
      }, 500);
    }
  };

  const handleCancelSale = () => {
    if (cart.length === 0) {
      window.alert('Não há venda em andamento para cancelar!');
      return;
    }

    const confirmed = window.confirm(
      `Deseja cancelar a venda atual?\n\n${cart.length} itens no carrinho\nValor: ${formatCurrency(total)}`
    );
    
    if (confirmed) {
      // Limpar tudo
      setCart([]);
      setSelectedClient(null);
      setBarcodeInput('');
      setSearchTerm('');
      
      window.alert('❌ Venda cancelada com sucesso!');
    }
  };

  const handleEstorno = () => {
    const vendaId = prompt('Digite o ID da venda para estornar:');
    if (!vendaId) return;

    setVendaIdEstorno(vendaId);
    setShowEstornoModal(true);
  };

  const confirmarEstorno = async () => {
    try {
      const response = await api.post(`/vendas/${vendaIdEstorno}/estornar`);
      window.alert('✅ Estorno realizado com sucesso!');
      setShowEstornoModal(false);
      setVendaIdEstorno('');
    } catch (error) {
      window.alert('❌ Erro ao realizar estorno: ' + (error.response?.data?.error || 'Tente novamente'));
    }
  };

  const handleAbrirCaixa = () => {
    const valor = prompt('Digite o valor inicial do caixa:');
    if (valor && !isNaN(valor)) {
      window.alert(`✅ Caixa aberto com R$ ${parseFloat(valor).toFixed(2)}`);
    }
  };

  const handleFecharCaixa = () => {
    const confirmed = window.confirm('Deseja fechar o caixa? Isso irá gerar o relatório do dia.');
    if (confirmed) {
      window.alert('✅ Caixa fechado com sucesso! Relatório gerado.');
    }
  };

  const handleSangria = () => {
    const valor = prompt('Digite o valor da sangria (retirada):');
    const motivo = prompt('Digite o motivo da sangria:');
    if (valor && motivo && !isNaN(valor)) {
      window.alert(`✅ Sangria de R$ ${parseFloat(valor).toFixed(2)} registrada: ${motivo}`);
    }
  };

  const handleSuprimento = () => {
    const valor = prompt('Digite o valor do suprimento (entrada):');
    const motivo = prompt('Digite o motivo do suprimento:');
    if (valor && motivo && !isNaN(valor)) {
      window.alert(`✅ Suprimento de R$ ${parseFloat(valor).toFixed(2)} registrado: ${motivo}`);
    }
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

  // Funções de cliente
  const selectClient = (client) => {
    setSelectedClient(client);
    setShowClientModal(false);
    setClientSearch('');
  };

  const clearClient = () => {
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(client => 
    client.nome?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.cpf?.includes(clientSearch) ||
    client.cnpj?.includes(clientSearch)
  );

  // Funções de cadastro de cliente
  const handleNewClientChange = (field, value) => {
    setNewClient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateClient = async () => {
    if (!newClient.nome.trim()) {
      window.alert('Nome do cliente é obrigatório!');
      return;
    }

    if (!newClient.cpf_cnpj.trim()) {
      window.alert('CPF ou CNPJ é obrigatório!');
      return;
    }

    try {
      const clientData = {
        nome: newClient.nome,
        telefone: newClient.telefone || undefined,
        email: newClient.email || undefined
      };

      // Adicionar CPF ou CNPJ conforme o tipo
      if (newClient.tipo === 'cpf') {
        clientData.cpf = newClient.cpf_cnpj.replace(/\D/g, '');
      } else {
        clientData.cnpj = newClient.cpf_cnpj.replace(/\D/g, '');
      }

      const response = await api.post('/clientes', clientData);
      
      // Adicionar novo cliente à lista
      setClients(prev => [...prev, response.data]);
      
      // Selecionar o novo cliente
      selectClient(response.data);
      
      // Limpar formulário e fechar modal
      setNewClient({
        nome: '',
        tipo: 'cpf',
        cpf_cnpj: '',
        telefone: '',
        email: ''
      });
      setShowNewClientModal(false);
      
      window.alert('✅ Cliente cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      window.alert(error.response?.data?.erro || 'Erro ao cadastrar cliente');
    }
  };

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

  return (
    <div className="pdv-page">
      <div className="pdv-header">
        <div className="header-left">
          <h1>Ponto de Venda</h1>
        </div>
        <div className="header-right">
          <div className="pdv-nav">
            <Link to="/app/pdv" className="nav-link">Vendas</Link>
            <Link to="/app/pdv/vendas" className="nav-link">Histórico</Link>
            <Link to="/app/pdv/relatorios" className="nav-link">Relatórios</Link>
          </div>
          <div className="actions-menu">
            <button 
              className="btn-actions"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
            >
              ⚙️ Ações
            </button>
            {showActionsMenu && (
              <div className="actions-dropdown">
                <button className="action-item" onClick={handleEstorno}>
                  💰 Estornar Venda
                </button>
                <button className="action-item" onClick={handleAbrirCaixa}>
                  📊 Abrir Caixa
                </button>
                <button className="action-item" onClick={handleFecharCaixa}>
                  📋 Fechar Caixa
                </button>
                <button className="action-item" onClick={handleSangria}>
                  💸 Sangria
                </button>
                <button className="action-item" onClick={handleSuprimento}>
                  💵 Suprimento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isMainPage ? (
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
                  {scanFeedback && (
                    <div className="scan-feedback">
                      <span className="scan-success">✓</span>
                      <span>Produto adicionado ao carrinho!</span>
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
                        disabled={parseInt(product.estoque_atual || 0) <= 0}
                      >
                        {parseInt(product.estoque_atual || 0) <= 0 ? 'Sem Estoque' : 'Adicionar'}
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

            {/* Carrinho de Compras */}
            <div className="cart-section">
              {/* Área do Cliente no Carrinho */}
              <div className="client-area">
                <div className="client-header">
                  <h3>👤 Cliente</h3>
                  <button 
                    className="btn-edit-client" 
                    onClick={() => setShowClientModal(true)}
                  >
                    ✏️
                  </button>
                </div>
                <div className="client-display">
                  {selectedClient ? (
                    <div className="client-details">
                      <p className="client-name">{selectedClient.nome}</p>
                      <p className="client-doc">{selectedClient.cpf || selectedClient.cnpj}</p>
                      {selectedClient.telefone && (
                        <p className="client-phone">📞 {selectedClient.telefone}</p>
                      )}
                    </div>
                  ) : (
                    <div className="client-empty">
                      <p>Consumidor Final</p>
                      <div className="client-actions">
                        <button 
                          className="btn-select" 
                          onClick={() => setShowClientModal(true)}
                        >
                          Selecionar Cliente
                        </button>
                        <button 
                          className="btn-new" 
                          onClick={() => setShowNewClientModal(true)}
                        >
                          + Novo Cliente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="cart-header">
                <h2>Carrinho</h2>
                <div className="cart-summary">
                  <span>{cart.length} itens</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              
              <div className="cart-items">
                {cart.length === 0 ? (
                  <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>
                    <h3>Carrinho vazio</h3>
                    <p>Adicione produtos para começar</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <div className="cart-item-name">
                          <span>{item.nome}</span>
                        </div>
                        <div className="cart-item-price">
                          <span>{formatCurrency(item.preco_venda)}</span>
                        </div>
                      </div>
                      <div className="cart-item-quantity">
                        <button 
                          className="btn-quantity"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
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
                <div className="cart-actions">
                  <button 
                    className="btn-cancel"
                    onClick={handleCancelSale}
                    disabled={cart.length === 0}
                  >
                    ❌ Cancelar Venda
                  </button>
                  <button 
                    className="btn-checkout"
                    onClick={handlePayment}
                    disabled={cart.length === 0}
                  >
                    💰 Finalizar Venda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal de Seleção de Cliente */}
      {showClientModal && (
        <div className="modal-overlay">
          <div className="modal-content client-modal">
            <div className="modal-header">
              <h2>Selecionar Cliente</h2>
              <button className="btn-close-modal" onClick={() => setShowClientModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="search-client">
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF ou CNPJ..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </div>
              
              <div className="clients-list">
                {filteredClients.length === 0 ? (
                  <div className="no-clients">
                    <p>Nenhum cliente encontrado</p>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setShowClientModal(false);
                        setShowNewClientModal(true);
                      }}
                    >
                      Cadastrar Novo Cliente
                    </button>
                  </div>
                ) : (
                  filteredClients.map(client => (
                    <div key={client.id} className="client-item" onClick={() => selectClient(client)}>
                      <div className="client-item-info">
                        <h4>{client.nome}</h4>
                        <p>{client.cpf || client.cnpj || 'Sem documento'}</p>
                        {client.telefone && <p>📞 {client.telefone}</p>}
                      </div>
                      <div className="client-item-action">
                        <button className="btn-select">Selecionar</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowClientModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Cliente */}
      {showNewClientModal && (
        <div className="modal-overlay">
          <div className="modal-content client-modal">
            <div className="modal-header">
              <h2>Cadastrar Novo Cliente</h2>
              <button className="btn-close-modal" onClick={() => setShowNewClientModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <form className="new-client-form">
                <div className="form-group">
                  <label>Nome *</label>
                  <input 
                    type="text" 
                    placeholder="Nome completo" 
                    value={newClient.nome}
                    onChange={(e) => handleNewClientChange('nome', e.target.value)}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    value={newClient.tipo}
                    onChange={(e) => handleNewClientChange('tipo', e.target.value)}
                  >
                    <option value="cpf">Pessoa Física (CPF)</option>
                    <option value="cnpj">Pessoa Jurídica (CNPJ)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>{newClient.tipo === 'cpf' ? 'CPF *' : 'CNPJ *'}</label>
                  <input 
                    type="text" 
                    placeholder={newClient.tipo === 'cpf' ? 'Digite o CPF' : 'Digite o CNPJ'}
                    value={newClient.cpf_cnpj}
                    onChange={(e) => handleNewClientChange('cpf_cnpj', e.target.value)}
                    maxLength={newClient.tipo === 'cpf' ? 14 : 18}
                  />
                </div>
                
                <div className="form-group">
                  <label>Telefone</label>
                  <input 
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    value={newClient.telefone}
                    onChange={(e) => handleNewClientChange('telefone', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="cliente@exemplo.com"
                    value={newClient.email}
                    onChange={(e) => handleNewClientChange('email', e.target.value)}
                  />
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowNewClientModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn-primary"
                onClick={handleCreateClient}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Estorno */}
      {showEstornoModal && (
        <div className="modal-overlay">
          <div className="modal-content estorno-modal">
            <div className="modal-header">
              <h2>Estornar Venda</h2>
              <button className="btn-close-modal" onClick={() => setShowEstornoModal(false)}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="estorno-info">
                <p><strong>ID da Venda:</strong> {vendaIdEstorno}</p>
                <p>Tem certeza que deseja estornar esta venda?</p>
                <p className="estorno-warning">⚠️ Isso irá devolver os produtos ao estoque e cancelar a venda.</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEstornoModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn-danger"
                onClick={confirmarEstorno}
              >
                💰 Confirmar Estorno
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rotas aninhadas */}
      <Routes>
        <Route path="vendas" element={<PDVVendas />} />
        <Route path="relatorios" element={<PDVRelatorios />} />
      </Routes>
    </div>
  );
};

export default PDV;
