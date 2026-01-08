const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Carregar configuração de ambiente primeiro
const path = require('path');
const envPath = path.resolve(__dirname, 'config', 'env.js');
const { FRONTEND_URL, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require(envPath);

const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { sanitizeAll } = require('./middlewares/sanitize');
const { 
  requestTimeout, 
  concurrentRequestLimiter, 
  suspiciousActivityDetector,
  arrayLimiter,
  resourceMonitor
} = require('./middlewares/dosProtection');
const routes = require('./routes');

const app = express();

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline necessário para alguns frameworks
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false, // Desabilitar se causar problemas com CORS
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));

// CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Rate limiting - Proteção DoS
// 1. Rate limiting geral (API)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas requisições',
    message: 'Você excedeu o limite de requisições. Tente novamente em 15 minutos.'
  },
  // Armazenar em memória (considerar Redis em produção)
  skip: (req) => {
    // Não aplicar rate limit em health check
    return req.path === '/api/health';
  }
});

// 2. Rate limiting severo para login (proteção contra brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Apenas 5 tentativas
  skipSuccessfulRequests: true, // Não contar logins bem-sucedidos
  message: {
    error: 'Muitas tentativas de login',
    message: 'Você excedeu o limite de tentativas. Tente novamente em 15 minutos.'
  }
});

// 3. Slowdown progressivo (aumenta delay após muitas requisições)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // Começar a atrasar após 50 requisições
  delayMs: () => 500, // Adicionar 500ms de delay por requisição extra (função para nova versão)
  maxDelayMs: 20000, // Máximo de 20 segundos de delay
  validate: { delayMs: false } // Desabilitar warning
});

// Aplicar limiters (desabilitado em testes)
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', apiLimiter);
  app.use('/api/', speedLimiter);
  app.use('/api/auth/login', loginLimiter);
}

// Body parser com limites de payload (proteção DoS)
app.use(express.json({ 
  limit: '10mb', // Limite de 10MB para JSON
  verify: (req, res, buf) => {
    // Verificar se o payload é muito grande
    if (buf.length > 10 * 1024 * 1024) {
      throw new Error('Payload muito grande');
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb',
  parameterLimit: 1000 // Máximo de 1000 parâmetros
}));

// Sanitização de inputs (proteção XSS)
app.use(sanitizeAll);

// Proteção DoS adicional (desabilitado em testes)
if (process.env.DISABLE_MIDDLEWARES !== 'true') {
  app.use(requestTimeout(30000)); // Timeout de 30 segundos
  app.use(concurrentRequestLimiter()); // Limitar requisições simultâneas
  app.use(suspiciousActivityDetector()); // Detectar atividade suspeita
  app.use(arrayLimiter(100)); // Limitar tamanho de arrays
  app.use(resourceMonitor()); // Monitorar recursos
}

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Pharma Dashboard API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      produtos: '/api/produtos'
    }
  });
});

// Tratamento de erros
app.use(notFound);
app.use(errorHandler);

// Exportar para uso em testes e servidor
module.exports = app;
