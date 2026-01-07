const { Usuario } = require('../models');
const { Op } = require('sequelize');

const usuariosController = {
  // GET /api/usuarios
  async listar(req, res, next) {
    try {
      const { page = 1, limit = 10, search, ativo, role } = req.query;
      const offset = (page - 1) * limit;

      const where = {};

      if (search) {
        where[Op.or] = [
          { nome: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { cpf: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (ativo !== undefined) {
        where.ativo = ativo === 'true';
      }

      if (role) {
        where.role = role;
      }

      const { count, rows: usuarios } = await Usuario.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        usuarios,
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

  // GET /api/usuarios/:id
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      res.json({ usuario: usuario.toJSON() });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/usuarios
  async criar(req, res, next) {
    try {
      const { nome, email, senha, cpf, telefone, cargo, role } = req.body;

      const usuario = await Usuario.create({
        nome,
        email,
        senha,
        cpf,
        telefone,
        cargo,
        role: role || 'funcionario'
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        usuario: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/usuarios/:id
  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { nome, email, cpf, telefone, cargo, role } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      await usuario.update({
        nome: nome || usuario.nome,
        email: email || usuario.email,
        cpf: cpf !== undefined ? cpf : usuario.cpf,
        telefone: telefone !== undefined ? telefone : usuario.telefone,
        cargo: cargo || usuario.cargo,
        role: role || usuario.role
      });

      res.json({
        message: 'Usuário atualizado com sucesso',
        usuario: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/usuarios/:id
  async deletar(req, res, next) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Soft delete - apenas desativa
      await usuario.update({ ativo: false });

      res.json({
        message: 'Usuário desativado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/usuarios/:id/status
  async alterarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      await usuario.update({ ativo });

      res.json({
        message: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso`,
        usuario: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = usuariosController;
