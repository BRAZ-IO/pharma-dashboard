const swaggerJsdoc = require('swagger-jsdoc');
const { PORT } = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pharma Dashboard API',
      version: '1.0.0',
      description: 'API completa para gestão de farmácias - Sistema Pharma Dashboard',
      contact: {
        name: 'Pharma Dashboard',
        email: 'contato@pharmadashboard.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.pharmadashboard.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@pharma.com' },
            cpf: { type: 'string', example: '123.456.789-00' },
            telefone: { type: 'string', example: '(11) 98765-4321' },
            cargo: { type: 'string', example: 'Gerente' },
            role: { type: 'string', enum: ['admin', 'gerente', 'funcionario'] },
            ativo: { type: 'boolean' },
            avatar_url: { type: 'string' },
            ultimo_login: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Produto: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            codigo_barras: { type: 'string', example: '7891234567890' },
            nome: { type: 'string', example: 'Dipirona 500mg' },
            descricao: { type: 'string' },
            categoria: { type: 'string', example: 'Medicamento' },
            subcategoria: { type: 'string', example: 'Analgésico' },
            fabricante: { type: 'string', example: 'EMS' },
            principio_ativo: { type: 'string', example: 'Dipirona Sódica' },
            apresentacao: { type: 'string', example: 'Comprimido' },
            dosagem: { type: 'string', example: '500mg' },
            preco_custo: { type: 'number', format: 'decimal', example: 5.50 },
            preco_venda: { type: 'number', format: 'decimal', example: 12.90 },
            margem_lucro: { type: 'number', format: 'decimal', example: 134.55 },
            requer_receita: { type: 'boolean' },
            controlado: { type: 'boolean' },
            generico: { type: 'boolean' },
            ativo: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
