import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaArrowLeft, FaMoneyBillWave, FaCreditCard as FaCard, FaQrcode, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './PDV.css';

const PDVPagamento = () => {
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('dinheiro');
  const [valorRecebido, setValorRecebido] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Carregar dados do localStorage
    const carrinhoSalvo = localStorage.getItem('pdv_carrinho');
    const clienteSalvo = localStorage.getItem('pdv_cliente');
    
    if (carrinhoSalvo) {
      try {
        setCarrinho(JSON.parse(carrinhoSalvo));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        navigate('/app/pdv');
      }
    } else {
      navigate('/app/pdv');
    }

    if (clienteSalvo) {
      try {
        setCliente(JSON.parse(clienteSalvo));
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
      }
    } else {
      // Se não tiver cliente, volta para selecionar
      navigate('/app/pdv/cliente');
    }
  }, [navigate]);

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

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      setErro('Carrinho vazio');
      return;
    }

    if (!cliente) {
      setErro('Cliente não selecionado');
      return;
    }

    // Verificar se usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Usuário não autenticado. Faça login novamente.');
      return;
    }

    const total = calcularTotal();
    const recebido = parseFloat(valorRecebido) || 0;

    if (metodoPagamento === 'dinheiro' && recebido < total) {
      const mensagem = `Valor recebido insuficiente! Faltam R$ ${(total - recebido).toFixed(2)}`;
      setErro(mensagem);
      return;
    }

    setLoading(true);
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
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        cliente_cpf: cliente.cpf || null
      };

      const response = await api.post('/vendas', vendaData);
      
      if (response.data) {
        // Limpar localStorage
        localStorage.removeItem('pdv_carrinho');
        localStorage.removeItem('pdv_cliente');
        
        alert('Venda finalizada com sucesso!');
        navigate('/app/pdv');
      }
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
      setErro('Erro ao finalizar venda: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const voltarParaCarrinho = () => {
    // Salvar dados no localStorage antes de voltar
    localStorage.setItem('pdv_carrinho', JSON.stringify(carrinho));
    if (cliente) {
      localStorage.setItem('pdv_cliente', JSON.stringify(cliente));
    }
    navigate('/app/pdv');
  };

  const alterarCliente = () => {
    // Salvar carrinho antes de ir para clientes
    localStorage.setItem('pdv_carrinho', JSON.stringify(carrinho));
    navigate('/app/pdv/cliente');
  };

  const total = calcularTotal();

  return (
    <div className="pdv-content">
      <div className="pdv-pagamento-container">
        <div className="pagamento-header">
          <button className="back-btn" onClick={voltarParaCarrinho}>
            <FaArrowLeft /> Voltar ao Carrinho
          </button>
          <h1><FaCreditCard /> Finalizar Pagamento</h1>
        </div>

        <div className="pagamento-content">
          {/* Resumo do Pedido */}
          <div className="resumo-pedido">
            <h2>Resumo do Pedido</h2>
            
            <div className="cliente-info">
              <h3><FaUser /> Cliente</h3>
              <div className="cliente-detalhes">
                <span className="cliente-nome">{cliente?.nome}</span>
                {cliente?.cpf && <span className="cliente-cpf">CPF: {cliente.cpf}</span>}
                <button className="alterar-cliente-btn" onClick={alterarCliente}>
                  Alterar Cliente
                </button>
              </div>
            </div>

            <div className="itens-resumo">
              <h3>Itens ({carrinho.length})</h3>
              <div className="itens-list">
                {carrinho.map(item => (
                  <div key={item.id} className="item-resumo">
                    <div className="item-info">
                      <span className="item-nome">{item.quantidade}x {item.nome}</span>
                      <span className="item-preco">{formatCurrency(item.preco * item.quantidade)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="total-resumo">
              <div className="total-linha">
                <span>Subtotal:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="total-linha final">
                <span>Total:</span>
                <span className="total-valor">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="formas-pagamento">
            <h2>Forma de Pagamento</h2>
            
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
                  <FaCard />
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
              <div className="payment-input">
                <label>Valor Recebido:</label>
                <input
                  type="number"
                  value={valorRecebido}
                  onChange={(e) => setValorRecebido(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  className="valor-input"
                />
                {parseFloat(valorRecebido) > 0 && (
                  <div className="troco-info">
                    <span className="troco-label">Troco:</span>
                    <span className="troco-valor">{formatCurrency(calcularTroco())}</span>
                  </div>
                )}
              </div>
            )}

            {metodoPagamento === 'cartao' && (
              <div className="cartao-info">
                <p>Insira ou passe o cartão na máquina</p>
              </div>
            )}

            {metodoPagamento === 'pix' && (
              <div className="pix-info">
                <p>Escaneie o QR Code ou copie a chave PIX</p>
              </div>
            )}

            {erro && <div className="error-message">{erro}</div>}

            <button 
              onClick={finalizarVenda}
              disabled={loading || (metodoPagamento === 'dinheiro' && parseFloat(valorRecebido) < total)}
              className="finalizar-pagamento-btn"
            >
              <FaCreditCard />
              {loading ? 'Processando...' : `Finalizar Pagamento - ${formatCurrency(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDVPagamento;
