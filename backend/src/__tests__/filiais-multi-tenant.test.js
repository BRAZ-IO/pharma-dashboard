const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../config/database');

const Empresa = require('../models/Empresa');
const Filial = require('../models/Filial');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Estoque = require('../models/Estoque');
const TransferenciaEstoque = require('../models/TransferenciaEstoque');

describe(' Multi-Tenant Isolation Integration Tests', () => {
  let empresaA, empresaB, empresaC;
  let usuarioA, usuarioB, usuarioC;
  let tokenA, tokenB, tokenC;
  let filialA1, filialB1, filialC1;
  let produtoA, produtoB, produtoC;

  beforeAll(async () => {
    // Limpar banco de dados
    await sequelize.sync({ force: true });

    // Criar 3 empresas completamente isoladas
    empresaA = await Empresa.create({
      razao_social: 'Farmácia Central A',
      nome_fantasia: 'Farmácia A',
      cnpj: '12.345.678/0001-90',
      email: 'contato@farmaciaa.com'
    });

    empresaB = await Empresa.create({
      razao_social: 'Farmácia Central B',
      nome_fantasia: 'Farmácia B',
      cnpj: '98.765.432/0001-10',
      email: 'contato@farmaciab.com'
    });

    empresaC = await Empresa.create({
      razao_social: 'Farmácia Central C',
      nome_fantasia: 'Farmácia C',
      cnpj: '55.666.777/0001-33',
      email: 'contato@farmaciac.com'
    });

    // Criar usuários para cada empresa
    usuarioA = await Usuario.create({
      nome: 'João A',
      email: 'joao@farmaciaa.com',
      senha: 'senha123',
      empresa_id: empresaA.id,
      role: 'admin'
    });

    usuarioB = await Usuario.create({
      nome: 'Maria B',
      email: 'maria@farmaciab.com',
      senha: 'senha123',
      empresa_id: empresaB.id,
      role: 'admin'
    });

    usuarioC = await Usuario.create({
      nome: 'Pedro C',
      email: 'pedro@farmaciac.com',
      senha: 'senha123',
      empresa_id: empresaC.id,
      role: 'admin'
    });

    // Criar produtos para cada empresa
    produtoA = await Produto.create({
      nome: 'Medicamento A',
      codigo_barras: '7891234567890',
      empresa_id: empresaA.id,
      preco_venda: 25.90
    });

    produtoB = await Produto.create({
      nome: 'Medicamento B',
      codigo_barras: '7891234567891',
      empresa_id: empresaB.id,
      preco_venda: 18.75
    });

    produtoC = await Produto.create({
      nome: 'Medicamento C',
      codigo_barras: '7891234567892',
      empresa_id: empresaC.id,
      preco_venda: 32.50
    });

    // Obter tokens
    const loginA = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@farmaciaa.com', senha: 'senha123' });

    const loginB = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@farmaciab.com', senha: 'senha123' });

    const loginC = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pedro@farmaciac.com', senha: 'senha123' });

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
    tokenC = loginC.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('🏢 Complete Isolation Tests', () => {
    test('✅ Cada empresa deve ter seu próprio universo de dados', async () => {
      // Empresa A cria suas filiais
      const filialA = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial A1', tipo: 'filial' });

      // Empresa B cria suas filiais
      const filialB = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ nome_fantasia: 'Filial B1', tipo: 'filial' });

      // Empresa C cria suas filiais
      const filialC = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenC}`)
        .send({ nome_fantasia: 'Filial C1', tipo: 'filial' });

      expect(filialA.status).toBe(201);
      expect(filialB.status).toBe(201);
      expect(filialC.status).toBe(201);

      // Salvar IDs para testes posteriores
      filialA1 = filialA.body;
      filialB1 = filialB.body;
      filialC1 = filialC.body;

      // Cada empresa só vê suas filiais
      const filiaisA = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`);

      const filiaisB = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`);

      const filiaisC = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenC}`);

      expect(filiaisA.body.filiais).toHaveLength(1);
      expect(filiaisB.body.filiais).toHaveLength(1);
      expect(filiaisC.body.filiais).toHaveLength(1);

      // Verificar isolamento
      expect(filiaisA.body.filiais[0].empresa_id).toBe(empresaA.id);
      expect(filiaisB.body.filiais[0].empresa_id).toBe(empresaB.id);
      expect(filiaisC.body.filiais[0].empresa_id).toBe(empresaC.id);
    });

    test('✅ Transferências devem funcionar apenas dentro da mesma empresa', async () => {
      // Criar estoques para Empresa A
      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA1.id,
        produto_id: produtoA.id,
        quantidade_atual: 100,
        lote: 'L20240101'
      });

      // Criar segunda filial para Empresa A
      const filialA2 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial A2', tipo: 'filial' });

      // Transferência dentro da Empresa A (deve funcionar)
      const transferenciaA = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 20,
          motivo_transferencia: 'Transferência interna A'
        });

      expect(transferenciaA.status).toBe(201);

      // Tentativa de transferência cruzada (deve falhar)
      const transferenciaCruzada = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialB1.id, // Filial de outra empresa
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Transferência cruzada'
        });

      expect(transferenciaCruzada.status).toBe(404);
    });

    test('❌ Nenhuma empresa deve ver dados das outras', async () => {
      // Empresa A tenta acessar filial da Empresa B
      const acessoB = await request(app)
        .get(`/api/filiais/${filialB1.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(acessoB.status).toBe(404);

      // Empresa B tenta acessar filial da Empresa C
      const acessoC = await request(app)
        .get(`/api/filiais/${filialC1.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(acessoC.status).toBe(404);

      // Empresa C tenta acessar filial da Empresa A
      const acessoA = await request(app)
        .get(`/api/filiais/${filialA1.id}`)
        .set('Authorization', `Bearer ${tokenC}`);

      expect(acessoA.status).toBe(404);
    });

    test('✅ Tokens devem ser válidos apenas para sua empresa', async () => {
      // Tentar usar token da Empresa A para acessar dados da Empresa B
      const listaB = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(listaB.body.filiais).toHaveLength(1);
      expect(listaB.body.filiais[0].empresa_id).toBe(empresaA.id);
      // Não deve retornar dados da Empresa B
    });
  });

  describe('🔐 Security Boundary Tests', () => {
    test('❌ SQL Injection attempts devem ser bloqueadas', async () => {
      const maliciousQuery = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .query({ empresa_id: "1' OR 1=1 --" });

      expect(maliciousQuery.status).toBe(200);
      expect(maliciousQuery.body.filiais).toHaveLength(1);
      // Não deve retornar todas as empresas
    });

    test('❌ Token manipulation deve ser bloqueada', async () => {
      // Tentar modificar token para acessar outra empresa
      const fakeToken = tokenA.replace(empresaA.id, empresaB.id);
      
      const response = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${fakeToken}`);

      // Deve falhar na validação do token
      expect(response.status).toBe(401);
    });

    test('❌ ID spoofing deve ser bloqueado', async () => {
      // Tentar acessar filial com ID de outra empresa usando token válido
      const response = await request(app)
        .put(`/api/filiais/${filialB1.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Tentativa de ataque' });

      expect(response.status).toBe(404);
    });
  });

  describe('📊 Performance & Scalability Tests', () => {
    test('✅ Large dataset handling', async () => {
      // Criar muitas filiais para testar performance
      const promises = [];
      for (let i = 0; i < 50; i++) {
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
      
      // Todas devem ser criadas com sucesso
      results.forEach(result => {
        expect(result.status).toBe(201);
      });

      // Testar listagem com paginação
      const listagem = await request(app)
        .get('/api/filiais?limit=10&page=1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(listagem.status).toBe(200);
      expect(listagem.body.filiais).toHaveLength(10);
      expect(listagem.body.total).toBe(51); // 50 criadas + 1 original
    });

    test('✅ Concurrent access simulation', async () => {
      // Simular múltiplos usuários da mesma empresa acessando simultaneamente
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .get('/api/filiais')
            .set('Authorization', `Bearer ${tokenA}`)
        );
      }

      const results = await Promise.all(promises);
      
      // Todas as requisições devem ser bem-sucedidas
      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.body.filiais.length).toBeGreaterThan(0);
      });
    });
  });

  describe('🔍 Data Integrity Tests', () => {
    test('✅ Foreign key constraints', async () => {
      // Tentar criar transferência com filial inexistente
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: 'uuid-inexistente',
          filial_destino_id: filialA1.id,
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Teste FK'
        });

      expect(response.status).toBe(400);
    });

    test('✅ Cascade delete protection', async () => {
      // Tentar excluir filial com estoque associado
      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA1.id,
        produto_id: produtoA.id,
        quantidade_atual: 50
      });

      const response = await request(app)
        .delete(`/api/filiais/${filialA1.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('estoque associado');
    });

    test('✅ Business rule enforcement', async () => {
      // Tentar criar segunda matriz na mesma empresa
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Segunda Matriz',
          tipo: 'matriz'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Já existe uma matriz cadastrada');
    });
  });

  describe('🌐 Cross-Enterprise Scenarios', () => {
    test('✅ Independent operations', async () => {
      // Todas as empresas operarem simultaneamente
      const promises = [
        request(app)
          .post('/api/filiais')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({ nome_fantasia: 'Nova Filial A', tipo: 'filial' }),
        
        request(app)
          .post('/api/filiais')
          .set('Authorization', `Bearer ${tokenB}`)
          .send({ nome_fantasia: 'Nova Filial B', tipo: 'filial' }),
        
        request(app)
          .post('/api/filiais')
          .set('Authorization', `Bearer ${tokenC}`)
          .send({ nome_fantasia: 'Nova Filial C', tipo: 'filial' })
      ];

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.status).toBe(201);
      });

      // Verificar isolamento completo
      const listA = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`);

      const listB = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`);

      const listC = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenC}`);

      expect(listA.body.filiais).toHaveLength(2);
      expect(listB.body.filiais).toHaveLength(2);
      expect(listC.body.filiais).toHaveLength(2);

      // Cada empresa só vê seus dados
      listA.body.filiais.forEach(f => expect(f.empresa_id).toBe(empresaA.id));
      listB.body.filiais.forEach(f => expect(f.empresa_id).toBe(empresaB.id));
      listC.body.filiais.forEach(f => expect(f.empresa_id).toBe(empresaC.id));
    });
  });
});
