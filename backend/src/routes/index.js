const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usuariosRoutes = require('./usuarios');
const produtosRoutes = require('./produtos');

// Rotas da API
router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/produtos', produtosRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
