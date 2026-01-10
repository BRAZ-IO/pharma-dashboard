const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pagamento = sequelize.define('Pagamento', {
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
    venda_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vendas',
        key: 'id'
      }
    },
    gateway: {
      type: DataTypes.ENUM('mercadoPago', 'stripe', 'pagseguro', 'pix', 'dinheiro', 'cartao_credito', 'cartao_debito', 'boleto'),
      allowNull: false
    },
    gateway_payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID do pagamento no gateway externo'
    },
    gateway_payment_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL para pagamento externo'
    },
    metodo_pagamento: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'pix', 'boleto', 'transferencia', 'dinheiro'),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pendente', 'processando', 'aprovado', 'rejeitado', 'cancelado', 'reembolsado', 'contestado'),
      defaultValue: 'pendente',
      allowNull: false
    },
    valor_original: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    valor_pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Valor realmente pago (pode incluir taxas)'
    },
    valor_taxa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Taxa do gateway'
    },
    valor_liquido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Valor líquido após taxas'
    },
    parcelas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    data_aprovacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_rejeicao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_reembolso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    codigo_transacao: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Código único da transação'
    },
    nsu: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'NSU da transação (cartão)'
    },
    autorizacao: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Código de autorização'
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'QR Code para PIX'
    },
    qr_code_base64: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'QR Code em base64'
    },
    boleto_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL do boleto'
    },
    boleto_barcode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Código de barras do boleto'
    },
    dados_cliente: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Dados do cliente no momento do pagamento'
    },
    dados_resposta: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Resposta completa do gateway'
    },
    webhook_data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Dados recebidos via webhook'
    },
    tentativas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Número de tentativas de pagamento'
    },
    erro_mensagem: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mensagem de erro em caso de falha'
    },
    estornado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    valor_estornado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    motivo_estorno: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pagamentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['empresa_id']
      },
      {
        fields: ['venda_id']
      },
      {
        fields: ['gateway']
      },
      {
        fields: ['status']
      },
      {
        fields: ['gateway_payment_id']
      },
      {
        fields: ['codigo_transacao']
      }
    ]
  });

  // Associações
  Pagamento.associate = (models) => {
    Pagamento.belongsTo(models.Venda, {
      foreignKey: 'venda_id',
      as: 'venda'
    });
    
    Pagamento.belongsTo(models.Empresa, {
      foreignKey: 'empresa_id',
      as: 'empresa'
    });

    Pagamento.hasMany(models.PagamentoLog, {
      foreignKey: 'pagamento_id',
      as: 'logs'
    });
  };

  // Métodos de instância
  Pagamento.prototype.aprovar = async function(dados = {}) {
    await this.update({
      status: 'aprovado',
      data_aprovacao: new Date(),
      valor_pago: dados.valor_pago || this.valor_original,
      dados_resposta: dados.resposta || this.dados_resposta
    });

    // Atualizar status da venda
    const Venda = sequelize.models.Venda;
    await Venda.update(
      { 
        status: 'finalizada',
        pago_em: new Date()
      },
      { where: { id: this.venda_id } }
    );
  };

  Pagamento.prototype.rejeitar = async function(motivo = '') {
    await this.update({
      status: 'rejeitado',
      data_rejeicao: new Date(),
      erro_mensagem: motivo
    });

    // Atualizar status da venda
    const Venda = sequelize.models.Venda;
    await Venda.update(
      { status: 'cancelada' },
      { where: { id: this.venda_id } }
    );
  };

  Pagamento.prototype.estornar = async function(valor = null, motivo = '') {
    const valorEstorno = valor || this.valor_pago;
    
    await this.update({
      estornado: true,
      valor_estornado: valorEstorno,
      motivo_estorno: motivo,
      data_reembolso: new Date()
    });

    // Atualizar status da venda
    const Venda = sequelize.models.Venda;
    await Venda.update(
      { status: 'estornada' },
      { where: { id: this.venda_id } }
    );
  };

  // Métodos estáticos
  Pagamento.buscarPorGatewayId = async function(gateway, gatewayId) {
    return await this.findOne({
      where: {
        gateway: gateway,
        gateway_payment_id: gatewayId
      },
      include: [
        {
          association: 'venda',
          include: ['itens', 'cliente']
        }
      ]
    });
  };

  Pagamento.buscarPendentes = async function(empresaId, gateway = null) {
    const whereClause = {
      empresa_id: empresaId,
      status: 'pendente'
    };

    if (gateway) {
      whereClause.gateway = gateway;
    }

    return await this.findAll({
      where: whereClause,
      include: ['venda'],
      order: [['data_criacao', 'ASC']]
    });
  };

  return Pagamento;
};
