const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Estoque = sequelize.define('Estoque', {
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
  },
  custo_medio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  ultima_atualizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  usuario_atualizacao_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'estoque',
  indexes: [
    {
      unique: true,
      fields: ['empresa_id', 'produto_id', 'lote']
    },
    {
      fields: ['empresa_id']
    },
    {
      fields: ['produto_id']
    }
  ]
});

module.exports = Estoque;
