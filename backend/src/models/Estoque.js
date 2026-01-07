const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Estoque = sequelize.define('Estoque', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  produto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'id'
    }
  },
  quantidade_atual: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Quantidade não pode ser negativa' }
    }
  },
  quantidade_minima: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  quantidade_maxima: {
    type: DataTypes.INTEGER,
    defaultValue: 1000
  },
  lote: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  data_fabricacao: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  data_validade: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  localizacao: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'estoque',
  indexes: [
    {
      unique: true,
      fields: ['produto_id', 'lote']
    }
  ]
});

module.exports = Estoque;
