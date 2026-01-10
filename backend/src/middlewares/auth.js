const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { Usuario } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware chamado para:', req.method, req.url);
    const authHeader = req.headers.authorization;
    console.log('📋 Authorization header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token não fornecido',
        message: 'É necessário estar autenticado para acessar este recurso'
      });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        message: 'O formato do token deve ser: Bearer [token]'
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: 'Token mal formatado',
        message: 'O token deve começar com Bearer'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado',
        message: 'O usuário associado ao token não existe'
      });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ 
        error: 'Usuário inativo',
        message: 'Este usuário está inativo no sistema'
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.empresaId = usuario.empresa_id;
    req.user = usuario;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'Seu token expirou. Faça login novamente'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'O token fornecido é inválido'
      });
    }

    return res.status(500).json({ 
      error: 'Erro ao validar token',
      message: error.message
    });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ 
        error: 'Não autenticado',
        message: 'É necessário estar autenticado'
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Sem permissão',
        message: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  };
};

module.exports = { authMiddleware, checkRole };
