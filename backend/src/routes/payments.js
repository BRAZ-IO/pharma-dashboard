const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const { Venda, Empresa } = require('../models');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * Criar pagamento simulado para uma venda
 */
router.post('/create', async (req, res) => {
  try {
    const { vendaId, paymentMethod } = req.body;
    const empresa_id = req.empresaId;

    // Buscar dados da venda
    const venda = await Venda.findOne({
      where: { id: vendaId, empresa_id },
      include: [
        {
          association: 'itens',
          include: [{ association: 'produto' }]
        }
      ]
    });

    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    // Simular criação de pagamento
    const paymentId = `SIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const paymentUrl = `http://localhost:3000/pagamento/simulado/${paymentId}`;

    // Atualizar venda com informações do pagamento simulado
    await venda.update({
      forma_pagamento: paymentMethod || 'simulado',
      gateway_pagamento: 'simulado',
      gateway_payment_id: paymentId,
      gateway_payment_url: paymentUrl,
      status: 'aguardando_pagamento'
    });

    // Simular aprovação automática após 3 segundos (para teste)
    setTimeout(async () => {
      try {
        await venda.update({
          status: 'finalizada',
          pago_em: new Date()
        });
        console.log(`✅ Pagamento simulado aprovado - Venda ${venda.id}`);
      } catch (error) {
        console.error('Erro ao aprovar pagamento simulado:', error);
      }
    }, 3000);

    res.json({
      success: true,
      payment: {
        paymentId: paymentId,
        paymentUrl: paymentUrl,
        gateway: 'simulado',
        status: 'pendente',
        amount: venda.total,
        approvedIn: 3 // segundos
      },
      venda: {
        id: venda.id,
        numero_venda: venda.numero_venda,
        total: venda.total,
        status: 'aguardando_pagamento'
      },
      message: 'Pagamento simulado criado! Será aprovado automaticamente em 3 segundos.'
    });

  } catch (error) {
    console.error('Erro ao criar pagamento simulado:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento simulado' });
  }
});

/**
 * Simular aprovação manual de pagamento
 */
router.post('/approve/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const empresa_id = req.empresaId;

    // Buscar venda associada
    const venda = await Venda.findOne({
      where: { 
        empresa_id,
        gateway_payment_id: paymentId,
        gateway_pagamento: 'simulado'
      }
    });

    if (!venda) {
      return res.status(404).json({ error: 'Pagamento simulado não encontrado' });
    }

    // Aprovar pagamento
    await venda.update({ 
      status: 'finalizada',
      pago_em: new Date()
    });

    res.json({
      success: true,
      message: 'Pagamento aprovado com sucesso!',
      venda: {
        id: venda.id,
        numero_venda: venda.numero_venda,
        status: 'finalizada',
        total: venda.total,
        pago_em: venda.pago_em
      }
    });

  } catch (error) {
    console.error('Erro ao aprovar pagamento:', error);
    res.status(500).json({ error: 'Erro ao aprovar pagamento' });
  }
});

/**
 * Simular rejeição de pagamento
 */
router.post('/reject/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { motivo } = req.body;
    const empresa_id = req.empresaId;

    // Buscar venda associada
    const venda = await Venda.findOne({
      where: { 
        empresa_id,
        gateway_payment_id: paymentId,
        gateway_pagamento: 'simulado'
      }
    });

    if (!venda) {
      return res.status(404).json({ error: 'Pagamento simulado não encontrado' });
    }

    // Rejeitar pagamento
    await venda.update({ 
      status: 'cancelada'
    });

    res.json({
      success: true,
      message: 'Pagamento rejeitado!',
      motivo: motivo || 'Pagamento cancelado pelo usuário',
      venda: {
        id: venda.id,
        numero_venda: venda.numero_venda,
        status: 'cancelada',
        total: venda.total
      }
    });

  } catch (error) {
    console.error('Erro ao rejeitar pagamento:', error);
    res.status(500).json({ error: 'Erro ao rejeitar pagamento' });
  }
});

/**
 * Verificar status do pagamento simulado
 */
router.get('/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const empresa_id = req.empresaId;

    // Buscar venda associada
    const venda = await Venda.findOne({
      where: { 
        empresa_id,
        gateway_payment_id: paymentId,
        gateway_pagamento: 'simulado'
      }
    });

    if (!venda) {
      return res.status(404).json({ error: 'Pagamento simulado não encontrado' });
    }

    // Mapear status
    let status = 'desconhecido';
    switch (venda.status) {
      case 'aguardando_pagamento':
        status = 'pendente';
        break;
      case 'finalizada':
        status = 'aprovado';
        break;
      case 'cancelada':
        status = 'rejeitado';
        break;
      default:
        status = 'pendente';
    }

    res.json({
      success: true,
      status: status,
      paymentId: paymentId,
      venda: {
        id: venda.id,
        numero_venda: venda.numero_venda,
        status: venda.status,
        total: venda.total,
        pago_em: venda.pago_em
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
  }
});

/**
 * Listar métodos de pagamento simulados
 */
router.get('/methods', async (req, res) => {
  try {
    const methods = [
      {
        id: 'simulado',
        name: 'Pagamento Simulado',
        description: 'Pagamento de teste para demonstração',
        icon: 'credit-card',
        enabled: true,
        fees: {
          description: 'Sem taxas - ambiente de teste'
        },
        features: [
          'Aprovação automática em 3 segundos',
          'Aprovação manual disponível',
          'Sem custos reais',
          'Ideal para testes'
        ]
      }
    ];

    res.json({
      success: true,
      methods: methods
    });

  } catch (error) {
    console.error('Erro ao listar métodos de pagamento:', error);
    res.status(500).json({ error: 'Erro ao listar métodos de pagamento' });
  }
});

/**
 * Simular diferentes cenários de pagamento
 */
router.post('/simulate/:scenario', async (req, res) => {
  try {
    const { scenario } = req.params;
    const { vendaId } = req.body;
    const empresa_id = req.empresaId;

    // Buscar venda
    const venda = await Venda.findOne({
      where: { id: vendaId, empresa_id }
    });

    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    let resultado = {};
    let delay = 0;

    switch (scenario) {
      case 'aprovado':
        delay = 1000;
        setTimeout(async () => {
          await venda.update({ status: 'finalizada', pago_em: new Date() });
        }, delay);
        resultado = { 
          message: 'Pagamento será aprovado em 1 segundo',
          status: 'aprovado',
          delay: delay 
        };
        break;

      case 'rejeitado':
        delay = 2000;
        setTimeout(async () => {
          await venda.update({ status: 'cancelada' });
        }, delay);
        resultado = { 
          message: 'Pagamento será rejeitado em 2 segundos',
          status: 'rejeitado',
          motivo: 'Cartão inválido',
          delay: delay 
        };
        break;

      case 'timeout':
        delay = 10000;
        setTimeout(async () => {
          await venda.update({ status: 'cancelada' });
        }, delay);
        resultado = { 
          message: 'Pagamento irá expirar em 10 segundos',
          status: 'timeout',
          delay: delay 
        };
        break;

      case 'pendente':
        resultado = { 
          message: 'Pagamento permanecerá pendente',
          status: 'pendente',
          action: 'Aprovação manual necessária'
        };
        break;

      default:
        return res.status(400).json({ error: 'Cenário não suportado' });
    }

    // Criar pagamento simulado
    const paymentId = `SIM_${scenario}_${Date.now()}`;
    await venda.update({
      forma_pagamento: 'simulado',
      gateway_pagamento: 'simulado',
      gateway_payment_id: paymentId,
      status: 'aguardando_pagamento'
    });

    res.json({
      success: true,
      scenario: scenario,
      paymentId: paymentId,
      venda: {
        id: venda.id,
        numero_venda: venda.numero_venda,
        total: venda.total
      },
      ...resultado
    });

  } catch (error) {
    console.error('Erro ao simular cenário:', error);
    res.status(500).json({ error: 'Erro ao simular cenário de pagamento' });
  }
});

/**
 * Limpar pagamentos simulados (para testes)
 */
router.delete('/cleanup', async (req, res) => {
  try {
    const empresa_id = req.empresaId;

    // Buscar vendas com pagamento simulado
    const vendas = await Venda.findAll({
      where: { 
        empresa_id,
        gateway_pagamento: 'simulado'
      }
    });

    // Resetar vendas
    for (const venda of vendas) {
      await venda.update({
        forma_pagamento: null,
        gateway_payment_id: null,
        gateway_pagamento: null,
        status: 'pendente',
        pago_em: null
      });
    }

    res.json({
      success: true,
      message: `${vendas.length} pagamentos simulados limpos com sucesso!`,
      vendasResetadas: vendas.length
    });

  } catch (error) {
    console.error('Erro ao limpar pagamentos simulados:', error);
    res.status(500).json({ error: 'Erro ao limpar pagamentos simulados' });
  }
});

module.exports = router;
