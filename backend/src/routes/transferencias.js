const express = require('express');
const { body, validationResult } = require('express-validator');
const TransferenciaEstoque = require('../models/TransferenciaEstoque');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Listar transferências
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      filial_origem_id, 
      filial_destino_id,
      data_inicio,
      data_fim
    } = req.query;
    
    const where = { empresa_id: req.empresaId };
    
    if (status) where.status = status;
    if (filial_origem_id) where.filial_origem_id = filial_origem_id;
    if (filial_destino_id) where.filial_destino_id = filial_destino_id;
    
    if (data_inicio || data_fim) {
      where.data_solicitacao = {};
      if (data_inicio) where.data_solicitacao[require('sequelize').Op.gte] = new Date(data_inicio);
      if (data_fim) where.data_solicitacao[require('sequelize').Op.lte] = new Date(data_fim);
    }

    const transferencias = await TransferenciaEstoque.findAndCountAll({
      where,
      include: [
        {
          model: require('../models/Filial'),
          as: 'filialOrigem',
          attributes: ['id', 'nome_fantasia', 'tipo']
        },
        {
          model: require('../models/Filial'),
          as: 'filialDestino',
          attributes: ['id', 'nome_fantasia', 'tipo']
        },
        {
          model: require('../models/Produto'),
          as: 'produto',
          attributes: ['id', 'nome', 'codigo_barras']
        },
        {
          model: require('../models/Usuario'),
          as: 'usuarioSolicitante',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: require('../models/Usuario'),
          as: 'usuarioAprovador',
          attributes: ['id', 'nome', 'email'],
          required: false
        }
      ],
      order: [['data_solicitacao', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return res.json({
      transferencias: transferencias.rows,
      total: transferencias.count,
      page: parseInt(page),
      totalPages: Math.ceil(transferencias.count / parseInt(limit))
    });
  } catch (error) {
    console.error('Erro ao listar transferências:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter transferência por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const transferencia = await TransferenciaEstoque.findByPk(id, {
      include: [
        {
          model: require('../models/Filial'),
          as: 'filialOrigem',
          attributes: ['id', 'nome_fantasia', 'tipo', 'endereco']
        },
        {
          model: require('../models/Filial'),
          as: 'filialDestino',
          attributes: ['id', 'nome_fantasia', 'tipo', 'endereco']
        },
        {
          model: require('../models/Produto'),
          as: 'produto',
          attributes: ['id', 'nome', 'codigo_barras', 'descricao']
        },
        {
          model: require('../models/Usuario'),
          as: 'usuarioSolicitante',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: require('../models/Usuario'),
          as: 'usuarioAprovador',
          attributes: ['id', 'nome', 'email'],
          required: false
        }
      ]
    });

    if (!transferencia) {
      return res.status(404).json({ error: 'Transferência não encontrada' });
    }

    return res.json(transferencia);
  } catch (error) {
    console.error('Erro ao obter transferência:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova transferência
router.post('/', [
  body('filial_origem_id')
    .notEmpty()
    .withMessage('Filial de origem é obrigatória'),
  body('filial_destino_id')
    .notEmpty()
    .withMessage('Filial de destino é obrigatória'),
  body('produto_id')
    .notEmpty()
    .withMessage('Produto é obrigatório'),
  body('quantidade')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que 0'),
  body('motivo_transferencia')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Motivo deve ter no máximo 500 caracteres'),
  body('observacoes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Observações devem ter no máximo 1000 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      filial_origem_id,
      filial_destino_id,
      produto_id,
      quantidade,
      lote,
      motivo_transferencia,
      observacoes,
      usuario_solicitante_id
    } = req.body;

    // Verificar se filiais são diferentes
    if (filial_origem_id === filial_destino_id) {
      return res.status(400).json({ 
        error: 'Filial de origem e destino devem ser diferentes' 
      });
    }

    // Verificar se filiais pertencem à mesma empresa
    const Filial = require('../models/Filial');
    const [filialOrigem, filialDestino] = await Promise.all([
      Filial.findOne({ where: { id: filial_origem_id, empresa_id: req.empresaId } }),
      Filial.findOne({ where: { id: filial_destino_id, empresa_id: req.empresaId } })
    ]);

    if (!filialOrigem || !filialDestino) {
      return res.status(404).json({ error: 'Uma ou ambas as filiais não encontradas' });
    }

    // Verificar se existe estoque suficiente na origem
    const Estoque = require('../models/Estoque');
    const estoqueOrigem = await Estoque.findOne({
      where: {
        filial_id: filial_origem_id,
        produto_id,
        lote: lote || null
      }
    });

    if (!estoqueOrigem || estoqueOrigem.quantidade_atual < quantidade) {
      return res.status(400).json({ 
        error: 'Estoque insuficiente na filial de origem' 
      });
    }

    // Verificar configurações das filiais
    if (!filialOrigem.configuracoes.permite_transferencia_saida) {
      return res.status(400).json({ 
        error: 'Filial de origem não permite transferências de saída' 
      });
    }

    if (!filialDestino.configuracoes.permite_transferencia_entrada) {
      return res.status(400).json({ 
        error: 'Filial de destino não permite transferências de entrada' 
      });
    }

    // Criar transferência
    const transferencia = await TransferenciaEstoque.create({
      empresa_id: req.empresaId,
      filial_origem_id,
      filial_destino_id,
      produto_id,
      quantidade,
      lote,
      motivo_transferencia,
      observacoes,
      usuario_solicitante_id: usuario_solicitante_id || req.usuarioId,
      status: filialOrigem.configuracoes.exige_aprovacao_transferencia ? 
        'solicitada' : 'aprovada'
    });

    // Se não exige aprovação, aprovar automaticamente
    if (!filialOrigem.configuracoes.exige_aprovacao_transferencia) {
      await transferencia.update({
        status: 'aprovada',
        data_aprovacao: new Date(),
        usuario_aprovador_id: req.usuarioId
      });
    }

    return res.status(201).json(transferencia);
  } catch (error) {
    console.error('Erro ao criar transferência:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Aprovar transferência
router.put('/:id/aprovar', async (req, res) => {
  try {
    const { id } = req.params;
    
    const transferencia = await TransferenciaEstoque.findByPk(id);

    if (!transferencia) {
      return res.status(404).json({ error: 'Transferência não encontrada' });
    }

    if (transferencia.empresa_id !== req.empresaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (transferencia.status !== 'solicitada') {
      return res.status(400).json({ error: 'Transferência já foi processada' });
    }

    // Verificar estoque novamente
    const Estoque = require('../models/Estoque');
    const estoqueOrigem = await Estoque.findOne({
      where: {
        filial_id: transferencia.filial_origem_id,
        produto_id: transferencia.produto_id,
        lote: transferencia.lote || null
      }
    });

    if (!estoqueOrigem || estoqueOrigem.quantidade_atual < transferencia.quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente na filial de origem' });
    }

    // Atualizar transferência
    await transferencia.update({
      status: 'aprovada',
      data_aprovacao: new Date(),
      usuario_aprovador_id: req.usuarioId
    });

    return res.json(transferencia);
  } catch (error) {
    console.error('Erro ao aprovar transferência:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar transporte (dar baixa no estoque de origem)
router.put('/:id/iniciar-transporte', async (req, res) => {
  try {
    const { id } = req.params;
    
    const transferencia = await TransferenciaEstoque.findByPk(id);

    if (!transferencia) {
      return res.status(404).json({ error: 'Transferência não encontrada' });
    }

    if (transferencia.empresa_id !== req.empresaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (transferencia.status !== 'aprovada') {
      return res.status(400).json({ error: 'Transferência precisa estar aprovada' });
    }

    // Dar baixa no estoque de origem
    const Estoque = require('../models/Estoque');
    const estoqueOrigem = await Estoque.findOne({
      where: {
        filial_id: transferencia.filial_origem_id,
        produto_id: transferencia.produto_id,
        lote: transferencia.lote || null
      }
    });

    if (!estoqueOrigem || estoqueOrigem.quantidade_atual < transferencia.quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente na filial de origem' });
    }

    await estoqueOrigem.update({
      quantidade_atual: estoqueOrigem.quantidade_atual - transferencia.quantidade,
      ultima_atualizacao: new Date(),
      usuario_atualizacao_id: req.usuarioId
    });

    // Atualizar status da transferência
    await transferencia.update({
      status: 'em_transito',
      data_envio: new Date()
    });

    return res.json(transferencia);
  } catch (error) {
    console.error('Erro ao iniciar transporte:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Confirmar recebimento (dar entrada no estoque de destino)
router.put('/:id/confirmar-recebimento', [
  body('quantidade_recebida')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantidade recebida deve ser um número inteiro maior que 0'),
  body('observacoes_recebimento')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { quantidade_recebida, observacoes_recebimento } = req.body;
    
    const transferencia = await TransferenciaEstoque.findByPk(id);

    if (!transferencia) {
      return res.status(404).json({ error: 'Transferência não encontrada' });
    }

    if (transferencia.empresa_id !== req.empresaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (transferencia.status !== 'em_transito') {
      return res.status(400).json({ error: 'Transferência não está em trânsito' });
    }

    // Verificar ou criar estoque no destino
    const Estoque = require('../models/Estoque');
    let estoqueDestino = await Estoque.findOne({
      where: {
        filial_id: transferencia.filial_destino_id,
        produto_id: transferencia.produto_id,
        lote: transferencia.lote || null
      }
    });

    const quantidadeFinal = quantidade_recebida || transferencia.quantidade;

    if (!estoqueDestino) {
      // Criar novo registro de estoque
      const Produto = require('../models/Produto');
      const produto = await Produto.findByPk(transferencia.produto_id);
      
      estoqueDestino = await Estoque.create({
        empresa_id: transferencia.empresa_id,
        filial_id: transferencia.filial_destino_id,
        produto_id: transferencia.produto_id,
        quantidade_atual: quantidadeFinal,
        quantidade_minima: produto?.quantidade_minima || 10,
        quantidade_maxima: produto?.quantidade_maxima || 1000,
        lote: transferencia.lote,
        data_validade: transferencia.data_validade,
        ultima_atualizacao: new Date(),
        usuario_atualizacao_id: req.usuarioId
      });
    } else {
      // Atualizar estoque existente
      await estoqueDestino.update({
        quantidade_atual: estoqueDestino.quantidade_atual + quantidadeFinal,
        ultima_atualizacao: new Date(),
        usuario_atualizacao_id: req.usuarioId
      });
    }

    // Atualizar status da transferência
    await transferencia.update({
      status: 'concluida',
      data_recebimento: new Date(),
      observacoes: observacoes_recebimento || transferencia.observacoes
    });

    return res.json(transferencia);
  } catch (error) {
    console.error('Erro ao confirmar recebimento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar transferência
router.put('/:id/cancelar', [
  body('motivo_cancelamento')
    .notEmpty()
    .withMessage('Motivo do cancelamento é obrigatório')
    .isLength({ max: 500 })
    .withMessage('Motivo deve ter no máximo 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { motivo_cancelamento } = req.body;
    
    const transferencia = await TransferenciaEstoque.findByPk(id);

    if (!transferencia) {
      return res.status(404).json({ error: 'Transferência não encontrada' });
    }

    if (transferencia.empresa_id !== req.empresaId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (!['solicitada', 'aprovada'].includes(transferencia.status)) {
      return res.status(400).json({ 
        error: 'Apenas transferências solicitadas ou aprovadas podem ser canceladas' 
      });
    }

    await transferencia.update({
      status: 'cancelada',
      observacoes: motivo_cancelamento
    });

    return res.json(transferencia);
  } catch (error) {
    console.error('Erro ao cancelar transferência:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de transferências
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await TransferenciaEstoque.findAll({
      where: { empresa_id: req.empresaId },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status']
    });

    return res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
