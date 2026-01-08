const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransferenciaEstoque = sequelize.define('TransferenciaEstoque', {
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
  filial_origem_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'filiais',
      key: 'id'
    }
  },
  filial_destino_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'filiais',
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
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Quantidade deve ser maior que 0' }
    }
  },
  lote: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  data_validade: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  motivo_transferencia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('solicitada', 'aprovada', 'rejeitada', 'em_transito', 'concluida', 'cancelada'),
    defaultValue: 'solicitada'
  },
  usuario_solicitante_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  usuario_aprovador_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  data_solicitacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  data_aprovacao: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_envio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_recebimento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  numero_nota_fiscal: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  valor_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  custo_transferencia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  }
}, {
  tableName: 'transferencias_estoque',
  indexes: [
    {
      fields: ['empresa_id']
    },
    {
      fields: ['filial_origem_id']
    },
    {
      fields: ['filial_destino_id']
    },
    {
      fields: ['produto_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['data_solicitacao']
    }
  ]
});

// Associações
TransferenciaEstoque.associate = function(models) {
  TransferenciaEstoque.belongsTo(models.Empresa, {
    foreignKey: 'empresa_id',
    as: 'empresa'
  });

  TransferenciaEstoque.belongsTo(models.Filial, {
    foreignKey: 'filial_origem_id',
    as: 'filialOrigem'
  });

  TransferenciaEstoque.belongsTo(models.Filial, {
    foreignKey: 'filial_destino_id',
    as: 'filialDestino'
  });

  TransferenciaEstoque.belongsTo(models.Produto, {
    foreignKey: 'produto_id',
    as: 'produto'
  });

  TransferenciaEstoque.belongsTo(models.Usuario, {
    foreignKey: 'usuario_solicitante_id',
    as: 'usuarioSolicitante'
  });

  TransferenciaEstoque.belongsTo(models.Usuario, {
    foreignKey: 'usuario_aprovador_id',
    as: 'usuarioAprovador'
  });
};

module.exports = TransferenciaEstoque;
