const express = require('express');
const { body } = require('express-validator');
const empresaController = require('../controllers/empresaController');

const router = express.Router();

// Validações para registro de empresa
const empresaRegistrationValidation = [
  // Dados da Empresa
  body('nomeEmpresa')
    .notEmpty()
    .withMessage('Nome da empresa é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome da empresa deve ter entre 2 e 200 caracteres'),
  
  body('razaoSocial')
    .notEmpty()
    .withMessage('Razão social é obrigatória')
    .isLength({ min: 2, max: 200 })
    .withMessage('Razão social deve ter entre 2 e 200 caracteres'),
  
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
    .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
  
  body('telefone')
    .notEmpty()
    .withMessage('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXX-XXXX'),
  
  body('email')
    .notEmpty()
    .withMessage('Email da empresa é obrigatório')
    .isEmail()
    .withMessage('Email da empresa deve ser válido'),
  
  body('cidade')
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
  
  body('estado')
    .notEmpty()
    .withMessage('Estado é obrigatório')
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres'),
  
  body('cep')
    .notEmpty()
    .withMessage('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/)
    .withMessage('CEP deve estar no formato XXXXX-XXX'),
  
  body('plano')
    .optional()
    .isIn(['basico', 'profissional', 'empresarial'])
    .withMessage('Plano inválido'),
  
  // Dados do Administrador
  body('nomeAdmin')
    .notEmpty()
    .withMessage('Nome do administrador é obrigatório')
    .isLength({ min: 2, max: 200 })
    .withMessage('Nome do administrador deve ter entre 2 e 200 caracteres'),
  
  body('emailAdmin')
    .notEmpty()
    .withMessage('Email do administrador é obrigatório')
    .isEmail()
    .withMessage('Email do administrador deve ser válido'),
  
  body('telefoneAdmin')
    .notEmpty()
    .withMessage('Telefone do administrador é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone do administrador deve estar no formato (XX) XXXX-XXXX'),
  
  body('cpfAdmin')
    .notEmpty()
    .withMessage('CPF do administrador é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .withMessage('CPF deve estar no formato XXX.XXX.XXX-XX'),
  
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número')
];

// Rotas públicas
router.post('/registrar', empresaRegistrationValidation, empresaController.registrarEmpresa);

// Rotas protegidas (requer autenticação)
router.get('/', empresaController.listarEmpresas);
router.get('/:id', empresaController.buscarEmpresaPorId);
router.put('/:id', empresaController.atualizarEmpresa);
router.patch('/:id/status', empresaController.toggleStatusEmpresa);

module.exports = router;
