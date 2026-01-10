const axios = require('axios');

class PaymentGateway {
  constructor() {
    // Configurações do gateway de pagamento
    this.config = {
      // Exemplo: Mercado Pago
      mercadoPago: {
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'TEST-ACCESS-TOKEN',
        baseURL: 'https://api.mercadopago.com',
        webhookURL: process.env.WEBHOOK_URL || 'http://localhost:5000/api/payments/webhook'
      },
      // Exemplo: Stripe
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
      },
      // Exemplo: PagSeguro
      pagSeguro: {
        email: process.env.PAGSEGURO_EMAIL,
        token: process.env.PAGSEGURO_TOKEN,
        sandbox: process.env.NODE_ENV !== 'production',
        baseURL: 'https://ws.sandbox.pagseguro.uol.com.br' // Sandbox
      }
    };

    // Gateway ativo (pode ser configurado por empresa)
    this.activeGateway = process.env.DEFAULT_PAYMENT_GATEWAY || 'mercadoPago';
  }

  /**
   * Criar pagamento via Mercado Pago
   */
  async createMercadoPagoPayment(paymentData) {
    try {
      const { amount, description, customer, items } = paymentData;
      
      const preference = {
        items: items.map(item => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          currency_id: 'BRL',
          unit_price: parseFloat(item.price)
        })),
        payer: {
          name: customer.name,
          email: customer.email,
          identification: {
            type: customer.documentType || 'CPF',
            number: customer.document || '00000000000'
          }
        },
        payment_methods: {
          excluded_payment_types: [
            { id: 'ticket' } // Excluir boleto se necessário
          ],
          installments: 12 // Máximo de parcelas
        },
        back_urls: {
          success: `${this.config.mercadoPago.webhookURL}/success`,
          failure: `${this.config.mercadoPago.webhookURL}/failure`,
          pending: `${this.config.mercadoPago.webhookURL}/pending`
        },
        auto_return: 'approved',
        external_reference: paymentData.orderId,
        notification_url: this.config.mercadoPago.webhookURL
      };

      const response = await axios.post(
        `${this.config.mercadoPago.baseURL}/checkout/preferences`,
        preference,
        {
          headers: {
            'Authorization': `Bearer ${this.config.mercadoPago.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        paymentUrl: response.data.init_point,
        qrCode: response.data.sandbox_init_point,
        preferenceId: response.data.id
      };

    } catch (error) {
      console.error('Erro ao criar pagamento Mercado Pago:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento'
      };
    }
  }

  /**
   * Criar pagamento via Stripe
   */
  async createStripePayment(paymentData) {
    try {
      const { amount, description, customer, items } = paymentData;
      
      // Criar Payment Intent
      const paymentIntent = await axios.post(
        'https://api.stripe.com/v1/payment_intents',
        {
          amount: Math.round(amount * 100), // Stripe trabalha com centavos
          currency: 'brl',
          payment_method_types: ['card'],
          description: description,
          metadata: {
            order_id: paymentData.orderId,
            customer_email: customer.email
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.stripe.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        clientSecret: paymentIntent.data.client_secret,
        paymentIntentId: paymentIntent.data.id
      };

    } catch (error) {
      console.error('Erro ao criar pagamento Stripe:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento'
      };
    }
  }

  /**
   * Criar pagamento via PagSeguro
   */
  async createPagSeguroPayment(paymentData) {
    try {
      const { amount, description, customer, items } = paymentData;
      
      // Dados do pagamento
      const paymentData = {
        currency: 'BRL',
        itemId1: items[0]?.id || 'item1',
        itemDescription1: description,
        itemAmount1: amount.toFixed(2),
        itemQuantity1: '1',
        itemWeight1: '1000', // Peso em gramas
        
        // Dados do comprador
        senderName: customer.name,
        senderEmail: customer.email,
        senderPhone: customer.phone || '11999999999',
        senderCPF: customer.document || '00000000000',
        
        // Dados do envio
        shippingType: '3', // Sem envio
        shippingAddressStreet: 'Rua Teste',
        shippingAddressNumber: '123',
        shippingAddressComplement: '',
        shippingAddressDistrict: 'Bairro Teste',
        shippingAddressPostalCode: '01310000',
        shippingAddressCity: 'São Paulo',
        shippingAddressState: 'SP',
        shippingAddressCountry: 'BRA',
        
        // URL de retorno
        redirectURL: `${this.config.pagSeguro.webhookURL}/success`,
        notificationURL: this.config.pagSeguro.webhookURL
      };

      const response = await axios.post(
        `${this.config.pagSeguro.baseURL}/v2/checkout`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          params: {
            email: this.config.pagSeguro.email,
            token: this.config.pagSeguro.token
          }
        }
      );

      return {
        success: true,
        paymentUrl: response.data.paymentUrl,
        code: response.data.code
      };

    } catch (error) {
      console.error('Erro ao criar pagamento PagSeguro:', error.response?.data || error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento'
      };
    }
  }

  /**
   * Verificar status do pagamento
   */
  async checkPaymentStatus(gateway, paymentId) {
    try {
      switch (gateway) {
        case 'mercadoPago':
          return await this.checkMercadoPagoStatus(paymentId);
        case 'stripe':
          return await this.checkStripeStatus(paymentId);
        case 'pagseguro':
          return await this.checkPagSeguroStatus(paymentId);
        default:
          throw new Error('Gateway não suportado');
      }
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return {
        success: false,
        error: 'Erro ao verificar status do pagamento'
      };
    }
  }

  /**
   * Verificar status Mercado Pago
   */
  async checkMercadoPagoStatus(paymentId) {
    try {
      const response = await axios.get(
        `${this.config.mercadoPago.baseURL}/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.mercadoPago.accessToken}`
          }
        }
      );

      return {
        success: true,
        status: this.mapMercadoPagoStatus(response.data.status),
        paymentId: response.data.id,
        amount: response.data.transaction_amount,
        approvedDate: response.data.date_approved
      };

    } catch (error) {
      console.error('Erro ao verificar status Mercado Pago:', error);
      return {
        success: false,
        error: 'Erro ao verificar status do pagamento'
      };
    }
  }

  /**
   * Verificar status Stripe
   */
  async checkStripeStatus(paymentId) {
    try {
      const response = await axios.get(
        `https://api.stripe.com/v1/payment_intents/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.stripe.secretKey}`
          }
        }
      );

      return {
        success: true,
        status: this.mapStripeStatus(response.data.status),
        paymentId: response.data.id,
        amount: response.data.amount / 100,
        created: response.data.created
      };

    } catch (error) {
      console.error('Erro ao verificar status Stripe:', error);
      return {
        success: false,
        error: 'Erro ao verificar status do pagamento'
      };
    }
  }

  /**
   * Mapear status do Mercado Pago
   */
  mapMercadoPagoStatus(status) {
    const statusMap = {
      'pending': 'pendente',
      'approved': 'aprovado',
      'authorized': 'autorizado',
      'in_process': 'processando',
      'rejected': 'rejeitado',
      'cancelled': 'cancelado',
      'refunded': 'reembolsado',
      'charged_back': 'contestado'
    };
    return statusMap[status] || 'desconhecido';
  }

  /**
   * Mapear status do Stripe
   */
  mapStripeStatus(status) {
    const statusMap = {
      'requires_payment_method': 'pendente',
      'requires_confirmation': 'pendente',
      'requires_action': 'pendente',
      'processing': 'processando',
      'succeeded': 'aprovado',
      'canceled': 'cancelado',
      'requires_capture': 'autorizado'
    };
    return statusMap[status] || 'desconhecido';
  }

  /**
   * Processar webhook de pagamento
   */
  async processWebhook(gateway, webhookData) {
    try {
      switch (gateway) {
        case 'mercadoPago':
          return this.processMercadoPagoWebhook(webhookData);
        case 'stripe':
          return this.processStripeWebhook(webhookData);
        case 'pagseguro':
          return this.processPagSeguroWebhook(webhookData);
        default:
          throw new Error('Webhook não suportado para este gateway');
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      return {
        success: false,
        error: 'Erro ao processar webhook'
      };
    }
  }

  /**
   * Processar webhook Mercado Pago
   */
  processMercadoPagoWebhook(data) {
    return {
      gateway: 'mercadoPago',
      paymentId: data.data?.id,
      status: this.mapMercadoPagoStatus(data.data?.status),
      orderId: data.data?.external_reference,
      amount: data.data?.transaction_amount,
      processedAt: new Date()
    };
  }

  /**
   * Processar webhook Stripe
   */
  processStripeWebhook(data) {
    return {
      gateway: 'stripe',
      paymentId: data.data?.object?.id,
      status: this.mapStripeStatus(data.data?.object?.status),
      orderId: data.data?.object?.metadata?.order_id,
      amount: data.data?.object?.amount / 100,
      processedAt: new Date()
    };
  }

  /**
   * Estornar pagamento
   */
  async refundPayment(gateway, paymentId, amount = null) {
    try {
      switch (gateway) {
        case 'mercadoPago':
          return await this.refundMercadoPago(paymentId, amount);
        case 'stripe':
          return await this.refundStripe(paymentId, amount);
        default:
          throw new Error('Gateway não suportado para estorno');
      }
    } catch (error) {
      console.error('Erro ao estornar pagamento:', error);
      return {
        success: false,
        error: 'Erro ao estornar pagamento'
      };
    }
  }

  /**
   * Estornar pagamento Mercado Pago
   */
  async refundMercadoPago(paymentId, amount) {
    try {
      const refundData = amount ? { amount } : {};
      
      const response = await axios.post(
        `${this.config.mercadoPago.baseURL}/v1/payments/${paymentId}/refunds`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.mercadoPago.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        refundId: response.data.id,
        amount: response.data.amount,
        status: 'reembolsado'
      };

    } catch (error) {
      console.error('Erro ao estornar Mercado Pago:', error);
      return {
        success: false,
        error: 'Erro ao estornar pagamento'
      };
    }
  }

  /**
   * Estornar pagamento Stripe
   */
  async refundStripe(paymentId, amount) {
    try {
      const refundData = amount ? { amount: Math.round(amount * 100) } : {};
      
      const response = await axios.post(
        'https://api.stripe.com/v1/refunds',
        {
          payment_intent: paymentId,
          ...refundData
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.stripe.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        refundId: response.data.id,
        amount: response.data.amount / 100,
        status: 'reembolsado'
      };

    } catch (error) {
      console.error('Erro ao estornar Stripe:', error);
      return {
        success: false,
        error: 'Erro ao estornar pagamento'
      };
    }
  }
}

module.exports = new PaymentGateway();