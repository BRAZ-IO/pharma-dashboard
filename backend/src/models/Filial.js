const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Filial = sequelize.define('Filial', {
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
  nome_fantasia: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome fantasia é obrigatório' }
    }
  },
  razao_social: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: true,
    validate: {
      isCNPJValid(value) {
        if (value && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value)) {
          throw new Error('CNPJ inválido');
        }
      }
    }
  },
  tipo: {
    type: DataTypes.ENUM('matriz', 'filial'),
    defaultValue: 'filial'
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
    defaultValue: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil'
    }
  },
  gerente_responsavel: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  capacidade_estoque: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    validate: {
      min: { args: [1], msg: 'Capacidade deve ser maior que 0' }
    }
  },
  horario_funcionamento: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      dias: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      abertura: '08:00',
      fechamento: '18:00',
      intervalo: {
        inicio: '12:00',
        fim: '13:00'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('ativa', 'inativa', 'em_manutencao'),
    defaultValue: 'ativa'
  },
  configuracoes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      permite_transferencia_entrada: true,
      permite_transferencia_saida: true,
      exige_aprovacao_transferencia: false,
      notificar_estoque_baixo: true
    }
  }
}, {
  tableName: 'filiais',
  indexes: [
    {
      fields: ['empresa_id']
    },
    {
      fields: ['tipo']
    },
    {
      fields: ['status']
    }
  ]
});

// Associações
Filial.associate = function(models) {
  Filial.belongsTo(models.Empresa, {
    foreignKey: 'empresa_id',
    as: 'empresa'
  });

  Filial.hasMany(models.Estoque, {
    foreignKey: 'filial_id',
    as: 'estoques'
  });

  Filial.hasMany(models.TransferenciaEstoque, {
    foreignKey: 'filial_origem_id',
    as: 'transferenciasOrigem'
  });

  Filial.hasMany(models.TransferenciaEstoque, {
    foreignKey: 'filial_destino_id',
    as: 'transferenciasDestino'
  });
};

module.exports = Filial;
