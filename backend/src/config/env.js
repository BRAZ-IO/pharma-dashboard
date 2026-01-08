require('dotenv').config();

const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'pharma_dashboard',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_SECRET: process.env.REFRESH_SECRET || 'your-refresh-secret',
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || '7d',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};

// Validação de segurança do JWT_SECRET
if (env.NODE_ENV === 'production') {
  // Em produção, JWT_SECRET deve ter no mínimo 256 bits (64 caracteres hex)
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 64) {
    console.error(' ERRO DE SEGURANÇA: JWT_SECRET deve ter no mínimo 256 bits (64 caracteres)');
    console.error('   Execute: npm run generate-secret');
    process.exit(1);
  }
  
  if (!env.REFRESH_SECRET || env.REFRESH_SECRET.length < 64) {
    console.error(' ERRO DE SEGURANÇA: REFRESH_SECRET deve ter no mínimo 256 bits (64 caracteres)');
    console.error('   Execute: npm run generate-secret');
    process.exit(1);
  }
  
  // Verificar se não está usando valores padrão
  const insecureDefaults = [
    'your-secret-key',
    'your-refresh-secret',
    'pharma_dashboard_secret_key',
    'SUBSTITUA_POR_UM_SECRET_FORTE'
  ];
  
  if (insecureDefaults.some(def => env.JWT_SECRET.includes(def))) {
    console.error(' ERRO DE SEGURANÇA: JWT_SECRET não pode usar valores padrão em produção');
    console.error('   Execute: npm run generate-secret');
    process.exit(1);
  }
}

// Aviso em desenvolvimento
if (env.NODE_ENV === 'development' && env.JWT_SECRET.length < 64) {
  console.warn('  AVISO: JWT_SECRET fraco detectado em desenvolvimento');
  console.warn('   Recomendado: npm run generate-secret');
}

module.exports = env;
