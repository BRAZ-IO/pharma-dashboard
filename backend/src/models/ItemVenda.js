const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ItemVenda = sequelize.define('ItemVenda', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  venda_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vendas',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  produto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'id'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Quantidade deve ser maior que zero' }
    }
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  desconto: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  lote: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'itens_venda'
});

module.exports = ItemVenda;
