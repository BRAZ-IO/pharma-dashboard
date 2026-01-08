const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * /api/2fa/status:
 *   get:
 *     summary: Verificar status do 2FA
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status do 2FA
 */
router.get('/status', authMiddleware, twoFactorController.status);

/**
 * @swagger
 * /api/2fa/setup:
 *   post:
 *     summary: Configurar 2FA (gerar QR Code)
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR Code gerado
 */
router.post('/setup', authMiddleware, twoFactorController.setup);

/**
 * @swagger
 * /api/2fa/verify:
 *   post:
 *     summary: Verificar código e ativar 2FA
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA ativado com sucesso
 */
router.post('/verify', authMiddleware, twoFactorController.verify);

/**
 * @swagger
 * /api/2fa/validate:
 *   post:
 *     summary: Validar token 2FA no login
 *     tags: [2FA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - token
 *             properties:
 *               userId:
 *                 type: string
 *               token:
 *                 type: string
 *               isBackupCode:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Token válido
 */
router.post('/validate', twoFactorController.validate);

/**
 * @swagger
 * /api/2fa/disable:
 *   post:
 *     summary: Desativar 2FA
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senha
 *               - token
 *             properties:
 *               senha:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA desativado
 */
router.post('/disable', authMiddleware, twoFactorController.disable);

/**
 * @swagger
 * /api/2fa/backup-codes:
 *   post:
 *     summary: Gerar novos códigos de backup
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senha
 *               - token
 *             properties:
 *               senha:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Novos códigos gerados
 */
router.post('/backup-codes', authMiddleware, twoFactorController.regenerateBackupCodes);

module.exports = router;
