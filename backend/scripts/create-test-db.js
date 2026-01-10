const { Client } = require('pg');

async function createTestDatabase() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || '5432',
    database: 'postgres' // Conectar ao banco default para criar o banco de teste
  });

  try {
    await client.connect();
    console.log('🔌 Conectado ao PostgreSQL');
    
    // Verificar se o banco de teste existe
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      ['pharma_dashboard_test']
    );
    
    if (result.rows.length === 0) {
      // Criar banco de teste
      await client.query('CREATE DATABASE pharma_dashboard_test');
      console.log('✅ Banco de teste pharma_dashboard_test criado com sucesso!');
    } else {
      console.log('✅ Banco de teste pharma_dashboard_test já existe');
    }
    
    await client.end();
    console.log('🔌 Desconectado do PostgreSQL');
  } catch (error) {
    console.error('❌ Erro ao criar banco de teste:', error.message);
    await client.end();
    process.exit(1);
  }
}

// Executar criação do banco de teste
createTestDatabase();
