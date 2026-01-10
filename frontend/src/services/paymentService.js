import api from './api';

const paymentService = {
  // Criar pagamento
  async createPayment(vendaId, paymentMethod = 'simulado') {
    try {
      const response = await api.post('/payments/create', {
        vendaId,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  },

  // Verificar status do pagamento
  async getPaymentStatus(paymentId) {
    try {
      const response = await api.get(`/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  },

  // Aprovar pagamento manualmente
  async approvePayment(paymentId) {
    try {
      const response = await api.post(`/payments/approve/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
      throw error;
    }
  },

  // Rejeitar pagamento
  async rejectPayment(paymentId, motivo) {
    try {
      const response = await api.post(`/payments/reject/${paymentId}`, { motivo });
      return response.data;
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error);
      throw error;
    }
  },

  // Listar métodos de pagamento
  async getPaymentMethods() {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar métodos de pagamento:', error);
      throw error;
    }
  },

  // Simular cenários de pagamento
  async simulateScenario(scenario, vendaId) {
    try {
      const response = await api.post(`/payments/simulate/${scenario}`, { vendaId });
      return response.data;
    } catch (error) {
      console.error('Erro ao simular cenário:', error);
      throw error;
    }
  },

  // Limpar pagamentos simulados (para testes)
  async cleanupPayments() {
    try {
      const response = await api.delete('/payments/cleanup');
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar pagamentos:', error);
      throw error;
    }
  },

  // Polling de status (verificar status periodicamente)
  async pollPaymentStatus(paymentId, maxAttempts = 30, interval = 1000) {
    let attempts = 0;
    
    const poll = async () => {
      attempts++;
      
      try {
        const status = await this.getPaymentStatus(paymentId);
        
        // Se pagamento estiver finalizado (aprovado, rejeitado, cancelado, timeout)
        if (['aprovado', 'rejeitado', 'cancelado', 'timeout'].includes(status.status)) {
          return status;
        }
        
        // Se ainda está pendente e não excedeu o número máximo de tentativas
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, interval));
          return poll();
        }
        
        // Timeout do polling
        throw new Error('Timeout ao aguardar confirmação do pagamento');
        
      } catch (error) {
        throw error;
      }
    };
    
    return poll();
  },

  // Formatar status para exibição
  formatPaymentStatus(status) {
    const statusMap = {
      'pendente': { text: 'Pendente', color: 'warning', icon: '⏳' },
      'aguardando_pagamento': { text: 'Aguardando Pagamento', color: 'info', icon: '💳' },
      'aprovado': { text: 'Aprovado', color: 'success', icon: '✅' },
      'rejeitado': { text: 'Rejeitado', color: 'danger', icon: '❌' },
      'cancelado': { text: 'Cancelado', color: 'secondary', icon: '🚫' },
      'timeout': { text: 'Expirado', color: 'danger', icon: '⏰' }
    };
    
    return statusMap[status] || { text: status, color: 'secondary', icon: '❓' };
  },

  // Calcular tempo estimado para aprovação
  getEstimatedTime(scenario) {
    const timeMap = {
      'aprovado': 1, // 1 segundo
      'rejeitado': 2, // 2 segundos
      'timeout': 10, // 10 segundos
      'pendente': null, // manual
      'default': 3 // 3 segundos (padrão)
    };
    
    return timeMap[scenario] || timeMap.default;
  }
};

export default paymentService;
