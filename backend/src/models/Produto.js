const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Produto = sequelize.define('Produto', {
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
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome do produto é obrigatório' }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  subcategoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fabricante: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  principio_ativo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  apresentacao: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  dosagem: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  preco_custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  preco_venda: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Preço de venda deve ser maior que zero' }
    }
  },
  margem_lucro: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  ncm: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  cst: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  requer_receita: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  controlado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  generico: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  imagem_url: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'produtos',
  indexes: [
    {
      unique: true,
      fields: ['empresa_id', 'codigo_barras']
    }
  ]
});

module.exports = Produto;
