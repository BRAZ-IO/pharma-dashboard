// Setup global para testes
// Este arquivo é executado antes de todos os testes

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_testing_only_do_not_use_in_production';
process.env.JWT_EXPIRES_IN = '1h';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';

// Desabilitar middlewares de proteção durante testes
process.env.DISABLE_MIDDLEWARES = 'true';

// Aumentar timeout para testes de banco de dados
jest.setTimeout(30000);
