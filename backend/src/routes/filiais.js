const express = require('express');
const { body, validationResult } = require('express-validator');
const Filial = require('../models/Filial');
const { authMiddleware } = require('../middlewares/auth');
const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Listar filiais da empresa
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, tipo } = req.query;
    
    const where = { empresa_id: req.empresaId };
    
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;

    const filiais = await Filial.findAndCountAll({
      where,
      order: [['nome_fantasia', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return res.json({
      filiais: filiais.rows,
      total: filiais.count,
      page: parseInt(page),
      totalPages: Math.ceil(filiais.count / parseInt(limit))
    });
  } catch (error) {
    console.error('Erro ao listar filiais:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter filial por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const filial = await Filial.findOne({
      where: { 
        id, 
        empresa_id: req.empresaId 
      }
    });

    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }

    return res.json(filial);
  } catch (error) {
    console.error('Erro ao obter filial:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova filial
router.post('/', [
  body('nome_fantasia')
    .notEmpty()
    .withMessage('Nome fantasia é obrigatório')
    .isLength({ max: 255 })
    .withMessage('Nome fantasia deve ter no máximo 255 caracteres'),
  body('razao_social')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Razão social deve ter no máximo 255 caracteres'),
  body('cnpj')
    .optional()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX'),
  body('tipo')
    .optional()
    .isIn(['matriz', 'filial'])
    .withMessage('Tipo deve ser matriz ou filial'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .withMessage('Telefone inválido. Use o formato (XX) XXXX-XXXX'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),
  body('gerente_responsavel')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Nome do gerente deve ter no máximo 255 caracteres'),
  body('capacidade_estoque')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacidade de estoque deve ser um número inteiro maior que 0'),
  body('endereco.cep')
    .optional()
    .matches(/^\d{5}-\d{3}$/)
    .withMessage('CEP inválido. Use o formato XXXXX-XXX'),
  body('endereco.estado')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verificar se já existe filial com mesmo CNPJ
    if (req.body.cnpj) {
      const existingFilial = await Filial.findOne({
        where: { 
          cnpj: req.body.cnpj,
          empresa_id: req.empresaId 
        }
      });

      if (existingFilial) {
        return res.status(400).json({ error: 'CNPJ já cadastrado para outra filial' });
      }
    }

    // Se for matriz, verificar se já existe matriz
    if (req.body.tipo === 'matriz') {
      const existingMatriz = await Filial.findOne({
        where: { 
          tipo: 'matriz',
          empresa_id: req.empresaId 
        }
      });

      if (existingMatriz) {
        return res.status(400).json({ error: 'Já existe uma matriz cadastrada' });
      }
    }

    const filial = await Filial.create({
      empresa_id: req.empresaId,
      ...req.body
    });

    return res.status(201).json(filial);
  } catch (error) {
    console.error('Erro ao criar filial:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar filial
router.put('/:id', [
  body('nome_fantasia')
    .optional()
    .notEmpty()
    .withMessage('Nome fantasia não pode ser vazio')
    .isLength({ max: 255 })
    .withMessage('Nome fantasia deve ter no máximo 255 caracteres'),
  body('razao_social')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Razão social deve ter no máximo 255 caracteres'),
  body('cnpj')
    .optional()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    .withMessage('CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX'),
  body('tipo')
    .optional()
    .isIn(['matriz', 'filial'])
    .withMessage('Tipo deve ser matriz ou filial'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .withMessage('Telefone inválido. Use o formato (XX) XXXX-XXXX'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),
  body('gerente_responsavel')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Nome do gerente deve ter no máximo 255 caracteres'),
  body('capacidade_estoque')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacidade de estoque deve ser um número inteiro maior que 0'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    
    const filial = await Filial.findOne({
      where: { 
        id, 
        empresa_id: req.empresaId 
      }
    });

    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }

    // Verificar CNPJ duplicado (se estiver sendo alterado)
    if (req.body.cnpj && req.body.cnpj !== filial.cnpj) {
      const existingFilial = await Filial.findOne({
        where: { 
          cnpj: req.body.cnpj,
          empresa_id: req.empresaId,
          id: { [require('sequelize').Op.ne]: id }
        }
      });

      if (existingFilial) {
        return res.status(400).json({ error: 'CNPJ já cadastrado para outra filial' });
      }
    }

    // Se for alterar para matriz, verificar se já existe matriz
    if (req.body.tipo === 'matriz' && filial.tipo !== 'matriz') {
      const existingMatriz = await Filial.findOne({
        where: { 
          tipo: 'matriz',
          empresa_id: req.empresaId,
          id: { [require('sequelize').Op.ne]: id }
        }
      });

      if (existingMatriz) {
        return res.status(400).json({ error: 'Já existe uma matriz cadastrada' });
      }
    }

    await filial.update(req.body);

    return res.json(filial);
  } catch (error) {
    console.error('Erro ao atualizar filial:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir filial
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const filial = await Filial.findOne({
      where: { 
        id, 
        empresa_id: req.empresaId 
      }
    });

    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }

    // Verificar se há estoque associado a esta filial
    const Estoque = require('../models/Estoque');
    const estoqueCount = await Estoque.count({
      where: { filial_id: id }
    });

    if (estoqueCount > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir filial com estoque associado' 
      });
    }

    // Verificar se há transferências em andamento
    const TransferenciaEstoque = require('../models/TransferenciaEstoque');
    const transferenciasCount = await TransferenciaEstoque.count({
      where: {
        [require('sequelize').Op.or]: [
          { filial_origem_id: id },
          { filial_destino_id: id }
        ],
        status: ['solicitada', 'aprovada', 'em_transito']
      }
    });

    if (transferenciasCount > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir filial com transferências em andamento' 
      });
    }

    await filial.destroy();

    return res.json({ message: 'Filial excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir filial:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas das filiais
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Filial.findAll({
      where: { empresa_id: req.empresaId },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status']
    });

    const tipoStats = await Filial.findAll({
      where: { empresa_id: req.empresaId },
      attributes: [
        'tipo',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['tipo']
    });

    return res.json({
      statusStats: stats,
      tipoStats: tipoStats
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status da filial
router.patch('/:id/status', [
  body('status')
    .isIn(['ativa', 'inativa', 'em_manutencao'])
    .withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    
    const filial = await Filial.findOne({
      where: { 
        id, 
        empresa_id: req.empresaId 
      }
    });

    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }

    await filial.update({ status });

    return res.json(filial);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
