const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');

// Configuração customizada do Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pharma Dashboard API Docs',
  customfavIcon: '/favicon.ico'
};

// Rota para servir a documentação
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, swaggerOptions));

// Rota para obter o JSON do Swagger
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = router;
