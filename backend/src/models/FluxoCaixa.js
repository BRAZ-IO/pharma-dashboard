const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FluxoCaixa = sequelize.define('FluxoCaixa', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  descricao: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 500]
    }
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
      isDecimal: true
    }
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  forma_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'PIX', 'Transferência', 'TED', 'DOC', 'Boleto', 'Cheque']]
    }
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  responsavel: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      len: [2, 200]
    }
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  empresa_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  },
  venda_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendas',
      key: 'id'
    }
  }
}, {
  tableName: 'FluxoCaixa',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['empresa_id']
    },
    {
      fields: ['tipo']
    },
    {
      fields: ['data']
    },
    {
      fields: ['categoria']
    },
    {
      fields: ['venda_id']
    }
  ]
});

module.exports = FluxoCaixa;
