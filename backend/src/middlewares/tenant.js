const { Usuario } = require('../models');

/**
 * Middleware de isolamento multi-tenant
 * Garante que cada usuário só acesse dados da sua própria empresa
 */
const tenantMiddleware = async (req, res, next) => {
  try {
    // Buscar empresa_id do usuário logado
    const usuario = await Usuario.findByPk(req.userId, {
      attributes: ['empresa_id']
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário associado ao token não existe'
      });
    }

    // Adicionar empresa_id ao request para uso nos controllers
    req.empresaId = usuario.empresa_id;

    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao validar tenant',
      message: error.message
    });
  }
};

/**
 * Helper para adicionar filtro de empresa nas queries
 */
const addTenantFilter = (where, empresaId) => {
  return {
    ...where,
    empresa_id: empresaId
  };
};

module.exports = { tenantMiddleware, addTenantFilter };
