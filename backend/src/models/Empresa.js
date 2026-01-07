const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Razão social é obrigatória' }
    }
  },
  nome_fantasia: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cnpj: {
    type: DataTypes.STRING(18),
    unique: { msg: 'Este CNPJ já está cadastrado' },
    allowNull: false,
    validate: {
      notEmpty: { msg: 'CNPJ é obrigatório' }
    }
  },
  inscricao_estadual: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Email inválido' }
    }
  },
  endereco: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  configuracoes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  plano: {
    type: DataTypes.STRING(50),
    defaultValue: 'basico'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'empresas'
});

module.exports = Empresa;
