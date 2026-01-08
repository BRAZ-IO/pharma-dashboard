const { Cliente } = require('../models');
const { validationResult } = require('express-validator');

// Validação de CPF
const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  
  // Elimina CPFs invalidos conhecidos
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do DV
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

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

// Listar todos os clientes da empresa
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
        { cpf: { [require('sequelize').Op.iLike]: `%${busca}%` } },
        { cnpj: { [require('sequelize').Op.iLike]: `%${busca}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${busca}%` } }
      ];
    }

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nome', 'ASC']]
    });

    res.json({
      clientes: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
};

// Buscar cliente por ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    const cliente = await Cliente.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

// Criar novo cliente
exports.criar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresaId } = req;
    const dados = { ...req.body, empresa_id: empresaId };

    // Validar CPF ou CNPJ
    if (dados.cpf && !validarCPF(dados.cpf)) {
      return res.status(400).json({ erro: 'CPF inválido' });
    }

    if (dados.cnpj && !validarCNPJ(dados.cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    // Verificar se CPF/CNPJ já existe na empresa
    const where = { empresa_id: empresaId };
    if (dados.cpf) {
      where.cpf = dados.cpf;
    }
    if (dados.cnpj) {
      where.cnpj = dados.cnpj;
    }

    const clienteExistente = await Cliente.findOne({ where });

    if (clienteExistente) {
      return res.status(400).json({ erro: 'CPF/CNPJ já cadastrado para esta empresa' });
    }

    const cliente = await Cliente.create(dados);
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

// Atualizar cliente
exports.atualizar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { empresaId } = req;
    const dados = req.body;

    const cliente = await Cliente.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    // Validar CPF/CNPJ se foi informado
    if (dados.cpf && !validarCPF(dados.cpf)) {
      return res.status(400).json({ erro: 'CPF inválido' });
    }

    if (dados.cnpj && !validarCNPJ(dados.cnpj)) {
      return res.status(400).json({ erro: 'CNPJ inválido' });
    }

    // Verificar se CPF/CNPJ já existe (se estiver sendo alterado)
    if ((dados.cpf && dados.cpf !== cliente.cpf) || (dados.cnpj && dados.cnpj !== cliente.cnpj)) {
      const where = { empresa_id: empresaId };
      if (dados.cpf) {
        where.cpf = dados.cpf;
      }
      if (dados.cnpj) {
        where.cnpj = dados.cnpj;
      }

      const clienteExistente = await Cliente.findOne({ where });

      if (clienteExistente) {
        return res.status(400).json({ erro: 'CPF/CNPJ já cadastrado para esta empresa' });
      }
    }

    await cliente.update(dados);
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

// Excluir cliente
exports.excluir = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    const cliente = await Cliente.findOne({
      where: { id, empresa_id: empresaId }
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ erro: 'Erro ao excluir cliente' });
  }
};

// Buscar cliente por CPF
exports.buscarPorCPF = async (req, res) => {
  try {
    const { cpf } = req.params;
    const { empresaId } = req;

    // Limpar CPF (remover caracteres não numéricos)
    const cpfLimpo = cpf.replace(/[^\d]/g, '');

    if (!validarCPF(cpfLimpo)) {
      return res.status(400).json({ erro: 'CPF inválido' });
    }

    const cliente = await Cliente.findOne({
      where: { cpf: cpfLimpo, empresa_id: empresaId }
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente por CPF:', error);
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};
