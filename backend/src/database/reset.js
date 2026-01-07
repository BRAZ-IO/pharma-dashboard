require('dotenv').config();
const { Client } = require('pg');

const resetDatabase = async () => {
  // Conectar ao banco postgres (não ao pharma_dashboard)
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres' // Conecta ao postgres, não ao pharma_dashboard
  });

  try {
    await client.connect();
    console.log('🔄 Conectado ao PostgreSQL...');

    // Desconectar todos os usuários do banco pharma_dashboard
    console.log('🔄 Desconectando usuários...');
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'pharma_dashboard'
        AND pid <> pg_backend_pid();
    `);
    console.log('✅ Usuários desconectados');

    // Deletar banco
    console.log('🔄 Deletando banco pharma_dashboard...');
    await client.query('DROP DATABASE IF EXISTS pharma_dashboard;');
    console.log('✅ Banco deletado');

    // Recriar banco
    console.log('🔄 Recriando banco pharma_dashboard...');
    await client.query('CREATE DATABASE pharma_dashboard;');
    console.log('✅ Banco recriado');

    await client.end();

    console.log('');
    console.log('🎉 Banco resetado com sucesso!');
    console.log('');
    console.log('📝 Próximos passos:');
    console.log('  1. Execute: npm run seed');
    console.log('  2. Execute: npm run dev');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error.message);
    await client.end();
    process.exit(1);
  }
};

resetDatabase();
