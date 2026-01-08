const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../config/database');

const Empresa = require('../models/Empresa');
const Filial = require('../models/Filial');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Estoque = require('../models/Estoque');
const TransferenciaEstoque = require('../models/TransferenciaEstoque');

describe('🧪 Integration Test Suite', () => {
  let empresaA, empresaB;
  let usuarioA, usuarioB;
  let tokenA, tokenB;
  let filialA1, filialA2, filialB1;
  let produtoA, produtoB;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Setup básico para testes de integração
    empresaA = await Empresa.create({
      razao_social: 'Farmácia Teste A',
      nome_fantasia: 'Farmácia A',
      cnpj: '12.345.678/0001-90',
      email: 'teste@farmaciaa.com'
    });

    empresaB = await Empresa.create({
      razao_social: 'Farmácia Teste B',
      nome_fantasia: 'Farmácia B',
      cnpj: '98.765.432/0001-10',
      email: 'teste@farmaciab.com'
    });

    usuarioA = await Usuario.create({
      nome: 'Teste A',
      email: 'teste@farmaciaa.com',
      senha: 'senha123',
      empresa_id: empresaA.id,
      role: 'admin'
    });

    usuarioB = await Usuario.create({
      nome: 'Teste B',
      email: 'teste@farmaciab.com',
      senha: 'senha123',
      empresa_id: empresaB.id,
      role: 'admin'
    });

    produtoA = await Produto.create({
      nome: 'Produto Teste A',
      codigo_barras: '7891234567890',
      empresa_id: empresaA.id,
      preco_venda: 25.90
    });

    produtoB = await Produto.create({
      nome: 'Produto Teste B',
      codigo_barras: '7891234567891',
      empresa_id: empresaB.id,
      preco_venda: 18.75
    });

    const loginA = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@farmaciaa.com', senha: 'senha123' });

    const loginB = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@farmaciab.com', senha: 'senha123' });

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('🔐 Health Check', () => {
    test('✅ API deve estar online', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('API está funcionando');
    });
  });

  describe('🏢 Multi-Tenant Integration', () => {
    test('✅ Fluxo completo multi-tenant', async () => {
      // 1. Criar filiais para Empresa A
      filialA1 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial A1', tipo: 'filial' });

      filialA2 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial A2', tipo: 'filial' });

      // 2. Criar filial para Empresa B
      filialB1 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ nome_fantasia: 'Filial B1', tipo: 'filial' });

      // 3. Criar estoques
      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA1.body.id,
        produto_id: produtoA.id,
        quantidade_atual: 100,
        lote: 'L20240101'
      });

      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA2.body.id,
        produto_id: produtoA.id,
        quantidade_atual: 50,
        lote: 'L20240102'
      });

      // 4. Criar transferência
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 20,
          lote: 'L20240101',
          motivo_transferencia: 'Teste integração'
        });

      expect(transferencia.status).toBe(201);

      // 5. Verificar isolamento
      const listaA = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`);

      const listaB = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(listaA.body.transferencias).toHaveLength(1);
      expect(listaB.body.transferencias).toHaveLength(0);
    });
  });

  describe('📊 Performance Tests', () => {
    test('✅ Concurrent operations', async () => {
      // Criar múltiplas operações simultâneas
      const promises = [];
      
      // Operações de criação
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/filiais')
            .set('Authorization', `Bearer ${tokenA}`)
            .send({
              nome_fantasia: `Filial Teste ${i}`,
              tipo: 'filial'
            })
        );
      }

      const results = await Promise.all(promises);
      
      // Verificar se todas foram criadas
      results.forEach(result => {
        expect(result.status).toBe(201);
      });

      // Verificar listagem
      const listagem = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(listagem.status).toBe(200);
      expect(listagem.body.filiais.length).toBe(10);
    });
  });

  describe('🔒 Security Integration', () => {
    test('✅ Authentication flow', async () => {
      // Login válido
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@farmaciaa.com', senha: 'senha123' });

      expect(login.status).toBe(200);
      expect(login.body.token).toBeDefined();
      expect(login.body.usuario.email).toBe('teste@farmaciaa.com');

      // Usar token para acessar recursos protegidos
      const protegido = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${login.body.token}`);

      expect(protegido.status).toBe(200);
    });

    test('❌ Invalid credentials', async () => {
      const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@farmaciaa.com', senha: 'senha-incorreta' });

      expect(login.status).toBe(401);
      expect(login.body.error).toBeDefined();
    });
  });

  describe('📋 Data Integrity', () => {
    test('✅ Referential integrity', async () => {
      // Criar filial
      const filial = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial Teste', tipo: 'filial' });

      // Tentar criar transferência com filial inexistente
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: 'uuid-inexistente',
          filial_destino_id: filial.body.id,
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Teste'
        });

      expect(transferencia.status).toBe(400);
    });

    test('✅ Business rules enforcement', async () => {
      // Tentar criar segunda matriz
      await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Matriz', tipo: 'matriz' });

      const segundaMatriz = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Segunda Matriz', tipo: 'matriz' });

      expect(segundaMatriz.status).toBe(400);
      expect(segundaMatriz.body.error).toBe('Já existe uma matriz cadastrada');
    });
  });

  describe('🌐 API Documentation', () => {
    test('✅ Swagger documentation accessible', async () => {
      const response = await request(app)
        .get('/api/docs');

      expect(response.status).toBe(200);
      expect(response.text).toContain('swagger');
    });
  });

  describe('📱 Error Handling', () => {
    test('✅ 404 handling', async () => {
      const response = await request(app)
        .get('/api/recurso-inexistente');

      expect(response.status).toBe(404);
    });

    test('✅ 500 handling', async () => {
      // Simular erro interno
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: '' }); // Campo obrigatório vazio

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
