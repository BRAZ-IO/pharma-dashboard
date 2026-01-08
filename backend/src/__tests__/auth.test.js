const request = require('supertest');
const app = require('../app');
const { sequelize, Empresa, Usuario } = require('../models');
const { cleanDatabase } = require('./helpers');

describe('Testes de Autenticação', () => {
  let empresa1, empresa2;
  let userEmpresa1, userEmpresa2;

  beforeAll(async () => {
    // Limpar banco de dados de teste
    await cleanDatabase();

    // Criar empresas de teste
    empresa1 = await Empresa.create({
      razao_social: 'Empresa Teste 1 Ltda',
      nome_fantasia: 'Empresa 1',
      cnpj: '11.111.111/0001-11',
      email: 'empresa1@test.com',
      telefone: '(11) 1111-1111',
      endereco: { rua: 'Rua 1', numero: '100', cidade: 'SP', estado: 'SP', cep: '01000-000' },
      plano: 'basico',
      ativo: true
    });

    empresa2 = await Empresa.create({
      razao_social: 'Empresa Teste 2 Ltda',
      nome_fantasia: 'Empresa 2',
      cnpj: '22.222.222/0001-22',
      email: 'empresa2@test.com',
      telefone: '(22) 2222-2222',
      endereco: { rua: 'Rua 2', numero: '200', cidade: 'RJ', estado: 'RJ', cep: '20000-000' },
      plano: 'premium',
      ativo: true
    });

    // Criar usuários de teste
    userEmpresa1 = await Usuario.create({
      empresa_id: empresa1.id,
      nome: 'Admin Empresa 1',
      email: 'admin1@test.com',
      senha: '123456',
      cpf: '111.111.111-11',
      telefone: '(11) 91111-1111',
      cargo: 'Admin',
      role: 'admin'
    });

    userEmpresa2 = await Usuario.create({
      empresa_id: empresa2.id,
      nome: 'Admin Empresa 2',
      email: 'admin2@test.com',
      senha: '123456',
      cpf: '222.222.222-22',
      telefone: '(22) 92222-2222',
      cargo: 'Admin',
      role: 'admin'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/login', () => {
    test('Deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin1@test.com',
          senha: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario.email).toBe('admin1@test.com');
      expect(response.body.usuario.nome).toBe('Admin Empresa 1');
    });

    test('Deve retornar erro com senha incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin1@test.com',
          senha: 'senha_errada'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve retornar erro com email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@test.com',
          senha: '123456'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve retornar erro sem email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          senha: '123456'
        });

      expect(response.status).toBe(400);
    });

    test('Deve retornar erro sem senha', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin1@test.com'
        });

      expect(response.status).toBe(400);
    });

    test('Deve incluir dados da empresa no login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin1@test.com',
          senha: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.usuario).toHaveProperty('empresa');
      expect(response.body.usuario.empresa.nome_fantasia).toBe('Empresa 1');
    });
  });

  describe('POST /api/auth/register', () => {
    test('Deve registrar novo usuário', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          empresa_id: empresa1.id,
          nome: 'Novo Usuario',
          email: 'novo@test.com',
          senha: '123456',
          cpf: '333.333.333-33',
          telefone: '(11) 93333-3333',
          cargo: 'Gerente',
          role: 'gerente'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.usuario.email).toBe('novo@test.com');
    });

    test('Deve retornar erro ao registrar email duplicado', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          empresa_id: empresa1.id,
          nome: 'Duplicado',
          email: 'admin1@test.com', // Email já existe
          senha: '123456',
          cpf: '444.444.444-44',
          telefone: '(11) 94444-4444',
          cargo: 'Funcionario',
          role: 'funcionario'
        });

      expect(response.status).toBe(409); // Conflict - email já existe
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Proteção de Rotas Autenticadas', () => {
    test('Deve bloquear acesso sem token', async () => {
      const response = await request(app)
        .get('/api/usuarios');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Deve bloquear acesso com token inválido', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', 'Bearer token_invalido');

      expect(response.status).toBe(401);
    });

    test('Deve permitir acesso com token válido', async () => {
      // Fazer login primeiro
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin1@test.com',
          senha: '123456'
        });

      const token = loginResponse.body.token;

      // Acessar rota protegida
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
