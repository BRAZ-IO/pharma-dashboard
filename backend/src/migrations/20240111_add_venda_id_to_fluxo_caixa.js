'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Adicionar coluna venda_id na tabela FluxoCaixa
      await queryInterface.addColumn('FluxoCaixa', 'venda_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'vendas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });

      // Adicionar índice para performance
      await queryInterface.addIndex('FluxoCaixa', ['venda_id']);

      console.log('✅ Migração de integração Venda-FluxoCaixa aplicada com sucesso');
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remover índice
      await queryInterface.removeIndex('FluxoCaixa', ['venda_id']);

      // Remover coluna venda_id
      await queryInterface.removeColumn('FluxoCaixa', 'venda_id');

      console.log('✅ Rollback da migração de integração Venda-FluxoCaixa aplicado com sucesso');
    } catch (error) {
      console.error('❌ Erro no rollback:', error);
      throw error;
    }
  }
};
