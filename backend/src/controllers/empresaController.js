const { Empresa, Usuario } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Registrar nova empresa e usuário administrador
exports.registrarEmpresa = async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        erro: 'Dados inválidos',
        detalhes: errors.array()
      });
    }

    const {
      // Dados da Empresa
      nomeEmpresa,
      cnpj,
      razaoSocial,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep,
      plano,
      
      // Dados do Administrador
      nomeAdmin,
      emailAdmin,
      telefoneAdmin,
      cpfAdmin,
      senha
    } = req.body;

    // Verificar se CNJ já existe
    const empresaExistente = await Empresa.findOne({
      where: { cnpj }
    });

    if (empresaExistente) {
      return res.status(400).json({
        erro: 'CNPJ já cadastrado',
        message: 'Este CNPJ já está registrado no sistema'
      });
    }

    // Verificar se email da empresa já existe
    const emailEmpresaExistente = await Empresa.findOne({
      where: { email }
    });

    if (emailEmpresaExistente) {
      return res.status(400).json({
        erro: 'Email da empresa já cadastrado',
        message: 'Este email de empresa já está registrado no sistema'
      });
    }

    // Verificar se email do administrador já existe
    const emailAdminExistente = await Usuario.findOne({
      where: { email: emailAdmin }
    });

    if (emailAdminExistente) {
      return res.status(400).json({
        erro: 'Email do administrador já cadastrado',
        message: 'Este email de administrador já está registrado no sistema'
      });
    }

    // Criar empresa
    const novaEmpresa = await Empresa.create({
      razao_social: razaoSocial,
      nome_fantasia: nomeEmpresa,
      cnpj,
      inscricao_estadual: '',
      telefone,
      email,
      endereco: {
        rua: endereco.rua || '',
        numero: endereco.numero || '',
        bairro: endereco.bairro || '',
        cidade,
        estado,
        cep
      },
      plano: plano || 'basico',
      ativo: true
    });

    // Hash da senha
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar usuário administrador
    const administrador = await Usuario.create({
      empresa_id: novaEmpresa.id,
      nome: nomeAdmin,
      email: emailAdmin,
      senha: senhaHash,
      cpf: cpfAdmin,
      telefone: telefoneAdmin,
      cargo: 'Administrador',
      role: 'admin',
      ativo: true
    });

    // Remover senha do retorno
    const adminResponse = { ...administrador.toJSON() };
    delete adminResponse.senha;

    res.status(201).json({
      sucesso: true,
      message: 'Empresa e administrador criados com sucesso',
      empresa: novaEmpresa,
      administrador: adminResponse
    });

  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    res.status(500).json({
      erro: 'Erro ao registrar empresa',
      message: 'Ocorreu um erro interno ao processar seu registro'
    });
  }
};

// Listar empresas (apenas para super admin)
exports.listarEmpresas = async (req, res) => {
  try {
    const { page = 1, limit = 10, busca } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (busca) {
      where[Op.or] = [
        { razao_social: { [Op.iLike]: `%${busca}%` } },
        { nome_fantasia: { [Op.iLike]: `%${busca}%` } },
        { cnpj: { [Op.iLike]: `%${busca}%` } },
        { email: { [Op.iLike]: `%${busca}%` } }
      ];
    }

    const { count, rows } = await Empresa.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      empresas: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({
      erro: 'Erro ao listar empresas',
      message: 'Ocorreu um erro interno ao buscar as empresas'
    });
  }
};

// Buscar empresa por ID
exports.buscarEmpresaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;

    // Apenas super admin pode ver outras empresas, ou a própria empresa
    if (req.userRole !== 'super_admin' && id !== empresaId) {
      return res.status(403).json({
        erro: 'Sem permissão',
        message: 'Você só pode visualizar sua própria empresa'
      });
    }

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        erro: 'Empresa não encontrada',
        message: 'A empresa solicitada não existe'
      });
    }

    res.json(empresa);

  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({
      erro: 'Erro ao buscar empresa',
      message: 'Ocorreu um erro interno ao buscar a empresa'
    });
  }
};

// Atualizar empresa
exports.atualizarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresaId } = req;
    const dadosAtualizados = req.body;

    // Apenas super admin pode atualizar outras empresas, ou a própria empresa
    if (req.userRole !== 'super_admin' && id !== empresaId) {
      return res.status(403).json({
        erro: 'Sem permissão',
        message: 'Você só pode atualizar sua própria empresa'
      });
    }

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        erro: 'Empresa não encontrada',
        message: 'A empresa solicitada não existe'
      });
    }

    await empresa.update(dadosAtualizados);

    res.json({
      sucesso: true,
      message: 'Empresa atualizada com sucesso',
      empresa
    });

  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({
      erro: 'Erro ao atualizar empresa',
      message: 'Ocorreu um erro interno ao atualizar a empresa'
    });
  }
};

// Desativar/Ativar empresa
exports.toggleStatusEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;

    // Apenas super admin pode desativar empresas
    if (req.userRole !== 'super_admin') {
      return res.status(403).json({
        erro: 'Sem permissão',
        message: 'Apenas super administradores podem alterar o status de empresas'
      });
    }

    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({
        erro: 'Empresa não encontrada',
        message: 'A empresa solicitada não existe'
      });
    }

    await empresa.update({ ativo });

    // Desativar todos os usuários da empresa se estiver desativando a empresa
    if (!ativo) {
      await Usuario.update(
        { ativo: false },
        { where: { empresa_id: id } }
      );
    }

    res.json({
      sucesso: true,
      message: `Empresa ${ativo ? 'ativada' : 'desativada'} com sucesso`,
      empresa
    });

  } catch (error) {
    console.error('Erro ao alterar status da empresa:', error);
    res.status(500).json({
      erro: 'Erro ao alterar status da empresa',
      message: 'Ocorreu um erro interno ao alterar o status da empresa'
    });
  }
};
