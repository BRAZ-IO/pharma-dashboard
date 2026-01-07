const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Venda = sequelize.define('Venda', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresa_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  numero_venda: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('venda', 'orcamento', 'devolucao'),
    defaultValue: 'venda'
  },
  status: {
    type: DataTypes.ENUM('pendente', 'finalizada', 'cancelada'),
    defaultValue: 'finalizada'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  desconto: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  acrescimo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  forma_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  parcelas: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nfce_numero: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nfce_chave: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nfce_status: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'vendas'
});

module.exports = Venda;
