const { Produto, Estoque } = require('../models');
const { Op } = require('sequelize');

const produtosController = {
  // GET /api/produtos
  async listar(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        categoria, 
        ativo,
        requer_receita,
        controlado 
      } = req.query;
      
      const offset = (page - 1) * limit;
      const where = {
        empresa_id: req.empresaId // ISOLAMENTO MULTI-TENANT
      };

      if (search) {
        where[Op.or] = [
          { nome: { [Op.iLike]: `%${search}%` } },
          { codigo_barras: { [Op.iLike]: `%${search}%` } },
          { fabricante: { [Op.iLike]: `%${search}%` } },
          { principio_ativo: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (categoria) where.categoria = categoria;
      if (ativo !== undefined) where.ativo = ativo === 'true';
      if (requer_receita !== undefined) where.requer_receita = requer_receita === 'true';
      if (controlado !== undefined) where.controlado = controlado === 'true';

      const { count, rows: produtos } = await Produto.findAndCountAll({
        where,
        include: [{
          model: Estoque,
          as: 'estoques',
          attributes: ['quantidade_atual', 'lote', 'data_validade'],
          required: false // Não falhar se não houver estoque
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nome', 'ASC']]
      });

      // Processar produtos para incluir estoque_atual
      const produtosComEstoque = produtos.map(produto => {
        const produtoData = produto.toJSON();
        
        // Calcular estoque total (soma de todas as filiais)
        const estoqueTotal = produto.estoques?.reduce((total, estoque) => {
          return total + (estoque.quantidade_atual || 0);
        }, 0) || 0;
        
        // Adicionar estoque_atual diretamente no produto
        produtoData.estoque_atual = estoqueTotal;
        
        return produtoData;
      });

      res.json({
        produtos: produtosComEstoque,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/produtos/:id
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      const produto = await Produto.findOne({
        where: { 
          id,
          empresa_id: req.empresaId // ISOLAMENTO MULTI-TENANT
        },
        include: [{
          model: Estoque,
          as: 'estoques',
          where: { empresa_id: req.empresaId },
          required: false // Não falhar se não houver estoque
        }]
      });

      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado'
        });
      }

      // Processar produto para incluir estoque_atual
      const produtoData = produto.toJSON();
      
      // Calcular estoque total (soma de todas as filiais)
      const estoqueTotal = produto.estoques?.reduce((total, estoque) => {
        return total + (estoque.quantidade_atual || 0);
      }, 0) || 0;
      
      // Adicionar estoque_atual diretamente no produto
      produtoData.estoque_atual = estoqueTotal;

      res.json({ produto: produtoData });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/produtos/codigo-barras/:codigo
  async buscarPorCodigoBarras(req, res, next) {
    try {
      const { codigo } = req.params;

      const produto = await Produto.findOne({
        where: { 
          codigo_barras: codigo,
          empresa_id: req.empresaId // ISOLAMENTO MULTI-TENANT
        },
        include: [{
          model: Estoque,
          as: 'estoques',
          where: { empresa_id: req.empresaId },
          required: false // Não falhar se não houver estoque
        }]
      });

      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado'
        });
      }

      // Processar produto para incluir estoque_atual
      const produtoData = produto.toJSON();
      
      // Calcular estoque total (soma de todas as filiais)
      const estoqueTotal = produto.estoques?.reduce((total, estoque) => {
        return total + (estoque.quantidade_atual || 0);
      }, 0) || 0;
      
      // Adicionar estoque_atual diretamente no produto
      produtoData.estoque_atual = estoqueTotal;

      res.json({ produto: produtoData });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/produtos
  async criar(req, res, next) {
    try {
      const produtoData = {
        ...req.body,
        empresa_id: req.empresaId // ISOLAMENTO MULTI-TENANT
      };

      const produto = await Produto.create(produtoData);

      // Criar registro de estoque inicial
      await Estoque.create({
        empresa_id: req.empresaId, // ISOLAMENTO MULTI-TENANT
        produto_id: produto.id,
        quantidade_atual: 0,
        quantidade_minima: 10,
        quantidade_maxima: 1000
      });

      res.status(201).json({
        message: 'Produto criado com sucesso',
        produto
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/produtos/:id
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const produtoData = req.body;

      const produto = await Produto.findOne({
        where: { 
          id,
          empresa_id: req.empresaId // ISOLAMENTO MULTI-TENANT
        }
      });

      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado'
        });
      }

      await produto.update(produtoData);

      res.json({
        message: 'Produto atualizado com sucesso',
        produto
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/produtos/:id
  async deletar(req, res, next) {
    try {
      const { id } = req.params;

      const produto = await Produto.findOne({
        where: { 
          id,
          empresa_id: req.empresaId // ISOLAMENTO MULTI-TENANT
        }
      });

      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado'
        });
      }

      // Soft delete
      await produto.update({ ativo: false });

      res.json({
        message: 'Produto desativado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = produtosController;
