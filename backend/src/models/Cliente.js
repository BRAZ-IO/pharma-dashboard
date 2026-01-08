const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('Cliente', {
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
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: true,
    validate: {
      is: /^\d{11}$/
    }
  },
  cnpj: {
    type: DataTypes.STRING(14),
    allowNull: true,
    validate: {
      is: /^\d{14}$/
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
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_cadastro: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false
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
  tableName: 'Clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['empresa_id']
    },
    {
      fields: ['cpf']
    },
    {
      fields: ['cnpj']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Cliente;
