const request = require('supertest');
const app = require('../app');
const { sequelize, Empresa, Usuario, Produto } = require('../models');
const { cleanDatabase } = require('./helpers');

describe('Testes de Isolamento Multi-Tenant', () => {
  let empresa1, empresa2;
  let tokenEmpresa1, tokenEmpresa2;
  let produto1, produto2, produto3, produto4;

  beforeAll(async () => {
    // Limpar banco de dados de teste
    await cleanDatabase();

    // Criar empresas
    empresa1 = await Empresa.create({
      razao_social: 'Farmácia Teste Ltda',
      nome_fantasia: 'Farmácia Teste',
      cnpj: '11.111.111/0001-11',
      email: 'farmacia@test.com',
      telefone: '(11) 1111-1111',
      endereco: { rua: 'Rua 1', numero: '100', cidade: 'SP', estado: 'SP', cep: '01000-000' },
      plano: 'basico',
      ativo: true
    });

    empresa2 = await Empresa.create({
      razao_social: 'Drogaria Popular Ltda',
      nome_fantasia: 'Drogaria Popular',
      cnpj: '22.222.222/0001-22',
      email: 'drogaria@test.com',
      telefone: '(22) 2222-2222',
      endereco: { rua: 'Rua 2', numero: '200', cidade: 'RJ', estado: 'RJ', cep: '20000-000' },
      plano: 'premium',
      ativo: true
    });

    // Criar usuários
    const user1 = await Usuario.create({
      empresa_id: empresa1.id,
      nome: 'Admin Farmácia',
      email: 'admin.farmacia@test.com',
      senha: '123456',
      cpf: '111.111.111-11',
      telefone: '(11) 91111-1111',
      cargo: 'Admin',
      role: 'admin'
    });

    const user2 = await Usuario.create({
      empresa_id: empresa2.id,
      nome: 'Admin Drogaria',
      email: 'admin.drogaria@test.com',
      senha: '123456',
      cpf: '222.222.222-22',
      telefone: '(22) 92222-2222',
      cargo: 'Admin',
      role: 'admin'
    });

    // Fazer login e obter tokens
    const login1 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin.farmacia@test.com', senha: '123456' });
    tokenEmpresa1 = login1.body.token;

    const login2 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin.drogaria@test.com', senha: '123456' });
    tokenEmpresa2 = login2.body.token;

    // Criar produtos para Empresa 1
    produto1 = await Produto.create({
      empresa_id: empresa1.id,
      codigo_barras: '1111111111111',
      nome: 'Dipirona 500mg',
      descricao: 'Analgésico',
      categoria: 'Medicamento',
      preco_custo: 5.00,
      preco_venda: 12.00,
      margem_lucro: 140
    });

    produto2 = await Produto.create({
      empresa_id: empresa1.id,
      codigo_barras: '1111111111112',
      nome: 'Paracetamol 750mg',
      descricao: 'Analgésico',
      categoria: 'Medicamento',
      preco_custo: 8.00,
      preco_venda: 18.00,
      margem_lucro: 125
    });

    // Criar produtos para Empresa 2
    produto3 = await Produto.create({
      empresa_id: empresa2.id,
      codigo_barras: '2222222222221',
      nome: 'Ibuprofeno 600mg',
      descricao: 'Anti-inflamatório',
      categoria: 'Medicamento',
      preco_custo: 12.00,
      preco_venda: 28.00,
      margem_lucro: 133
    });

    produto4 = await Produto.create({
      empresa_id: empresa2.id,
      codigo_barras: '2222222222222',
      nome: 'Omeprazol 20mg',
      descricao: 'Protetor gástrico',
      categoria: 'Medicamento',
      preco_custo: 10.00,
      preco_venda: 24.00,
      margem_lucro: 140
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Isolamento de Produtos', () => {
    test('Empresa 1 deve ver apenas seus 2 produtos', async () => {
      const response = await request(app)
        .get('/api/produtos')
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(response.status).toBe(200);
      expect(response.body.produtos).toHaveLength(2);
      expect(response.body.produtos[0].nome).toBe('Dipirona 500mg');
      expect(response.body.produtos[1].nome).toBe('Paracetamol 750mg');
    });

    test('Empresa 2 deve ver apenas seus 2 produtos', async () => {
      const response = await request(app)
        .get('/api/produtos')
        .set('Authorization', `Bearer ${tokenEmpresa2}`);

      expect(response.status).toBe(200);
      expect(response.body.produtos).toHaveLength(2);
      expect(response.body.produtos[0].nome).toBe('Ibuprofeno 600mg');
      expect(response.body.produtos[1].nome).toBe('Omeprazol 20mg');
    });

    test('Empresa 1 NÃO deve acessar produto da Empresa 2', async () => {
      const response = await request(app)
        .get(`/api/produtos/${produto3.id}`)
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Empresa 2 NÃO deve acessar produto da Empresa 1', async () => {
      const response = await request(app)
        .get(`/api/produtos/${produto1.id}`)
        .set('Authorization', `Bearer ${tokenEmpresa2}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Empresa 1 deve acessar seu próprio produto', async () => {
      const response = await request(app)
        .get(`/api/produtos/${produto1.id}`)
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(response.status).toBe(200);
      expect(response.body.produto.nome).toBe('Dipirona 500mg');
      expect(response.body.produto.empresa_id).toBe(empresa1.id);
    });
  });

  describe('Proteção contra Modificação Cruzada', () => {
    test('Empresa 1 NÃO deve atualizar produto da Empresa 2', async () => {
      const response = await request(app)
        .put(`/api/produtos/${produto3.id}`)
        .set('Authorization', `Bearer ${tokenEmpresa1}`)
        .send({
          preco_venda: 99.99
        });

      expect(response.status).toBe(404);
    });

    test('Empresa 2 NÃO deve deletar produto da Empresa 1', async () => {
      const response = await request(app)
        .delete(`/api/produtos/${produto1.id}`)
        .set('Authorization', `Bearer ${tokenEmpresa2}`);

      expect(response.status).toBe(404);
    });

    test('Empresa 1 deve atualizar seu próprio produto', async () => {
      const response = await request(app)
        .put(`/api/produtos/${produto1.id}`)
        .set('Authorization', `Bearer ${tokenEmpresa1}`)
        .send({
          preco_venda: 15.00
        });

      expect(response.status).toBe(200);
      expect(response.body.produto.preco_venda).toBe(15.00);
    });
  });

  describe('Criação de Dados Vinculados à Empresa Correta', () => {
    test('Produto criado deve ser vinculado à empresa do usuário logado', async () => {
      const response = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${tokenEmpresa1}`)
        .send({
          codigo_barras: '1111111111113',
          nome: 'Novo Produto Empresa 1',
          descricao: 'Teste',
          categoria: 'Medicamento',
          preco_custo: 10.00,
          preco_venda: 20.00,
          margem_lucro: 100
        });

      expect(response.status).toBe(201);
      expect(response.body.produto.empresa_id).toBe(empresa1.id);
      expect(response.body.produto.nome).toBe('Novo Produto Empresa 1');
    });

    test('Produto criado pela Empresa 2 NÃO deve ser visível para Empresa 1', async () => {
      // Criar produto na Empresa 2
      const createResponse = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${tokenEmpresa2}`)
        .send({
          codigo_barras: '2222222222223',
          nome: 'Novo Produto Empresa 2',
          descricao: 'Teste',
          categoria: 'Medicamento',
          preco_custo: 10.00,
          preco_venda: 20.00,
          margem_lucro: 100
        });

      const novoProdutoId = createResponse.body.produto.id;

      // Tentar acessar com Empresa 1
      const getResponse = await request(app)
        .get(`/api/produtos/${novoProdutoId}`)
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Isolamento de Usuários', () => {
    test('Empresa 1 deve ver apenas seus usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(response.status).toBe(200);
      expect(response.body.usuarios).toHaveLength(1);
      expect(response.body.usuarios[0].email).toBe('admin.farmacia@test.com');
    });

    test('Empresa 2 deve ver apenas seus usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${tokenEmpresa2}`);

      expect(response.status).toBe(200);
      expect(response.body.usuarios).toHaveLength(1);
      expect(response.body.usuarios[0].email).toBe('admin.drogaria@test.com');
    });
  });

  describe('Busca por Código de Barras', () => {
    test('Empresa 1 deve encontrar produto pelo código de barras', async () => {
      const response = await request(app)
        .get('/api/produtos/codigo-barras/1111111111111')
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(response.status).toBe(200);
      expect(response.body.produto.nome).toBe('Dipirona 500mg');
    });

    test('Empresa 1 NÃO deve encontrar produto da Empresa 2 pelo código', async () => {
      const response = await request(app)
        .get('/api/produtos/codigo-barras/2222222222221')
        .set('Authorization', `Bearer ${tokenEmpresa1}`);

      expect(response.status).toBe(404);
    });
  });
});
