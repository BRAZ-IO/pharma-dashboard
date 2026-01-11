import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaBarcode, FaCamera, FaQrcode, FaSearch, FaPlus, FaMinus, FaTrash, FaUser, FaTimes, FaCheck, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PDV.css';

const PDVVenda = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [produtoBusca, setProdutoBusca] = useState('');
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  
  // Estados para o fluxo integrado no carrinho
  const [fluxoAtual, setFluxoAtual] = useState('carrinho'); // carrinho, cliente, pagamento, finalizacao
  const [metodoPagamento, setMetodoPagamento] = useState('dinheiro');
  const [valorRecebido, setValorRecebido] = useState('');
  const [loadingPagamento, setLoadingPagamento] = useState(false);
  
  // Estados para busca/cadastro de cliente
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: ''
  });
  const [mostrarFormNovoCliente, setMostrarFormNovoCliente] = useState(false);
  const [mostrarListaProdutos, setMostrarListaProdutos] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    carregarProdutos();
    // Verificar autenticação ao carregar o componente
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Usuário não autenticado. Por favor, faça login para acessar o PDV.');
    }

    // Carregar cliente selecionado do localStorage
    const clienteSalvo = localStorage.getItem('pdv_cliente');
    if (clienteSalvo) {
      try {
        setCliente(JSON.parse(clienteSalvo));
        localStorage.removeItem('pdv_cliente'); // Limpar após carregar
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const carregarProdutos = async () => {
    setLoadingProdutos(true);
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data.produtos || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      if (error.response?.status === 401) {
        setErro('Usuário não autenticado. Faça login novamente.');
      } else {
        setErro('Erro ao carregar lista de produtos');
      }
    } finally {
      setLoadingProdutos(false);
    }
  };

  const carregarClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data.clientes || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const buscarClientes = async () => {
    if (!buscaCliente.trim()) {
      carregarClientes();
      return;
    }

    setLoadingClientes(true);
    try {
      const response = await api.get(`/clientes?busca=${encodeURIComponent(buscaCliente)}`);
      setClientes(response.data.clientes || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const registrarNovoCliente = async () => {
    if (!novoCliente.nome.trim()) {
      setErro('Nome do cliente é obrigatório');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await api.post('/clientes', {
        nome: novoCliente.nome,
        cpf: novoCliente.cpf || null,
        telefone: novoCliente.telefone || null,
        email: novoCliente.email || null
      });

      const clienteRegistrado = response.data;
      setCliente(clienteRegistrado);
      setNovoCliente({ nome: '', cpf: '', telefone: '', email: '' });
      setMostrarFormNovoCliente(false);
      setClientes([]);
      setFluxoAtual('carrinho');
      alert('Cliente registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar cliente:', error);
      setErro('Erro ao registrar cliente: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const selecionarCliente = (clienteSelecionado) => {
    setCliente(clienteSelecionado);
    setFluxoAtual('carrinho');
    setBuscaCliente('');
  };

  const limparCliente = () => {
    setCliente(null);
    setBuscaCliente('');
  };

  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(produtoBusca.toLowerCase()) ||
    produto.codigo_barras?.includes(produtoBusca) ||
    produto.descricao?.toLowerCase().includes(produtoBusca.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const calcularTroco = () => {
    const total = calcularTotal();
    const recebido = parseFloat(valorRecebido) || 0;
    return recebido - total;
  };

  const buscarProduto = async () => {
    if (!produtoBusca.trim()) return;

    setLoading(true);
    setErro('');
    
    try {
      // Buscar por nome ou código de barras
      const response = await api.get(`/produtos?busca=${encodeURIComponent(produtoBusca)}`);
      const produtos = response.data.produtos || [];
      
      if (produtos.length > 0) {
        // Adicionar o primeiro produto encontrado
        adicionarAoCarrinho(produtos[0]);
        setProdutoBusca('');
      } else {
        setErro('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      if (error.response?.status === 401) {
        setErro('Usuário não autenticado. Faça login novamente.');
      } else {
        setErro('Erro ao buscar produto');
      }
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    console.log('Adicionando produto:', produto);
    console.log('Estoque atual:', produto.estoque);
    
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      
      if (itemExistente) {
        console.log('Produto já existe no carrinho, aumentando quantidade');
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      console.log('Novo produto adicionado ao carrinho');
      return [...prev, {
        id: produto.id,
        nome: produto.nome,
        preco: parseFloat(produto.preco_venda || produto.preco || 0),
        codigo_barras: produto.codigo_barras,
        quantidade: 1,
        estoque: produto.estoque_atual || 0
      }];
    });
  };

  // Funções para o fluxo integrado
  const irParaCliente = () => {
    setFluxoAtual('cliente');
    carregarClientes();
  };

  const irParaPagamento = () => {
    if (!cliente) {
      setErro('É necessário selecionar um cliente para continuar');
      setTimeout(() => {
        setFluxoAtual('cliente');
      }, 2000);
      return;
    }
    setFluxoAtual('pagamento');
  };

  const voltarParaCarrinho = () => {
    setFluxoAtual('carrinho');
  };

  const irParaRegistroCliente = () => {
    setMostrarFormNovoCliente(true);
  };

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      setErro('Carrinho vazio');
      return;
    }

    // Verificar se usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Usuário não autenticado. Faça login novamente.');
      alert('Usuário não autenticado. Faça login novamente.');
      return;
    }

    const total = calcularTotal();
    const recebido = parseFloat(valorRecebido) || 0;

    if (metodoPagamento === 'dinheiro' && recebido < total) {
      const mensagem = `Valor recebido insuficiente! Faltam R$ ${(total - recebido).toFixed(2)}`;
      setErro(mensagem);
      alert(mensagem);
      return;
    }

    setLoadingPagamento(true);
    setErro('');

    try {
      const vendaData = {
        items: carrinho.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade,
          preco_unitario: item.preco,
          subtotal: item.preco * item.quantidade
        })),
        forma_pagamento: metodoPagamento,
        total: total,
        subtotal: total,
        cliente_id: cliente?.id || null,
        cliente_nome: cliente?.nome || 'Consumidor Final',
        cliente_cpf: cliente?.cpf || null
      };

      console.log('Enviando dados para /vendas:', vendaData);
      console.log('URL completa:', api.defaults.baseURL + '/vendas');
      const response = await api.post('/vendas', vendaData);
      
      if (response.data) {
        setCarrinho([]);
        setValorRecebido('');
        setCliente(null);
        setFluxoAtual('carrinho');
        alert('Venda finalizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
      setErro('Erro ao finalizar venda: ' + errorMessage);
      alert('Erro ao finalizar venda: ' + errorMessage);
    } finally {
      setLoadingPagamento(false);
    }
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }
    
    setCarrinho(prev => prev.map(item =>
      item.id === id
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  const iniciarScanner = () => {
    setScannerAtivo(true);
    setShowCamera(true);
    // Em produção, aqui você iniciaria a câmera do dispositivo
  };

  const pararScanner = () => {
    setScannerAtivo(false);
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const capturarCodigoBarras = async () => {
    // Simulação de leitura de código de barras
    // Em produção, você usaria uma biblioteca como quagga.js ou zxing
    const codigoSimulado = '7891234567890'; // Código de exemplo
    
    try {
      const response = await api.get(`/produtos?codigo_barras=${codigoSimulado}`);
      const produtos = response.data.produtos || [];
      
      if (produtos.length > 0) {
        adicionarAoCarrinho(produtos[0]);
        pararScanner();
      } else {
        setErro('Produto não encontrado para este código de barras');
      }
    } catch (error) {
      console.error('Erro ao buscar produto por código:', error);
      setErro('Erro ao buscar produto');
    }
  };

  return (
    <div className="pdv-content">
      {/* Verificação de autenticação */}
      {!localStorage.getItem('token') && (
        <div className="auth-warning">
          <div className="auth-warning-content">
            <h3>⚠️ Autenticação Necessária</h3>
            <p>Você precisa estar logado para usar o PDV.</p>
            <button onClick={() => window.location.href = '/login'}>
              Fazer Login
            </button>
          </div>
        </div>
      )}
      
      <div className="pdv-main">
        <div className="pdv-left">
          <div className="scanner-section">
            <div className="scanner-header">
              <h3><FaBarcode /> Leitor de Código</h3>
              <div className="scanner-controls">
                {!scannerAtivo ? (
                  <button 
                    onClick={iniciarScanner}
                    className="scanner-btn"
                  >
                    <FaCamera /> Iniciar Scanner
                  </button>
                ) : (
                  <button 
                    onClick={pararScanner}
                    className="scanner-btn stop"
                  >
                    <FaTimes /> Parar Scanner
                  </button>
                )}
              </div>
            </div>

            {scannerAtivo && (
              <div className="scanner-active">
                {showCamera ? (
                  <div className="camera-view">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="camera-feed"
                    />
                    <div className="scanner-overlay">
                      <div className="scan-line"></div>
                    </div>
                    <button 
                      onClick={capturarCodigoBarras}
                      className="capture-btn"
                    >
                      <FaCamera /> Capturar Código
                    </button>
                  </div>
                ) : (
                  <div className="scanner-placeholder">
                    <FaQrcode />
                    <p>Posicione o código de barras na câmera</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="search-section">
            <div className="search-header">
              <h3><FaSearch /> Buscar Produto</h3>
            </div>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Digite o nome ou código de barras..."
                value={produtoBusca}
                onChange={(e) => setProdutoBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarProduto()}
                className="search-input"
              />
              <button 
                onClick={buscarProduto}
                disabled={loading}
                className="search-btn"
              >
                <FaSearch />
              </button>
            </div>
            {erro && <div className="error-message">{erro}</div>}
          </div>

          <div className="products-list-section">
            <div className="products-list-header">
              <h3><FaShoppingCart /> Lista de Produtos</h3>
              <button 
                className="toggle-products-btn"
                onClick={() => setMostrarListaProdutos(!mostrarListaProdutos)}
              >
                {mostrarListaProdutos ? 'Ocultar' : 'Mostrar'} Produtos
              </button>
            </div>

            {mostrarListaProdutos && (
              <div className="products-list-container">
                {loadingProdutos ? (
                  <div className="loading-products">
                    <div className="loading-spinner"></div>
                    <p>Carregando produtos...</p>
                  </div>
                ) : (
                  <div className="products-grid">
                    {produtosFiltrados.length === 0 ? (
                      <div className="no-products">
                        <p>Nenhum produto encontrado</p>
                      </div>
                    ) : (
                      produtosFiltrados.slice(0, 12).map(produto => (
                        <div 
                          key={produto.id} 
                          className="product-card"
                          onClick={() => (produto.estoque_atual || 0) > 0 && adicionarAoCarrinho(produto)}
                        >
                          <div className="product-image">
                            {produto.imagem ? (
                              <img src={produto.imagem} alt={produto.nome} />
                            ) : (
                              <div className="product-placeholder">
                                <FaShoppingCart />
                              </div>
                            )}
                          </div>
                          <div className="product-info">
                            <div className="product-name">{produto.nome}</div>
                            <div className="product-price">
                              {formatCurrency(parseFloat(produto.preco_venda || produto.preco || 0))}
                            </div>
                            <div className={`product-stock ${
                              (produto.estoque_atual || 0) === 0 ? 'out-of-stock' : 
                              (produto.estoque_atual || 0) <= 5 ? 'low-stock' : ''
                            }`}>
                              Estoque: {produto.estoque_atual || 0}
                            </div>
                          </div>
                          <button 
                            className={`add-product-btn ${(produto.estoque_atual || 0) === 0 ? 'disabled' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if ((produto.estoque_atual || 0) > 0) {
                                adicionarAoCarrinho(produto);
                              }
                            }}
                            disabled={(produto.estoque_atual || 0) === 0}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pdv-right">
          <div className="cart-section">
            {/* Header dinâmico baseado no fluxo */}
            <div className="cart-header">
              {fluxoAtual === 'carrinho' && (
                <>
                  <h3><FaShoppingCart /> Carrinho</h3>
                  <div className="cart-total">
                    Total: {formatCurrency(calcularTotal())}
                  </div>
                </>
              )}
              {fluxoAtual === 'cliente' && (
                <>
                  <h3><FaUser /> Selecionar Cliente</h3>
                  <button className="back-btn" onClick={voltarParaCarrinho}>
                    <FaTimes /> Voltar
                  </button>
                </>
              )}
              {fluxoAtual === 'pagamento' && (
                <>
                  <h3><FaCreditCard /> Pagamento</h3>
                  <button className="back-btn" onClick={voltarParaCarrinho}>
                    <FaTimes /> Voltar
                  </button>
                </>
              )}
            </div>

            {/* Conteúdo dinâmico baseado no fluxo */}
            <div className="cart-content">
              {fluxoAtual === 'carrinho' && (
                <>
                  {/* Seção de Cliente Selecionado */}
                  {cliente && (
                    <div className="selected-client-section">
                      <div className="client-header">
                        <h4><FaUser /> Cliente Selecionado</h4>
                        <button 
                          className="change-client-btn"
                          onClick={irParaCliente}
                        >
                          <FaTimes /> Alterar
                        </button>
                      </div>
                      <div className="client-info-display">
                        <div className="client-details">
                          <span className="client-name">{cliente.nome}</span>
                          {cliente.cpf && <span className="client-cpf">CPF: {cliente.cpf}</span>}
                          {cliente.telefone && <span className="client-phone">{cliente.telefone}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="cart-items">
                    {carrinho.length === 0 ? (
                      <div className="empty-cart">
                        <FaShoppingCart />
                        <p>Carrinho vazio</p>
                      </div>
                    ) : (
                      carrinho.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="item-info">
                            <div className="item-name">{item.nome}</div>
                            <div className="item-price">{formatCurrency(item.preco)}</div>
                          </div>
                          <div className="item-quantity">
                            <button 
                              onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                              className="quantity-btn"
                            >
                              <FaMinus />
                            </button>
                            <span>{item.quantidade}</span>
                            <button 
                              onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                              className="quantity-btn"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <div className="item-total">
                            {formatCurrency(item.preco * item.quantidade)}
                          </div>
                          <button 
                            onClick={() => removerDoCarrinho(item.id)}
                            className="remove-btn"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="action-buttons-section">
                    <button 
                      className="action-btn cliente-btn"
                      onClick={irParaCliente}
                    >
                      <FaUser />
                      <div className="btn-content">
                        <div className="btn-title">
                          {cliente ? 'Alterar Cliente' : 'Selecionar Cliente'}
                        </div>
                        <div className="btn-subtitle">
                          {cliente ? cliente.nome : 'Escolher cliente'}
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      className="action-btn pagamento-btn"
                      onClick={irParaPagamento}
                      disabled={carrinho.length === 0}
                    >
                      <FaCreditCard />
                      <div className="btn-content">
                        <div className="btn-title">Pagamento</div>
                        <div className="btn-subtitle">
                          {formatCurrency(calcularTotal())}
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {fluxoAtual === 'cliente' && (
                <div className="cliente-selection-content">
                  <div className="client-search">
                    <div className="search-input-group">
                      <input
                        type="text"
                        placeholder="Buscar cliente por nome ou CPF..."
                        value={buscaCliente}
                        onChange={(e) => setBuscaCliente(e.target.value)}
                        className="search-input"
                      />
                      <button 
                        onClick={buscarClientes}
                        disabled={loadingClientes}
                        className="search-btn"
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>

                  {!mostrarFormNovoCliente ? (
                    <>
                      <div className="client-list">
                        <h5>Clientes Encontrados</h5>
                        {loadingClientes ? (
                          <div className="loading-clients">
                            <div className="loading-spinner"></div>
                            <p>Buscando clientes...</p>
                          </div>
                        ) : clientes.length === 0 ? (
                          <div className="no-clients">
                            <p>Nenhum cliente encontrado</p>
                          </div>
                        ) : (
                          clientes.map(clienteItem => (
                            <div 
                              key={clienteItem.id} 
                              className="client-item"
                              onClick={() => selecionarCliente(clienteItem)}
                            >
                              <div className="client-item-info">
                                <div className="client-item-name">{clienteItem.nome}</div>
                                {clienteItem.cpf && (
                                  <div className="client-item-cpf">CPF: {clienteItem.cpf}</div>
                                )}
                              </div>
                              <FaCheck className="select-icon" />
                            </div>
                          ))
                        )}
                      </div>

                      <div className="divider">
                        <span>ou</span>
                      </div>

                      <button 
                        className="new-client-btn"
                        onClick={irParaRegistroCliente}
                      >
                        <FaPlus /> Cadastrar Novo Cliente
                      </button>
                    </>
                  ) : (
                    <div className="new-client-form">
                      <h4>Cadastrar Novo Cliente</h4>
                      <div className="form-group">
                        <label>Nome *</label>
                        <input
                          type="text"
                          value={novoCliente.nome}
                          onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                          className="form-input"
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="form-group">
                        <label>CPF</label>
                        <input
                          type="text"
                          value={novoCliente.cpf}
                          onChange={(e) => setNovoCliente({...novoCliente, cpf: e.target.value})}
                          className="form-input"
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div className="form-group">
                        <label>Telefone</label>
                        <input
                          type="text"
                          value={novoCliente.telefone}
                          onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                          className="form-input"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={novoCliente.email}
                          onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                          className="form-input"
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div className="form-buttons">
                        <button 
                          className="cancel-btn"
                          onClick={() => setMostrarFormNovoCliente(false)}
                        >
                          <FaTimes /> Cancelar
                        </button>
                        <button 
                          className="register-client-btn"
                          onClick={registrarNovoCliente}
                          disabled={loading}
                        >
                          <FaCheck /> Cadastrar Cliente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {fluxoAtual === 'pagamento' && (
                <div className="pagamento-content">
                  <div className="resumo-cliente">
                    <h4>Cliente</h4>
                    <div className="cliente-info-modal">
                      <div>
                        <div className="cliente-nome">{cliente?.nome || 'Consumidor Final'}</div>
                        {cliente?.cpf && (
                          <div className="cliente-cpf">CPF: {cliente.cpf}</div>
                        )}
                      </div>
                      <button 
                        className="alterar-cliente-btn"
                        onClick={irParaCliente}
                      >
                        Alterar
                      </button>
                    </div>
                  </div>

                  <div className="resumo-itens">
                    <h4>Itens da Venda</h4>
                    <div className="itens-list">
                      {carrinho.map(item => (
                        <div key={item.id} className="item-resumo">
                          <div className="item-info">
                            <div className="item-nome">{item.nome}</div>
                            <div className="item-preco">
                              {item.quantidade}x {formatCurrency(item.preco)}
                            </div>
                          </div>
                          <div className="item-preco">
                            {formatCurrency(item.preco * item.quantidade)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="resumo-total">
                    <div className="total-linha">
                      <span>Total:</span>
                      <span className="total-valor">{formatCurrency(calcularTotal())}</span>
                    </div>
                  </div>

                  <div className="formas-pagamento-modal">
                    <h4>Forma de Pagamento</h4>
                    <div className="payment-methods">
                      <label className={`payment-method ${metodoPagamento === 'dinheiro' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          value="dinheiro"
                          checked={metodoPagamento === 'dinheiro'}
                          onChange={(e) => setMetodoPagamento(e.target.value)}
                        />
                        <div className="method-content">
                          <FaMoneyBillWave />
                          <span>Dinheiro</span>
                        </div>
                      </label>
                      
                      <label className={`payment-method ${metodoPagamento === 'cartao' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          value="cartao"
                          checked={metodoPagamento === 'cartao'}
                          onChange={(e) => setMetodoPagamento(e.target.value)}
                        />
                        <div className="method-content">
                          <FaCreditCard />
                          <span>Cartão</span>
                        </div>
                      </label>
                      
                      <label className={`payment-method ${metodoPagamento === 'pix' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          value="pix"
                          checked={metodoPagamento === 'pix'}
                          onChange={(e) => setMetodoPagamento(e.target.value)}
                        />
                        <div className="method-content">
                          <FaQrcode />
                          <span>PIX</span>
                        </div>
                      </label>
                    </div>

                    {metodoPagamento === 'dinheiro' && (
                      <div className="valor-recebido">
                        <label>Valor Recebido:</label>
                        <input
                          type="number"
                          value={valorRecebido}
                          onChange={(e) => setValorRecebido(e.target.value)}
                          className="form-input"
                          placeholder="0,00"
                          step="0.01"
                        />
                        {parseFloat(valorRecebido) >= calcularTotal() && (
                          <div className="troco-info">
                            <strong>Troco: {formatCurrency(calcularTroco())}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    <button 
                      className="finalize-btn"
                      onClick={finalizarVenda}
                      disabled={loadingPagamento || (metodoPagamento === 'dinheiro' && parseFloat(valorRecebido) < calcularTotal())}
                    >
                      {loadingPagamento ? (
                        <>
                          <div className="loading-spinner"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Finalizar Venda
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDVVenda;