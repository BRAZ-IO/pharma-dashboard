import React, { useMemo, useRef, useState } from 'react';
import './PDV.css';

const PDV = () => {
  const scanInputRef = useRef(null);
  const [scanCode, setScanCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [scanUiStatus, setScanUiStatus] = useState('idle');

  const catalog = useMemo(
    () => [
      {
        id: 'prod-001',
        barcode: '7891000100101',
        name: 'Dipirona 500mg (10 comp)',
        price: 8.9,
        unit: 'cx'
      },
      {
        id: 'prod-002',
        barcode: '7891000200202',
        name: 'Paracetamol 750mg (20 comp)',
        price: 14.5,
        unit: 'cx'
      },
      {
        id: 'prod-003',
        barcode: '7891000300303',
        name: 'Amoxicilina 500mg (21 caps)',
        price: 29.9,
        unit: 'cx'
      },
      {
        id: 'prod-004',
        barcode: '7891000400404',
        name: 'Soro Fisiológico 0,9% (500ml)',
        price: 11.25,
        unit: 'un'
      },
      {
        id: 'prod-005',
        barcode: '7891000500505',
        name: 'Vitamina C 1g (10 comp eferv.)',
        price: 19.9,
        unit: 'cx'
      }
    ],
    []
  );

  const formatBRL = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const getProductByBarcode = (barcode) =>
    catalog.find((p) => p.barcode === String(barcode).trim());

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, qty: Math.min(999, i.qty + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unit: product.unit,
          price: product.price,
          qty: qty
        }
      ];
    });

    setFeedback({
      type: 'success',
      message: `Adicionado: ${product.name}`
    });

    setScanUiStatus('success');
    window.setTimeout(() => setScanUiStatus('idle'), 900);
  };

  const onScanSubmit = () => {
    const code = scanCode.trim();
    if (!code) return;

    const product = getProductByBarcode(code);
    if (!product) {
      setFeedback({
        type: 'error',
        message: `Código não encontrado: ${code}`
      });

      setScanUiStatus('error');
      window.setTimeout(() => setScanUiStatus('idle'), 1100);
      return;
    }

    addToCart(product, 1);
    setScanCode('');
    if (scanInputRef.current) scanInputRef.current.focus();
  };

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return catalog
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.barcode.includes(term)
      )
      .slice(0, 6);
  }, [catalog, searchTerm]);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.price * i.qty, 0),
    [cartItems]
  );

  const incQty = (productId) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, qty: Math.min(999, i.qty + 1) } : i
      )
    );
  };

  const decQty = (productId) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const resetSale = () => {
    setCartItems([]);
    setSearchTerm('');
    setScanCode('');
    setFeedback(null);
    if (scanInputRef.current) scanInputRef.current.focus();
  };

  return (
    <div className="pdv-page">
      <div className="page-header">
        <h1>PDV</h1>
        <p>Ponto de Venda</p>
      </div>

      <div className="pdv-grid">
        <div className="pdv-card">
          <div className="pdv-card__header">
            <div className="pdv-row pdv-row--between">
              <div>
                <h3 className="pdv-card__title">Área de Atendimento</h3>
                <p className="pdv-card__subtitle">Leitura por scanner ou busca manual</p>
              </div>
              <button className="btn-primary" onClick={resetSale}>Nova Venda</button>
            </div>
          </div>

          <div className="pdv-card__body">
            <div className="pdv-row">
              <div className="pdv-field">
                <label className="pdv-label">Aponte o scanner e pressione Enter</label>
                <div className="pdv-scan-area">
                  <div className={`pdv-scan ${scanUiStatus !== 'idle' ? `pdv-scan--${scanUiStatus}` : ''}`}>
                    <input
                      ref={scanInputRef}
                      className="pdv-input pdv-input--scan"
                      aria-label="Leitor / Código de barras"
                      value={scanCode}
                      onChange={(e) => setScanCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          onScanSubmit();
                        }
                      }}
                      placeholder=""
                      autoFocus
                    />
                  </div>
                </div>

                <span className="pdv-hint">Dica: o scanner geralmente “digita” o código e envia Enter automaticamente.</span>
              </div>

              <button
                className="btn-primary"
                style={{ height: '44px' }}
                onClick={onScanSubmit}
              >
                Adicionar
              </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="pdv-label">Busca rápida</label>
              <input
                className="pdv-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite nome ou código para buscar"
              />
              <span className="pdv-hint">Você pode adicionar clicando em um resultado.</span>

              {suggestions.length > 0 && (
                <div className="pdv-suggestions">
                  {suggestions.map((p) => (
                    <div key={p.id} className="pdv-suggestion">
                      <div className="pdv-suggestion__main">
                        <div className="pdv-suggestion__name">{p.name}</div>
                        <div className="pdv-suggestion__meta">EAN: {p.barcode} • {formatBRL(p.price)} / {p.unit}</div>
                      </div>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          addToCart(p, 1);
                          setSearchTerm('');
                          if (scanInputRef.current) scanInputRef.current.focus();
                        }}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {feedback && (
              <div className={`pdv-alert ${feedback.type === 'error' ? 'pdv-alert--error' : 'pdv-alert--success'}`}>
                {feedback.message}
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <div className="pdv-card" style={{ border: '1px solid #eef1f4', boxShadow: 'none' }}>
                <div className="pdv-card__header">
                  <h3 className="pdv-card__title">Carrinho</h3>
                  <p className="pdv-card__subtitle">Itens adicionados</p>
                </div>
                <div className="pdv-card__body" style={{ padding: 0 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="pdv-table">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Qtd</th>
                          <th>Preço</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ padding: '1rem', color: '#64748b' }}>
                              Nenhum item no carrinho. Escaneie um código ou use a busca.
                            </td>
                          </tr>
                        ) : (
                          cartItems.map((item) => (
                            <tr key={item.productId}>
                              <td>
                                <strong>{item.name}</strong>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                  {formatBRL(item.price)} / {item.unit}
                                </div>
                              </td>
                              <td>
                                <div className="pdv-qty">
                                  <button className="pdv-qty__btn" onClick={() => decQty(item.productId)}>-</button>
                                  <span className="pdv-qty__value">{item.qty}</span>
                                  <button className="pdv-qty__btn" onClick={() => incQty(item.productId)}>+</button>
                                </div>
                              </td>
                              <td>{formatBRL(item.price)}</td>
                              <td><strong>{formatBRL(item.price * item.qty)}</strong></td>
                              <td style={{ width: '1%', whiteSpace: 'nowrap' }}>
                                <button className="pdv-action-btn" onClick={() => removeItem(item.productId)}>Remover</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pdv-summary">
          <div className="pdv-card">
            <div className="pdv-card__header">
              <h3 className="pdv-card__title">Resumo</h3>
              <p className="pdv-card__subtitle">Totais da venda</p>
            </div>
            <div className="pdv-card__body">
              <div className="pdv-summary__row">
                <span className="pdv-summary__label">Itens</span>
                <strong>{cartItems.reduce((acc, i) => acc + i.qty, 0)}</strong>
              </div>
              <div className="pdv-summary__row">
                <span className="pdv-summary__label">Total</span>
                <span className="pdv-summary__value">{formatBRL(cartTotal)}</span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button className="btn-secondary" style={{ width: '100%' }}>
                  Finalizar (placeholder)
                </button>
              </div>
            </div>
          </div>

          <div className="pdv-card">
            <div className="pdv-card__header">
              <h3 className="pdv-card__title">Cliente</h3>
              <p className="pdv-card__subtitle">Selecionar cliente/convênio</p>
            </div>
            <div className="pdv-card__body">
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                Placeholder: selecionar cliente, aplicar descontos e escolher forma de pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDV;
