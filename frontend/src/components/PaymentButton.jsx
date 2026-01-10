import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import PaymentModal from './PaymentModal';

const PaymentButton = ({ 
  venda, 
  onPaymentComplete, 
  size = 'md',
  variant = 'primary',
  disabled = false
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentComplete = (paymentStatus) => {
    setShowPaymentModal(false);
    onPaymentComplete?.(paymentStatus);
  };

  const handlePaymentError = (error) => {
    console.error('Erro no pagamento:', error);
  };

  // Verificar se venda pode ser paga
  const canPay = venda && 
    ['pendente', 'aguardando_pagamento'].includes(venda.status) &&
    !disabled;

  // Status badge
  const getStatusBadge = () => {
    const statusMap = {
      'pendente': { color: 'warning', text: 'Pendente' },
      'aguardando_pagamento': { color: 'info', text: 'Aguardando' },
      'finalizada': { color: 'success', text: 'Paga' },
      'cancelada': { color: 'danger', text: 'Cancelada' }
    };

    const status = statusMap[venda?.status] || { color: 'secondary', text: venda?.status };
    
    return (
      <Badge bg={status.color} className="ms-2">
        {status.text}
      </Badge>
    );
  };

  if (!venda) {
    return null;
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowPaymentModal(true)}
        disabled={!canPay}
        className="d-flex align-items-center"
      >
        <span className="me-2">💳</span>
        Pagar
        {getStatusBadge()}
      </Button>

      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        venda={venda}
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};

export default PaymentButton;
