const { Fornecedor } = require('../models');
const { validationResult } = require('express-validator');

// Validação de CNPJ
const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  
  // Elimina CNPJs invalidos conhecidos
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validação do DV
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

// Listar todos os fornecedores da empresa
exports.listarTodos = async (req, res) => {
  try {
    const { empresaId } = req;
    const { page = 1, limit = 10, status, busca } = req.query;
    const offset = (page - 1) * limit;

    const where = { empresa_id: empresaId };
    if (status) where.status = status;
    if (busca) {
      where[require('sequelize').Op.or] = [
        { nome: { [require('sequelize').Op.iLike]: `%${busca}%` } },
        { cnpj: { [require('sequelize').Op.iLike]: `%${busca}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${busca}%` } }
      ];
    }

    const { count, rows } = await Fornecedor.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nome', 'ASC']]
    });

    res.json({
      fornecedores: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).json({ erro: 'Erro ao listar fornecedores' });
  }
};

// Buscar fornecedor por ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    const fornecedor = await Fornecedor.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao buscar fornecedor' });
  }
};

// Criar novo fornecedor
exports.criar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresaId } = req;
    const dados = { ...req.body, empresa_id: empresaId };

    // Validar CNPJ
    if (!validarCNPJ(dados.cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    // Verificar se CNPJ já existe na empresa
    const fornecedorExistente = await Fornecedor.findOne({
      where: { cnpj: dados.cnpj, empresa_id: empresaId }
    });

    if (fornecedorExistente) {
      return res.status(400).json({ erro: 'CNPJ já cadastrado para esta empresa' });
    }

    const fornecedor = await Fornecedor.create(dados);
    res.status(201).json(fornecedor);
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao criar fornecedor' });
  }
};

// Atualizar fornecedor
exports.atualizar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { empresaId } = req;
    const dados = req.body;

    const fornecedor = await Fornecedor.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    // Validar CNPJ se foi informado
    if (dados.cnpj && !validarCNPJ(dados.cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    // Verificar se CNPJ já existe (se estiver sendo alterado)
    if (dados.cnpj && dados.cnpj !== fornecedor.cnpj) {
      const fornecedorExistente = await Fornecedor.findOne({
        where: { cnpj: dados.cnpj, empresa_id: empresaId }
      });

      if (fornecedorExistente) {
        return res.status(400).json({ erro: 'CNPJ já cadastrado para esta empresa' });
      }
    }

    await fornecedor.update(dados);
    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao atualizar fornecedor' });
  }
};

// Excluir fornecedor
exports.excluir = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    const fornecedor = await Fornecedor.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    await fornecedor.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error);
    res.status(500).json({ erro: 'Erro ao excluir fornecedor' });
  }
};

// Buscar fornecedor por CNPJ
exports.buscarPorCNPJ = async (req, res) => {
  try {
    const { cnpj } = req.params;
    const { empresaId } = req;

    // Limpar CNPJ (remover caracteres não numéricos)
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');

    if (!validarCNPJ(cnpjLimpo)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    const fornecedor = await Fornecedor.findOne({
      where: { cnpj: cnpjLimpo, empresa_id: empresaId }
    });

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado' });
    }

    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor por CNPJ:', error);
    res.status(500).json({ erro: 'Erro ao buscar fornecedor' });
  }
};
