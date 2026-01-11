// Associações entre modelos
const Empresa = require('./Empresa');
const Filial = require('./Filial');
const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Estoque = require('./Estoque');
const TransferenciaEstoque = require('./TransferenciaEstoque');
const Venda = require('./Venda');
const ItemVenda = require('./ItemVenda');
const Cliente = require('./Cliente');
const FluxoCaixa = require('./FluxoCaixa');

// Associações da Empresa
Empresa.hasMany(Filial, {
  foreignKey: 'empresa_id',
  as: 'filiais'
});

// Associações da Filial
Filial.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  as: 'empresa'
});

Filial.hasMany(Estoque, {
  foreignKey: 'filial_id',
  as: 'estoques'
});

// Associações do Usuário
Usuario.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  as: 'empresa'
});

// Associações do Produto
Produto.hasMany(Estoque, {
  foreignKey: 'produto_id',
  as: 'estoques'
});

// Associações do Estoque
Estoque.belongsTo(Filial, {
  foreignKey: 'filial_id',
  as: 'filial'
});

Estoque.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

Estoque.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  as: 'empresa'
});

// Associações da TransferenciaEstoque
TransferenciaEstoque.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  as: 'empresa'
});

TransferenciaEstoque.belongsTo(Filial, {
  foreignKey: 'filial_origem_id',
  as: 'filialOrigem'
});

TransferenciaEstoque.belongsTo(Filial, {
  foreignKey: 'filial_destino_id',
  as: 'filialDestino'
});

TransferenciaEstoque.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

TransferenciaEstoque.belongsTo(Usuario, {
  foreignKey: 'usuario_solicitante_id',
  as: 'usuarioSolicitante'
});

TransferenciaEstoque.belongsTo(Usuario, {
  foreignKey: 'usuario_aprovador_id',
  as: 'usuarioAprovador'
});

// Associações inversas para TransferenciaEstoque
Filial.hasMany(TransferenciaEstoque, {
  foreignKey: 'filial_origem_id',
  as: 'transferenciasOrigem'
});

Filial.hasMany(TransferenciaEstoque, {
  foreignKey: 'filial_destino_id',
  as: 'transferenciasDestino'
});

Produto.hasMany(TransferenciaEstoque, {
  foreignKey: 'produto_id',
  as: 'transferencias'
});

Usuario.hasMany(TransferenciaEstoque, {
  foreignKey: 'usuario_solicitante_id',
  as: 'transferenciasSolicitadas'
});

Usuario.hasMany(TransferenciaEstoque, {
  foreignKey: 'usuario_aprovador_id',
  as: 'transferenciasAprovadas'
});

// Associações de Vendas
Venda.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  as: 'empresa'
});

Venda.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'vendedor'
});

Venda.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

Venda.hasMany(ItemVenda, {
  foreignKey: 'venda_id',
  as: 'itens'
});

// Associações de ItemVenda
ItemVenda.belongsTo(Venda, {
  foreignKey: 'venda_id',
  as: 'venda'
});

ItemVenda.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

// Associações inversas
Empresa.hasMany(Venda, {
  foreignKey: 'empresa_id',
  as: 'vendas'
});

Usuario.hasMany(Venda, {
  foreignKey: 'usuario_id',
  as: 'vendas'
});

Cliente.hasMany(Venda, {
  foreignKey: 'cliente_id',
  as: 'vendas'
});

Produto.hasMany(ItemVenda, {
  foreignKey: 'produto_id',
  as: 'itensVenda'
});

// Associações do FluxoCaixa
FluxoCaixa.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  as: 'empresa'
});

FluxoCaixa.belongsTo(Venda, {
  foreignKey: 'venda_id',
  as: 'venda'
});

// Associações inversas
Empresa.hasMany(FluxoCaixa, {
  foreignKey: 'empresa_id',
  as: 'fluxoCaixa'
});

Venda.hasOne(FluxoCaixa, {
  foreignKey: 'venda_id',
  as: 'fluxoCaixa'
});

module.exports = {
  Empresa,
  Filial,
  Usuario,
  Produto,
  Estoque,
  TransferenciaEstoque,
  Venda,
  ItemVenda,
  Cliente,
  FluxoCaixa
};
