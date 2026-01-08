const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fornecedor = sequelize.define('Fornecedor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{14}$/,
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^\d{10,11}$/
    }
  },
  contato: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    defaultValue: 'ativo',
    allowNull: false
  },
  empresa_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  }
}, {
  tableName: 'Fornecedores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['empresa_id']
    },
    {
      fields: ['cnpj']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Fornecedor;
