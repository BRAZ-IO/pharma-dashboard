const request = require('supertest');
const app = require('../app');
const { sequelize, Empresa, Usuario } = require('../models');
const { cleanDatabase } = require('./helpers');

describe('Testes de Segurança', () => {
  let empresa, user, token;

  beforeAll(async () => {
    await cleanDatabase();

    empresa = await Empresa.create({
      razao_social: 'Empresa Segurança Ltda',
      nome_fantasia: 'Empresa Segurança',
      cnpj: '33.333.333/0001-33',
      email: 'seguranca@test.com',
      telefone: '(33) 3333-3333',
      endereco: { rua: 'Rua 3', numero: '300', cidade: 'SP', estado: 'SP', cep: '03000-000' },
      plano: 'basico',
      ativo: true
    });

    user = await Usuario.create({
      empresa_id: empresa.id,
      nome: 'User Segurança',
      email: 'user@test.com',
      senha: '123456',
      cpf: '333.333.333-33',
      telefone: '(33) 93333-3333',
      cargo: 'Admin',
      role: 'admin'
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', senha: '123456' });
    token = login.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // Rate limiting está desabilitado em testes para não interferir

  describe('Proteção XSS', () => {
    test('Deve sanitizar input com script malicioso', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          codigo_barras: '3333333333333',
          nome: '<script>alert("XSS")</script>Produto',
          descricao: 'Teste XSS',
          categoria: 'Medicamento',
          preco_custo: 10.00,
          preco_venda: 20.00,
          margem_lucro: 100
        });

      expect(response.status).toBe(201);
      // O script deve ser removido/escapado
      expect(response.body.produto.nome).not.toContain('<script>');
    });
  });

  describe('Headers de Segurança', () => {
    test('Deve incluir headers de segurança (Helmet)', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    test('Deve ter Content-Security-Policy configurado', async () => {
      const response = await request(app).get('/api/health');

      expect(response.headers).toHaveProperty('content-security-policy');
    });
  });

  describe('Validação de Inputs', () => {
    test('Deve rejeitar email inválido no registro', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          empresa_id: empresa.id,
          nome: 'Teste',
          email: 'email_invalido', // Email sem @
          senha: '123456',
          cpf: '444.444.444-44',
          telefone: '(44) 94444-4444',
          cargo: 'Teste',
          role: 'funcionario'
        });

      expect(response.status).toBe(400);
    });

    test('Deve rejeitar senha muito curta', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          empresa_id: empresa.id,
          nome: 'Teste',
          email: 'teste@test.com',
          senha: '123', // Senha muito curta
          cpf: '555.555.555-55',
          telefone: '(55) 95555-5555',
          cargo: 'Teste',
          role: 'funcionario'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Proteção de Dados Sensíveis', () => {
    test('Senha NÃO deve ser retornada na resposta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com', senha: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.usuario).not.toHaveProperty('senha');
    });

    test('Lista de usuários NÃO deve incluir senhas', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      response.body.usuarios.forEach(usuario => {
        expect(usuario).not.toHaveProperty('senha');
      });
    });
  });

  describe('CORS', () => {
    test('Deve incluir headers CORS', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
