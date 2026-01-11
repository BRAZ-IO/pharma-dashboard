const express = require('express');
const router = express.Router();
const { Venda, FluxoCaixa, Usuario } = require('../models');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

// Endpoint de teste para verificar integração
router.post('/testar-integracao', async (req, res) => {
  try {
    console.log('🧪 Iniciando teste de integração Venda-FluxoCaixa');
    
    // Buscar uma venda existente
    const vendaExistente = await Venda.findOne({
      where: { empresa_id: req.empresaId },
      include: [
        {
          model: Usuario,
          as: 'vendedor',
          attributes: ['nome']
        }
      ]
    });

    if (!vendaExistente) {
      return res.status(404).json({ error: 'Nenhuma venda encontrada para teste' });
    }

    console.log('📋 Venda encontrada:', vendaExistente.numero_venda);

    // Verificar se já existe registro no fluxo de caixa
    const fluxoExistente = await FluxoCaixa.findOne({
      where: { venda_id: vendaExistente.id }
    });

    if (fluxoExistente) {
      return res.json({
        message: 'Integração já existe para esta venda',
        venda: vendaExistente.numero_venda,
        fluxo_caixa: fluxoExistente
      });
    }

    // Criar registro manual no fluxo de caixa
    const novoFluxo = await FluxoCaixa.create({
      descricao: `TESTE - Venda ${vendaExistente.numero_venda} - ${vendaExistente.cliente_nome}`,
      tipo: 'entrada',
      valor: vendaExistente.total,
      categoria: 'Vendas PDV',
      forma_pagamento: 'Dinheiro',
      data: new Date(),
      responsavel: req.user.nome,
      observacoes: 'Registro de teste manual',
      empresa_id: req.empresaId,
      venda_id: vendaExistente.id
    });

    console.log('✅ Fluxo de caixa criado:', novoFluxo.id);

    res.json({
      message: 'Teste de integração concluído com sucesso',
      venda: vendaExistente.numero_venda,
      fluxo_caixa: novoFluxo
    });

  } catch (error) {
    console.error('❌ Erro no teste de integração:', error);
    res.status(500).json({ 
      error: 'Erro no teste de integração',
      details: error.message 
    });
  }
});

// Verificar status da integração
router.get('/status-integracao', async (req, res) => {
  try {
    const totalVendas = await Venda.count({
      where: { empresa_id: req.empresaId }
    });

    const totalFluxoCaixa = await FluxoCaixa.count({
      where: { 
        empresa_id: req.empresaId,
        venda_id: { [require('sequelize').Op.not]: null }
      }
    });

    const vendasSemFluxo = await Venda.count({
      where: { 
        empresa_id: req.empresaId,
        id: {
          [require('sequelize').Op.notIn]: require('sequelize').literal(`
            (SELECT DISTINCT venda_id FROM "FluxoCaixa" 
             WHERE empresa_id = '${req.empresaId}' 
             AND venda_id IS NOT NULL)
          `)
        }
      }
    });

    res.json({
      total_vendas: totalVendas,
      total_fluxo_caixa_vinculado: totalFluxoCaixa,
      vendas_sem_fluxo_caixa: vendasSemFluxo,
      taxa_integracao: totalVendas > 0 ? ((totalFluxoCaixa / totalVendas) * 100).toFixed(2) + '%' : '0%'
    });

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status da integração' });
  }
});

module.exports = router;
