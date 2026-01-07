const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas protegidas
router.get('/me', authMiddleware, authController.me);
router.post('/refresh', authMiddleware, authController.refresh);

module.exports = router;
