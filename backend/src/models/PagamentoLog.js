const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PagamentoLog = sequelize.define('PagamentoLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pagamento_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'pagamentos',
        key: 'id'
      }
    },
    empresa_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'empresas',
        key: 'id'
      }
    },
    tipo_evento: {
      type: DataTypes.ENUM(
        'criado', 
        'processando', 
        'aprovado', 
        'rejeitado', 
        'cancelado', 
        'reembolsado', 
        'webhook_recebido',
        'status_atualizado',
        'estornado',
        'erro'
      ),
      allowNull: false
    },
    status_anterior: {
      type: DataTypes.ENUM('pendente', 'processando', 'aprovado', 'rejeitado', 'cancelado', 'reembolsado', 'contestado'),
      allowNull: true
    },
    status_novo: {
      type: DataTypes.ENUM('pendente', 'processando', 'aprovado', 'rejeitado', 'cancelado', 'reembolsado', 'contestado'),
      allowNull: true
    },
    dados_requisicao: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Dados enviados para o gateway'
    },
    dados_resposta: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Resposta do gateway'
    },
    webhook_data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Dados recebidos via webhook'
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem descritiva do evento'
    },
    erro_codigo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Código de erro (se aplicável)'
    },
    erro_mensagem: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem de erro detalhada'
    },
    ip_origem: {
      type: DataTypes.INET,
      allowNull: true,
      comment: 'IP de origem da requisição'
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User Agent do cliente'
    },
    gateway: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Gateway que processou o evento'
    },
    duracao_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duração do processamento em milissegundos'
    }
  }, {
    tableName: 'pagamentos_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['pagamento_id']
      },
      {
        fields: ['empresa_id']
      },
      {
        fields: ['tipo_evento']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['gateway']
      }
    ]
  });

  // Associações
  PagamentoLog.associate = (models) => {
    PagamentoLog.belongsTo(models.Pagamento, {
      foreignKey: 'pagamento_id',
      as: 'pagamento'
    });
    
    PagamentoLog.belongsTo(models.Empresa, {
      foreignKey: 'empresa_id',
      as: 'empresa'
    });
  };

  // Métodos estáticos
  PagamentoLog.registrarEvento = async function(dados) {
    const {
      pagamento_id,
      empresa_id,
      tipo_evento,
      status_anterior,
      status_novo,
      dados_requisicao,
      dados_resposta,
      webhook_data,
      mensagem,
      erro_codigo,
      erro_mensagem,
      ip_origem,
      user_agent,
      gateway,
      duracao_ms
    } = dados;

    return await this.create({
      pagamento_id,
      empresa_id,
      tipo_evento,
      status_anterior,
      status_novo,
      dados_requisicao,
      dados_resposta,
      webhook_data,
      mensagem,
      erro_codigo,
      erro_mensagem,
      ip_origem,
      user_agent,
      gateway,
      duracao_ms
    });
  };

  PagamentoLog.buscarPorPagamento = async function(pagamentoId, limite = 50) {
    return await this.findAll({
      where: { pagamento_id },
      order: [['created_at', 'DESC']],
      limit: limite
    });
  };

  PagamentoLog.buscarPorEmpresa = async function(empresaId, filtros = {}) {
    const whereClause = { empresa_id };
    
    if (filtros.tipo_evento) {
      whereClause.tipo_evento = filtros.tipo_evento;
    }
    
    if (filtros.gateway) {
      whereClause.gateway = filtros.gateway;
    }
    
    if (filtros.data_inicio && filtros.data_fim) {
      whereClause.created_at = {
        [sequelize.Sequelize.Op.between]: [filtros.data_inicio, filtros.data_fim]
      };
    }

    return await this.findAll({
      where: whereClause,
      include: [
        {
          association: 'pagamento',
          include: ['venda']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: filtros.limite || 100
    });
  };

  return PagamentoLog;
};
