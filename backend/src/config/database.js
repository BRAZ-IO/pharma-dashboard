const { Sequelize } = require('sequelize');
require('dotenv').config();

// Garantir que as credenciais sejam strings
const dbConfig = {
  database: process.env.DB_NAME || 'pharma_dashboard',
  username: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

const sequelize = new Sequelize(dbConfig);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
    return false;
  }
};

module.exports = { sequelize, testConnection };
