const express = require('express');
const { body } = require('express-validator');
const fluxoCaixaController = require('../controllers/fluxoCaixaController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Validações
const fluxoCaixaValidation = [
  body('descricao')
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 2, max: 500 })
    .withMessage('Descrição deve ter entre 2 e 500 caracteres'),
  body('tipo')
    .notEmpty()
    .withMessage('Tipo é obrigatório')
    .isIn(['entrada', 'saida'])
    .withMessage('Tipo deve ser entrada ou saida'),
  body('valor')
    .notEmpty()
    .withMessage('Valor é obrigatório')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que 0'),
  body('categoria')
    .notEmpty()
    .withMessage('Categoria é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Categoria deve ter entre 2 e 100 caracteres'),
  body('forma_pagamento')
    .optional()
    .isIn(['Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'PIX', 'Transferência', 'TED', 'DOC', 'Boleto', 'Cheque'])
    .withMessage('Forma de pagamento inválida'),
  body('data')
    .optional()
    .isISO8601()
    .withMessage('Data deve ser uma data válida'),
  body('responsavel')
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage('Responsável deve ter entre 2 e 200 caracteres'),
  body('observacoes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Observações devem ter no máximo 1000 caracteres')
];

// Rotas
router.get('/', fluxoCaixaController.listarTodos);
router.get('/pdv', fluxoCaixaController.listarTransacoesPDV);
router.get('/resumo', fluxoCaixaController.obterResumo);
router.get('/relatorio', fluxoCaixaController.obterRelatorio);
router.get('/categorias', fluxoCaixaController.obterCategorias);
router.get('/:id', fluxoCaixaController.buscarPorId);
router.post('/', fluxoCaixaValidation, fluxoCaixaController.criar);
router.put('/:id', fluxoCaixaValidation, fluxoCaixaController.atualizar);
router.delete('/:id', fluxoCaixaController.excluir);

module.exports = router;
