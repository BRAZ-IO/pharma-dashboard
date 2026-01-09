const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Carregar configuração de ambiente primeiro
const path = require('path');
const envPath = path.resolve(__dirname, 'config', 'env.js');
const { FRONTEND_URL } = require(envPath);

const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { sanitizeAll } = require('./middlewares/sanitize');
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

// Body parser
app.use(express.json({ 
  limit: '10mb'
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Sanitização de inputs (proteção XSS)
app.use(sanitizeAll);

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
