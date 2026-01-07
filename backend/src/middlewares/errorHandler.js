const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      error: 'Erro de validação',
      details: errors
    });
  }

  // Erro de constraint única do Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      error: 'Registro duplicado',
      message: `Este ${field} já está cadastrado no sistema`
    });
  }

  // Erro de chave estrangeira
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Referência inválida',
      message: 'O registro referenciado não existe'
    });
  }

  // Erro de conexão com banco
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Erro de conexão',
      message: 'Não foi possível conectar ao banco de dados'
    });
  }

  // Erro padrão
  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: err.name || 'ServerError',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.url} não existe`
  });
};

module.exports = { errorHandler, notFound };
