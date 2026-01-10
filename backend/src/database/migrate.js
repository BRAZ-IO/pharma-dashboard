const { sequelize } = require('../config/database');

async function migrate() {
  try {
    console.log('🔄 Executando migrações...');
    
    // Adicionar campos de cliente à tabela vendas (sem foreign key por enquanto)
    await sequelize.query(`
      ALTER TABLE vendas 
      ADD COLUMN IF NOT EXISTS cliente_id UUID,
      ADD COLUMN IF NOT EXISTS cliente_nome VARCHAR(255),
      ADD COLUMN IF NOT EXISTS cliente_cpf VARCHAR(20);
    `);

    console.log('✅ Migrações executadas com sucesso!');
    console.log('📋 Campos adicionados: cliente_id, cliente_nome, cliente_cpf');
    console.log('📝 Nota: Foreign key será adicionada depois que a tabela clientes existir');
    
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      console.log('🎉 Migração concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na migração:', error);
      process.exit(1);
    });
}

module.exports = { migrate };
