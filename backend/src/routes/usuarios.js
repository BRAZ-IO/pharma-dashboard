const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authMiddleware, checkRole } = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.buscarPorId);
router.post('/', checkRole('admin', 'gerente'), usuariosController.criar);
router.put('/:id', checkRole('admin', 'gerente'), usuariosController.atualizar);
router.delete('/:id', checkRole('admin'), usuariosController.deletar);
router.patch('/:id/status', checkRole('admin', 'gerente'), usuariosController.alterarStatus);

module.exports = router;
