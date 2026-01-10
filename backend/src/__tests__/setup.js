// Setup global para testes
// Este arquivo é executado antes de todos os testes

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_testing_only_do_not_use_in_production';
process.env.JWT_EXPIRES_IN = '1h';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';

// Configurações de pagamento para testes
process.env.DEFAULT_PAYMENT_GATEWAY = 'simulado';
process.env.MERCADO_PAGO_ACCESS_TOKEN = 'TEST_ACCESS_TOKEN';
process.env.STRIPE_SECRET_KEY = 'sk_test_123';
process.env.PAGSEGURO_EMAIL = 'test@example.com';
process.env.PAGSEGURO_TOKEN = 'TEST_TOKEN';

// Desabilitar middlewares de proteção durante testes
process.env.DISABLE_MIDDLEWARES = 'true';

// Aumentar timeout para testes de banco de dados
jest.setTimeout(30000);

// Configurações do banco de dados para testes (usar o banco principal)
process.env.DB_NAME = process.env.DB_NAME || 'pharma_dashboard';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'root';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';

// Criar banco de teste se não existir
const { Client } = require('pg');

const createTestDatabase = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres' // Conectar ao banco default para criar o banco de teste
  });

  try {
    await client.connect();
    
    // Verificar se o banco de teste existe
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      ['pharma_dashboard_test']
    );
    
    if (result.rows.length === 0) {
      // Criar banco de teste
      await client.query('CREATE DATABASE pharma_dashboard_test');
      console.log('✅ Banco de teste pharma_dashboard_test criado');
    } else {
      console.log('✅ Banco de teste pharma_dashboard_test já existe');
    }
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro ao criar banco de teste:', error);
    await client.end();
  }
};

// Executar criação do banco de teste
createTestDatabase();
