import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge, 
  Form,
  InputGroup,
  Modal,
  Alert,
  Spinner,
  Pagination
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaCreditCard,
  FaFilter
} from 'react-icons/fa';
import api from '../services/api';
import PaymentButton from '../components/PaymentButton';
import PaymentModal from '../components/PaymentModal';

const VendasPage = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [vendaDetails, setVendaDetails] = useState(null);

  // Carregar vendas
  const carregarVendas = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter !== 'todos') {
        params.append('status', statusFilter);
      }

      const response = await api.get(`/vendas?${params.toString()}`);
      
      setVendas(response.data.vendas || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setError('Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  // Buscar detalhes da venda
  const buscarDetalhesVenda = async (vendaId) => {
    try {
      const response = await api.get(`/vendas/${vendaId}`);
      setVendaDetails(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda:', error);
      setError('Erro ao carregar detalhes da venda');
    }
  };

  // Carregar vendas ao montar componente
  useEffect(() => {
    carregarVendas();
  }, [searchTerm, statusFilter]);

  // Formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Formatar moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'pendente': { color: 'warning', text: 'Pendente', icon: '⏳' },
      'aguardando_pagamento': { color: 'info', text: 'Aguardando Pagamento', icon: '💳' },
      'finalizada': { color: 'success', text: 'Finalizada', icon: '✅' },
      'cancelada': { color: 'danger', text: 'Cancelada', icon: '❌' }
    };

    const statusInfo = statusMap[status] || { color: 'secondary', text: status, icon: '❓' };
    
    return (
      <Badge bg={statusInfo.color}>
        {statusInfo.icon} {statusInfo.text}
      </Badge>
    );
  };

  // Paginação
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => carregarVendas(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev 
          disabled={currentPage === 1}
          onClick={() => carregarVendas(currentPage - 1)}
        />
        {items}
        <Pagination.Next 
          disabled={currentPage === totalPages}
          onClick={() => carregarVendas(currentPage + 1)}
        />
      </Pagination>
    );
  };

  // Handle pagamento completo
  const handlePaymentComplete = (paymentStatus) => {
    // Recarregar vendas para atualizar status
    carregarVendas(currentPage);
    
    // Mostrar notificação
    if (paymentStatus.status === 'aprovado') {
      alert('✅ Pagamento aprovado com sucesso!');
    } else if (paymentStatus.status === 'rejeitado') {
      alert('❌ Pagamento rejeitado');
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>💳 Vendas</h2>
          <p className="text-muted">Gerencie suas vendas e pagamentos</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filtros e Busca */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar vendas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">🔍 Todos os Status</option>
                <option value="pendente">⏳ Pendente</option>
                <option value="aguardando_pagamento">💳 Aguardando Pagamento</option>
                <option value="finalizada">✅ Finalizada</option>
                <option value="cancelada">❌ Cancelada</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="primary" className="w-100">
                <FaPlus className="me-2" />
                Nova Venda
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabela de Vendas */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Lista de Vendas</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Carregando vendas...</p>
            </div>
          ) : vendas.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Nenhuma venda encontrada</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td>
                      <strong>{venda.numero_venda}</strong>
                    </td>
                    <td>{formatDate(venda.created_at)}</td>
                    <td>{venda.cliente?.nome || 'Não informado'}</td>
                    <td>
                      <strong>{formatCurrency(venda.total)}</strong>
                    </td>
                    <td>{getStatusBadge(venda.status)}</td>
                    <td>
                      {['pendente', 'aguardando_pagamento'].includes(venda.status) ? (
                        <PaymentButton
                          venda={venda}
                          onPaymentComplete={handlePaymentComplete}
                          size="sm"
                        />
                      ) : (
                        <Badge bg="secondary">
                          {venda.gateway_payment_method || 'N/A'}
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => buscarDetalhesVenda(venda.id)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Paginação */}
      {renderPagination()}

      {/* Modal de Detalhes da Venda */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            📋 Detalhes da Venda {vendaDetails?.numero_venda}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vendaDetails && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Data:</strong> {formatDate(vendaDetails.created_at)}</p>
                  <p><strong>Cliente:</strong> {vendaDetails.cliente?.nome || 'Não informado'}</p>
                  <p><strong>Status:</strong> {getStatusBadge(vendaDetails.status)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Subtotal:</strong> {formatCurrency(vendaDetails.subtotal)}</p>
                  <p><strong>Desconto:</strong> {formatCurrency(vendaDetails.desconto)}</p>
                  <p><strong>Total:</strong> <strong>{formatCurrency(vendaDetails.total)}</strong></p>
                </Col>
              </Row>

              {vendaDetails.pagamento && (
                <Card className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">💳 Informações de Pagamento</h6>
                  </Card.Header>
                  <Card.Body>
                    <p><strong>ID do Pagamento:</strong> {vendaDetails.pagamento.id}</p>
                    <p><strong>Método:</strong> {vendaDetails.pagamento.metodo}</p>
                    <p><strong>Status:</strong> {getStatusBadge(vendaDetails.pagamento.status)}</p>
                    {vendaDetails.pagamento.pago_em && (
                      <p><strong>Pago em:</strong> {formatDate(vendaDetails.pagamento.pago_em)}</p>
                    )}
                  </Card.Body>
                </Card>
              )}

              <Card>
                <Card.Header>
                  <h6 className="mb-0">📦 Itens da Venda</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive size="sm">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendaDetails.itens?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.produto?.nome}</td>
                          <td>{item.quantidade}</td>
                          <td>{formatCurrency(item.preco_unitario)}</td>
                          <td>{formatCurrency(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {['pendente', 'aguardando_pagamento'].includes(vendaDetails?.status) && (
            <PaymentButton
              venda={vendaDetails}
              onPaymentComplete={handlePaymentComplete}
            />
          )}
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VendasPage;