const express = require('express');
const { body } = require('express-validator');
const clienteController = require('../controllers/clienteController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Validações
const clienteValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome deve ter entre 2 e 200 caracteres'),
  body('cpf')
    .optional()
    .matches(/^\d{11}$/)
    .withMessage('CPF deve conter apenas 11 dígitos'),
  body('cnpj')
    .optional()
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
  body('endereco')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Endereço deve ter no máximo 1000 caracteres'),
  body('data_cadastro')
    .optional()
    .isISO8601()
    .withMessage('Data de cadastro deve ser uma data válida'),
  body('status')
    .optional()
    .isIn(['ativo', 'inativo'])
    .withMessage('Status deve ser ativo ou inativo')
];

// Validação customizada: CPF ou CNPJ é obrigatório
const validateCPFCNPJ = (req, res, next) => {
  const { cpf, cnpj } = req.body;
  if (!cpf && !cnpj) {
    return res.status(400).json({ erro: 'CPF ou CNPJ é obrigatório' });
  }
  next();
};

// Rotas
router.get('/', clienteController.listarTodos);
router.get('/cpf/:cpf', clienteController.buscarPorCPF);
router.get('/:id', clienteController.buscarPorId);
router.post('/', clienteValidation, validateCPFCNPJ, clienteController.criar);
router.put('/:id', clienteValidation, clienteController.atualizar);
router.delete('/:id', clienteController.excluir);

module.exports = router;
