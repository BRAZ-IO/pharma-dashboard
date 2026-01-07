const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const gerarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email,
      role: usuario.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const authController = {
  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          error: 'Dados incompletos',
          message: 'Email e senha são obrigatórios'
        });
      }

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
      }

      if (!usuario.ativo) {
        return res.status(401).json({
          error: 'Usuário inativo',
          message: 'Este usuário está inativo no sistema'
        });
      }

      const senhaValida = await usuario.validarSenha(senha);

      if (!senhaValida) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
      }

      // Atualizar último login
      await usuario.update({ ultimo_login: new Date() });

      const token = gerarToken(usuario);

      res.json({
        message: 'Login realizado com sucesso',
        token,
        usuario: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { nome, email, senha, cpf, telefone, cargo } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          error: 'Dados incompletos',
          message: 'Nome, email e senha são obrigatórios'
        });
      }

      const usuarioExiste = await Usuario.findOne({ where: { email } });

      if (usuarioExiste) {
        return res.status(409).json({
          error: 'Email já cadastrado',
          message: 'Este email já está em uso'
        });
      }

      const usuario = await Usuario.create({
        nome,
        email,
        senha,
        cpf,
        telefone,
        cargo: cargo || 'Funcionário',
        role: 'funcionario'
      });

      const token = gerarToken(usuario);

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        token,
        usuario: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me
  async me(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        usuario: usuario.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/refresh
  async refresh(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.userId);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      const token = gerarToken(usuario);

      res.json({
        message: 'Token renovado com sucesso',
        token
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
