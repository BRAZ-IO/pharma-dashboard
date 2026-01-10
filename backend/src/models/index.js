const { sequelize } = require('../config/database');
const Empresa = require('./Empresa');
const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Estoque = require('./Estoque');
const Venda = require('./Venda');
const ItemVenda = require('./ItemVenda');

// Importar novos models
const Fornecedor = require('./Fornecedor');
const Cliente = require('./Cliente');
const FluxoCaixa = require('./FluxoCaixa');
const Filial = require('./Filial');
const TransferenciaEstoque = require('./TransferenciaEstoque');

// Importar models de pagamento apenas se não estiver em ambiente de teste
let Pagamento, PagamentoLog;
if (process.env.NODE_ENV !== 'test') {
  try {
    Pagamento = require('./Pagamento');
    PagamentoLog = require('./PagamentoLog');
  } catch (error) {
    console.log('Models de pagamento não carregados (ambiente de teste)');
  }
} else {
  // Em ambiente de teste, não carregar os models de pagamento
  console.log('Ambiente de teste detectado - pulando models de pagamento');
}

// Relacionamentos Multi-Tenant

// Empresa - Usuario (1:N)
Empresa.hasMany(Usuario, { foreignKey: 'empresa_id', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Empresa - Produto (1:N)
Empresa.hasMany(Produto, { foreignKey: 'empresa_id', as: 'produtos' });
Produto.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Empresa - Estoque (1:N)
Empresa.hasMany(Estoque, { foreignKey: 'empresa_id', as: 'estoques' });
Estoque.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Empresa - Venda (1:N)
Empresa.hasMany(Venda, { foreignKey: 'empresa_id', as: 'vendas' });
Venda.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Produto - Estoque (1:N)
Produto.hasMany(Estoque, { foreignKey: 'produto_id', as: 'estoques' });
Estoque.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });

// Usuario - Venda (1:N)
Usuario.hasMany(Venda, { foreignKey: 'usuario_id', as: 'vendas' });
Venda.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'vendedor' });

// Venda - ItemVenda (1:N)
Venda.hasMany(ItemVenda, { foreignKey: 'venda_id', as: 'itens' });
ItemVenda.belongsTo(Venda, { foreignKey: 'venda_id', as: 'venda' });

// Produto - ItemVenda (1:N)
Produto.hasMany(ItemVenda, { foreignKey: 'produto_id', as: 'itens_venda' });
ItemVenda.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });

// Empresa - Fornecedor (1:N)
Empresa.hasMany(Fornecedor, { foreignKey: 'empresa_id', as: 'fornecedores' });
Fornecedor.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Empresa - Cliente (1:N)
Empresa.hasMany(Cliente, { foreignKey: 'empresa_id', as: 'clientes' });
Cliente.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Empresa - FluxoCaixa (1:N)
Empresa.hasMany(FluxoCaixa, { foreignKey: 'empresa_id', as: 'fluxo_caixa' });
FluxoCaixa.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

// Relacionamentos de Filiais
Empresa.hasMany(Filial, { foreignKey: 'empresa_id', as: 'filiais' });
Filial.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

Filial.hasMany(Estoque, { foreignKey: 'filial_id', as: 'estoques' });
Estoque.belongsTo(Filial, { foreignKey: 'filial_id', as: 'filial' });

// Relacionamentos de Transferências
Empresa.hasMany(TransferenciaEstoque, { foreignKey: 'empresa_id', as: 'transferencias' });
TransferenciaEstoque.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

TransferenciaEstoque.belongsTo(Filial, { foreignKey: 'filial_origem_id', as: 'filialOrigem' });
TransferenciaEstoque.belongsTo(Filial, { foreignKey: 'filial_destino_id', as: 'filialDestino' });

TransferenciaEstoque.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });
TransferenciaEstoque.belongsTo(Usuario, { foreignKey: 'usuario_solicitante_id', as: 'usuarioSolicitante' });
TransferenciaEstoque.belongsTo(Usuario, { foreignKey: 'usuario_aprovador_id', as: 'usuarioAprovador' });

// Associações inversas
Filial.hasMany(TransferenciaEstoque, { foreignKey: 'filial_origem_id', as: 'transferenciasOrigem' });
Filial.hasMany(TransferenciaEstoque, { foreignKey: 'filial_destino_id', as: 'transferenciasDestino' });

Produto.hasMany(TransferenciaEstoque, { foreignKey: 'produto_id', as: 'transferencias' });
Usuario.hasMany(TransferenciaEstoque, { foreignKey: 'usuario_solicitante_id', as: 'transferenciasSolicitadas' });
Usuario.hasMany(TransferenciaEstoque, { foreignKey: 'usuario_aprovador_id', as: 'transferenciasAprovadas' });

// Relacionamentos de Pagamentos (apenas se não estiver em teste e os models existirem)
if (Pagamento && PagamentoLog && typeof Pagamento === 'function' && typeof PagamentoLog === 'function') {
  try {
    Empresa.hasMany(Pagamento, { foreignKey: 'empresa_id', as: 'pagamentos' });
    Pagamento.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

    Venda.hasMany(Pagamento, { foreignKey: 'venda_id', as: 'pagamentos' });
    Pagamento.belongsTo(Venda, { foreignKey: 'venda_id', as: 'venda' });

    Empresa.hasMany(PagamentoLog, { foreignKey: 'empresa_id', as: 'pagamentos_logs' });
    PagamentoLog.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

    Pagamento.hasMany(PagamentoLog, { foreignKey: 'pagamento_id', as: 'logs' });
    PagamentoLog.belongsTo(Pagamento, { foreignKey: 'pagamento_id', as: 'pagamento' });
  } catch (error) {
    console.log('Erro ao configurar relacionamentos de pagamento:', error.message);
  }
} else {
  console.log('Models de pagamento não disponíveis - pulando relacionamentos');
}

module.exports = {
  sequelize,
  Empresa,
  Usuario,
  Produto,
  Estoque,
  Venda,
  ItemVenda,
  Fornecedor,
  Cliente,
  FluxoCaixa,
  Filial,
  TransferenciaEstoque,
  ...(Pagamento && { Pagamento }),
  ...(PagamentoLog && { PagamentoLog })
};
