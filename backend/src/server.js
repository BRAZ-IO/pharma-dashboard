require('dotenv').config();
const app = require('./app');
const { sequelize, testConnection } = require('./config/database');
const { PORT, NODE_ENV } = require('./config/env');

const startServer = async () => {
  try {
    // Testar conexão com banco
    console.log('🔄 Testando conexão com PostgreSQL...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Não foi possível conectar ao banco de dados');
      process.exit(1);
    }

    // Sincronizar models com banco (apenas em desenvolvimento)
    if (NODE_ENV === 'development') {
      console.log('🔄 Sincronizando models com banco de dados...');
      await sequelize.sync({ alter: true });
      console.log('✅ Models sincronizados com sucesso!');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🚀 Ambiente: ${NODE_ENV}`);
      console.log(`🚀 URL: http://localhost:${PORT}`);
      console.log(`🚀 API: http://localhost:${PORT}/api`);
      console.log('🚀 ========================================');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();
