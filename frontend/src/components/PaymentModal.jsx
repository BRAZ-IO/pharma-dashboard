import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Button, 
  Alert, 
  Spinner, 
  Badge,
  ProgressBar,
  Card,
  Row,
  Col,
  Form
} from 'react-bootstrap';
import paymentService from '../services/paymentService';

const PaymentModal = ({ 
  show, 
  onHide, 
  venda, 
  onPaymentComplete,
  onPaymentError 
}) => {
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('simulado');
  const [selectedScenario, setSelectedScenario] = useState('default');
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Resetar estado ao abrir modal
  useEffect(() => {
    if (show) {
      setPayment(null);
      setPaymentStatus(null);
      setError('');
      setProgress(0);
      setTimeRemaining(0);
    }
  }, [show, venda]);

  // Polling para verificar status do pagamento
  useEffect(() => {
    if (payment && paymentStatus?.status === 'pendente') {
      const estimatedTime = paymentService.getEstimatedTime(selectedScenario);
      setTimeRemaining(estimatedTime);
      
      const interval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
        setProgress(prev => Math.min(100, prev + (100 / (estimatedTime || 3))));
      }, 1000);

      const checkStatus = async () => {
        try {
          const status = await paymentService.getPaymentStatus(payment.paymentId);
          setPaymentStatus(status);
          
          if (['aprovado', 'rejeitado', 'cancelado', 'timeout'].includes(status.status)) {
            clearInterval(interval);
            onPaymentComplete?.(status);
            setTimeout(() => onHide(), 2000);
          }
        } catch (error) {
          clearInterval(interval);
          setError('Erro ao verificar status do pagamento');
        }
      };

      const statusInterval = setInterval(checkStatus, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(statusInterval);
      };
    }
  }, [payment, paymentStatus, selectedScenario, onPaymentComplete, onHide]);

  // Criar pagamento
  const handleCreatePayment = async () => {
    if (!venda) return;

    setLoading(true);
    setError('');

    try {
      const paymentData = await paymentService.createPayment(venda.id, selectedMethod);
      setPayment(paymentData.payment);
      setPaymentStatus({ status: 'pendente' });
      
      // Se for simulação de cenário específico
      if (selectedScenario !== 'default') {
        await paymentService.simulateScenario(selectedScenario, venda.id);
      }
      
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao criar pagamento');
      onPaymentError?.(error);
    } finally {
      setLoading(false);
    }
  };

  // Aprovar pagamento manualmente
  const handleApprovePayment = async () => {
    if (!payment) return;

    setLoading(true);
    try {
      await paymentService.approvePayment(payment.paymentId);
      const status = await paymentService.getPaymentStatus(payment.paymentId);
      setPaymentStatus(status);
      onPaymentComplete?.(status);
      setTimeout(() => onHide(), 2000);
    } catch (error) {
      setError('Erro ao aprovar pagamento');
    } finally {
      setLoading(false);
    }
  };

  // Rejeitar pagamento
  const handleRejectPayment = async () => {
    if (!payment) return;

    const motivo = prompt('Motivo da rejeição:');
    if (!motivo) return;

    setLoading(true);
    try {
      await paymentService.rejectPayment(payment.paymentId, motivo);
      const status = await paymentService.getPaymentStatus(payment.paymentId);
      setPaymentStatus(status);
      onPaymentComplete?.(status);
      setTimeout(() => onHide(), 2000);
    } catch (error) {
      setError('Erro ao rejeitar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = paymentService.formatPaymentStatus(paymentStatus?.status);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          💳 Pagamento da Venda {venda?.numero_venda}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {!payment ? (
          // Formulário de criação de pagamento
          <div>
            <Card className="mb-3">
              <Card.Body>
                <h6>📋 Resumo da Venda</h6>
                <Row>
                  <Col md={6}>
                    <p><strong>Valor Total:</strong> R$ {venda?.total?.toFixed(2)}</p>
                    <p><strong>Status:</strong> {venda?.status}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Cliente:</strong> {venda?.cliente?.nome || 'Não informado'}</p>
                    <p><strong>Data:</strong> {new Date(venda?.created_at).toLocaleString()}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Método de Pagamento</Form.Label>
                <Form.Select 
                  value={selectedMethod} 
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  <option value="simulado">💳 Pagamento Simulado</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cenário de Teste</Form.Label>
                <Form.Select 
                  value={selectedScenario} 
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  <option value="default">⏱️ Padrão (3 segundos)</option>
                  <option value="aprovado">✅ Aprovação Rápida (1 segundo)</option>
                  <option value="rejeitado">❌ Rejeição (2 segundos)</option>
                  <option value="pendente">⏳ Pendente (Manual)</option>
                  <option value="timeout">⏰ Timeout (10 segundos)</option>
                </Form.Select>
              </Form.Group>
            </Form>

            <div className="text-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleCreatePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />
                    {' Processando...'}
                  </>
                ) : (
                  <>
                    💳 Criar Pagamento
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Status do pagamento
          <div>
            <Card className="mb-3">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>{statusInfo.icon}</span>
                </div>
                
                <h5 className="mb-2">
                  <Badge bg={statusInfo.color}>
                    {statusInfo.text}
                  </Badge>
                </h5>

                <p className="text-muted mb-3">
                  ID do Pagamento: <code>{payment.paymentId}</code>
                </p>

                {paymentStatus?.status === 'pendente' && timeRemaining > 0 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Tempo restante</span>
                      <span>{timeRemaining}s</span>
                    </div>
                    <ProgressBar now={progress} animated />
                  </div>
                )}

                {paymentStatus?.venda && (
                  <div className="mt-3">
                    <p><strong>Status da Venda:</strong> {paymentStatus.venda.status}</p>
                    {paymentStatus.venda.pago_em && (
                      <p><strong>Pago em:</strong> {new Date(paymentStatus.venda.pago_em).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>

            {paymentStatus?.status === 'pendente' && (
              <div className="text-center">
                <p className="text-muted">
                  Aguardando confirmação do pagamento...
                </p>
                <div className="btn-group">
                  <Button 
                    variant="success" 
                    onClick={handleApprovePayment}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : '✅ Aprovar Manualmente'}
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={handleRejectPayment}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : '❌ Rejeitar'}
                  </Button>
                </div>
              </div>
            )}

            {['aprovado', 'rejeitado', 'cancelado', 'timeout'].includes(paymentStatus?.status) && (
              <div className="text-center">
                <Button variant="secondary" onClick={onHide}>
                  Fechar
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;