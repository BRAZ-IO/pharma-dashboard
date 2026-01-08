const { FluxoCaixa } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Listar todas as transações de fluxo de caixa da empresa
exports.listarTodos = async (req, res) => {
  try {
    const { empresaId } = req;
    const { 
      page = 1, 
      limit = 10, 
      tipo, 
      categoria, 
      dataInicio, 
      dataFim, 
      busca 
    } = req.query;
    const offset = (page - 1) * limit;

    const where = { empresa_id: empresaId };
    
    if (tipo) where.tipo = tipo;
    if (categoria) where.categoria = categoria;
    
    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data[Op.gte] = dataInicio;
      if (dataFim) where.data[Op.lte] = dataFim;
    }
    
    if (busca) {
      where[Op.or] = [
        { descricao: { [Op.iLike]: `%${busca}%` } },
        { categoria: { [Op.iLike]: `%${busca}%` } },
        { responsavel: { [Op.iLike]: `%${busca}%` } }
      ];
    }

    const { count, rows } = await FluxoCaixa.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['data', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      transacoes: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({ erro: 'Erro ao listar transações' });
  }
};

// Buscar transação por ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    const transacao = await FluxoCaixa.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    res.json(transacao);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ erro: 'Erro ao buscar transação' });
  }
};

// Criar nova transação
exports.criar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresaId } = req;
    const dados = { ...req.body, empresa_id: empresaId };

    const transacao = await FluxoCaixa.create(dados);
    res.status(201).json(transacao);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ erro: 'Erro ao criar transação' });
  }
};

// Atualizar transação
exports.atualizar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { empresaId } = req;
    const dados = req.body;

    const transacao = await FluxoCaixa.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    await transacao.update(dados);
    res.json(transacao);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ erro: 'Erro ao atualizar transação' });
  }
};

// Excluir transação
exports.excluir = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    const transacao = await FluxoCaixa.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    await transacao.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ erro: 'Erro ao excluir transação' });
  }
};

// Obter resumo do fluxo de caixa
exports.obterResumo = async (req, res) => {
  try {
    const { empresaId } = req;
    const { dataInicio, dataFim } = req.query;

    const where = { empresa_id: empresaId };
    
    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data[Op.gte] = dataInicio;
      if (dataFim) where.data[Op.lte] = dataFim;
    }

    // Buscar totais por tipo
    const [entradas, saidas] = await Promise.all([
      FluxoCaixa.sum('valor', {
        where: { ...where, tipo: 'entrada' }
      }),
      FluxoCaixa.sum('valor', {
        where: { ...where, tipo: 'saida' }
      })
    ]);

    // Buscar quantidade de transações
    const [qtdEntradas, qtdSaidas] = await Promise.all([
      FluxoCaixa.count({
        where: { ...where, tipo: 'entrada' }
      }),
      FluxoCaixa.count({
        where: { ...where, tipo: 'saida' }
      })
    ]);

    // Buscar transações recentes
    const transacoesRecentes = await FluxoCaixa.findAll({
      where,
      limit: 10,
      order: [['data', 'DESC'], ['created_at', 'DESC']]
    });

    const totalEntradas = entradas || 0;
    const totalSaidas = saidas || 0;
    const saldo = totalEntradas - totalSaidas;

    res.json({
      totalEntradas,
      totalSaidas,
      saldo,
      qtdEntradas,
      qtdSaidas,
      transacoesRecentes
    });
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    res.status(500).json({ erro: 'Erro ao obter resumo do fluxo de caixa' });
  }
};

// Obter dados para relatórios
exports.obterRelatorio = async (req, res) => {
  try {
    const { empresaId } = req;
    const { 
      tipo = 'mensal', 
      dataInicio, 
      dataFim,
      agruparPor = 'categoria' 
    } = req.query;

    const where = { empresa_id: empresaId };
    
    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data[Op.gte] = dataInicio;
      if (dataFim) where.data[Op.lte] = dataFim;
    }

    let dados;

    switch (agruparPor) {
      case 'categoria':
        dados = await FluxoCaixa.findAll({
          attributes: [
            'categoria',
            'tipo',
            [FluxoCaixa.sequelize.fn('SUM', FluxoCaixa.sequelize.col('valor')), 'total'],
            [FluxoCaixa.sequelize.fn('COUNT', FluxoCaixa.sequelize.col('id')), 'quantidade']
          ],
          where,
          group: ['categoria', 'tipo'],
          order: [[FluxoCaixa.sequelize.fn('SUM', FluxoCaixa.sequelize.col('valor')), 'DESC']]
        });
        break;

      case 'mensal':
        dados = await FluxoCaixa.findAll({
          attributes: [
            [FluxoCaixa.sequelize.fn('DATE_TRUNC', 'month', FluxoCaixa.sequelize.col('data')), 'mes'],
            'tipo',
            [FluxoCaixa.sequelize.fn('SUM', FluxoCaixa.sequelize.col('valor')), 'total'],
            [FluxoCaixa.sequelize.fn('COUNT', FluxoCaixa.sequelize.col('id')), 'quantidade']
          ],
          where,
          group: ['mes', 'tipo'],
          order: [['mes', 'ASC']]
        });
        break;

      case 'diario':
        dados = await FluxoCaixa.findAll({
          attributes: [
            'data',
            'tipo',
            [FluxoCaixa.sequelize.fn('SUM', FluxoCaixa.sequelize.col('valor')), 'total'],
            [FluxoCaixa.sequelize.fn('COUNT', FluxoCaixa.sequelize.col('id')), 'quantidade']
          ],
          where,
          group: ['data', 'tipo'],
          order: [['data', 'ASC']]
        });
        break;

      default:
        dados = await FluxoCaixa.findAll({
          where,
          order: [['data', 'DESC'], ['created_at', 'DESC']]
        });
    }

    res.json({
      tipo,
      periodo: { dataInicio, dataFim },
      agruparPor,
      dados
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
};

// Obter categorias disponíveis
exports.obterCategorias = async (req, res) => {
  try {
    const { empresaId } = req;
    const { tipo } = req.query;

    const where = { empresa_id: empresaId };
    if (tipo) where.tipo = tipo;

    const categorias = await FluxoCaixa.findAll({
      attributes: [
        [FluxoCaixa.sequelize.fn('DISTINCT', FluxoCaixa.sequelize.col('categoria')), 'categoria']
      ],
      where,
      order: [['categoria', 'ASC']]
    });

    res.json({
      categorias: categorias.map(c => c.categoria)
    });
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    res.status(500).json({ erro: 'Erro ao obter categorias' });
  }
};
