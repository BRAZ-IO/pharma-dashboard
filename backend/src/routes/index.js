const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usuariosRoutes = require('./usuarios');
const produtosRoutes = require('./produtos');
const twoFactorRoutes = require('./twoFactor');
const swaggerRoutes = require('./swagger');
const fornecedoresRoutes = require('./fornecedores');
const clientesRoutes = require('./clientes');
const fluxoCaixaRoutes = require('./fluxoCaixa');
const filiaisRoutes = require('./filiais');
const transferenciasRoutes = require('./transferencias');

// Documentação Swagger
router.use('/docs', swaggerRoutes);

// Rotas da API
router.use('/auth', authRoutes);
router.use('/2fa', twoFactorRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/produtos', produtosRoutes);
router.use('/fornecedores', fornecedoresRoutes);
router.use('/clientes', clientesRoutes);
router.use('/fluxo-caixa', fluxoCaixaRoutes);
router.use('/filiais', filiaisRoutes);
router.use('/transferencias', transferenciasRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
