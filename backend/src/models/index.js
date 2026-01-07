const Empresa = require('./Empresa');
const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Estoque = require('./Estoque');
const Venda = require('./Venda');
const ItemVenda = require('./ItemVenda');

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

module.exports = {
  Empresa,
  Usuario,
  Produto,
  Estoque,
  Venda,
  ItemVenda
};
