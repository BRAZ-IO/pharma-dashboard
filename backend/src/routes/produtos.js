const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');
const { authMiddleware, checkRole } = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', produtosController.listar);
router.get('/codigo-barras/:codigo', produtosController.buscarPorCodigoBarras);
router.get('/:id', produtosController.buscarPorId);
router.post('/', checkRole('admin', 'gerente'), produtosController.criar);
router.put('/:id', checkRole('admin', 'gerente'), produtosController.atualizar);
router.delete('/:id', checkRole('admin'), produtosController.deletar);

module.exports = router;
