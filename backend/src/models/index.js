const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Estoque = require('./Estoque');
const Venda = require('./Venda');
const ItemVenda = require('./ItemVenda');

// Relacionamentos

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
  Usuario,
  Produto,
  Estoque,
  Venda,
  ItemVenda
};
