const express = require('express');
const { body } = require('express-validator');
const fornecedorController = require('../controllers/fornecedorController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Validações
const fornecedorValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .matches(/^\d{14}$/)
    .withMessage('CNPJ deve conter apenas 14 dígitos'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),
  body('telefone')
    .optional()
    .matches(/^\d{10,11}$/)
    .withMessage('Telefone deve conter apenas 10 ou 11 dígitos'),
  body('contato')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Contato deve ter no máximo 200 caracteres'),
  body('endereco')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Endereço deve ter no máximo 1000 caracteres'),
  body('status')
    .optional()
    .isIn(['ativo', 'inativo'])
    .withMessage('Status deve ser ativo ou inativo')
];

// Rotas
router.get('/', fornecedorController.listarTodos);
router.get('/cnpj/:cnpj', fornecedorController.buscarPorCNPJ);
router.get('/:id', fornecedorController.buscarPorId);
router.post('/', fornecedorValidation, fornecedorController.criar);
router.put('/:id', fornecedorValidation, fornecedorController.atualizar);
router.delete('/:id', fornecedorController.excluir);

module.exports = router;
