const { sequelize, ItemVenda, Venda, Estoque, Produto, Usuario, Empresa } = require('../models');

/**
 * Limpa o banco de dados respeitando foreign keys
 */
async function cleanDatabase() {
  // Deletar na ordem correta (do mais dependente para o menos)
  await ItemVenda.destroy({ where: {}, force: true });
  await Venda.destroy({ where: {}, force: true });
  await Estoque.destroy({ where: {}, force: true });
  await Produto.destroy({ where: {}, force: true });
  await Usuario.destroy({ where: {}, force: true });
  await Empresa.destroy({ where: {}, force: true });
}

module.exports = { cleanDatabase };
