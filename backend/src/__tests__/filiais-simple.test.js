const request = require('supertest');
const { sequelize } = require('../config/database');

// Importar modelos diretamente
const Empresa = require('../models/Empresa');
const Filial = require('../models/Filial');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Estoque = require('../models/Estoque');
const TransferenciaEstoque = require('../models/TransferenciaEstoque');

// Criar app Express simplificado para testes
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar e usar rotas
const authRoutes = require('../routes/auth');
const filiaisRoutes = require('../routes/filiais');
const transferenciasRoutes = require('../routes/transferencias');

// Adicionar rotas
app.use('/api/auth', authRoutes);
app.use('/api/filiais', filiaisRoutes);
app.use('/api/transferencias', transferenciasRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

describe('🏢 Filial Management Tests', () => {
  let empresaA, empresaB, usuarioA, usuarioB, produtoA, produtoB;
  let tokenA, tokenB;
  let filialA1, filialA2, filialB1;

  beforeAll(async () => {
    // Limpar banco de dados
    await sequelize.sync({ force: true });

    // Criar empresas de teste
    empresaA = await Empresa.create({
      razao_social: 'Farmácia A LTDA',
      nome_fantasia: 'Farmácia A',
      cnpj: '12.345.678/0001-90',
      email: 'contato@farmaciaa.com',
      telefone: '(11) 3456-7890'
    });

    empresaB = await Empresa.create({
      razao_social: 'Farmácia B LTDA',
      nome_fantasia: 'Farmácia B',
      cnpj: '98.765.432/0001-10',
      email: 'contato@farmaciab.com',
      telefone: '(21) 2345-6789'
    });

    // Criar usuários de teste
    usuarioA = await Usuario.create({
      nome: 'João Silva',
      email: 'joao@farmaciaa.com',
      senha: 'senha123',
      empresa_id: empresaA.id,
      role: 'admin'
    });

    usuarioB = await Usuario.create({
      nome: 'Maria Santos',
      email: 'maria@farmaciab.com',
      senha: 'senha123',
      empresa_id: empresaB.id,
      role: 'admin'
    });

    // Criar produtos de teste
    produtoA = await Produto.create({
      nome: 'Paracetamol 750mg',
      codigo_barras: '7891234567890',
      descricao: 'Analgésico e antitérmico',
      empresa_id: empresaA.id,
      quantidade_minima: 10,
      quantidade_maxima: 100,
      preco_venda: 15.90
    });

    produtoB = await Produto.create({
      nome: 'Dipirona 500mg',
      codigo_barras: '7891234567891',
      descricao: 'Analgésico e antitérmico',
      empresa_id: empresaB.id,
      quantidade_minima: 15,
      quantidade_maxima: 80,
      preco_venda: 12.50
    });

    // Obter tokens de autenticação
    const loginA = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'joao@farmaciaa.com',
        senha: 'senha123'
      });

    const loginB = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'maria@farmaciab.com',
        senha: 'senha123'
      });

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('📋 CRUD de Filiais', () => {
    test('✅ Empresa A deve conseguir criar suas filiais', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Filial Centro A',
          razao_social: 'Filial Centro A LTDA',
          cnpj: '12.345.678/0002-10',
          tipo: 'filial',
          telefone: '(11) 3456-7891',
          email: 'centro@farmaciaa.com',
          endereco: {
            cep: '01234-567',
            logradouro: 'Rua das Flores',
            numero: '123',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP'
          },
          gerente_responsavel: 'Carlos Gerente',
          capacidade_estoque: 500
        });

      expect(response.status).toBe(201);
      expect(response.body.nome_fantasia).toBe('Filial Centro A');
      expect(response.body.empresa_id).toBe(empresaA.id);
      filialA1 = response.body;
    });

    test('✅ Empresa A deve conseguir listar apenas suas filiais', async () => {
      // Criar outra filial para Empresa A
      await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Filial Norte A',
          tipo: 'filial'
        });

      const response = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.filiais).toHaveLength(2);
      expect(response.body.total).toBe(2);
      
      // Verificar se todas as filiais pertencem à Empresa A
      response.body.filiais.forEach(filial => {
        expect(filial.empresa_id).toBe(empresaA.id);
      });
    });

    test('✅ Empresa B não deve ver filiais da Empresa A (isolamento correto)', async () => {
      const response = await request(app)
        .get('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body.filiais).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    test('✅ Empresa B deve conseguir criar suas próprias filiais', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({
          nome_fantasia: 'Filial Centro B',
          tipo: 'filial',
          endereco: {
            cidade: 'Rio de Janeiro',
            estado: 'RJ'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.empresa_id).toBe(empresaB.id);
      filialB1 = response.body;
    });

    test('✅ Empresa A não deve acessar filial da Empresa B (acesso negado)', async () => {
      const response = await request(app)
        .get(`/api/filiais/${filialB1.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Filial não encontrada');
    });
  });

  describe('🚚 Transferências Multi-Tenant', () => {
    let filialA2;
    
    beforeAll(async () => {
      // Criar estoques para testes
      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA1.id,
        produto_id: produtoA.id,
        quantidade_atual: 100,
        quantidade_minima: 10,
        quantidade_maxima: 200,
        lote: 'L20240101'
      });

      // Criar segunda filial para Empresa A
      const filialA2Response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial Sul A', tipo: 'filial' });

      filialA2 = filialA2Response.body;

      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA2.id,
        produto_id: produtoA.id,
        quantidade_atual: 50,
        quantidade_minima: 10,
        quantidade_maxima: 200,
        lote: 'L20240102'
      });
    });

    test('✅ Empresa A deve conseguir transferir entre suas filiais', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialA2.id,
          produto_id: produtoA.id,
          quantidade: 20,
          lote: 'L20240101',
          motivo_transferencia: 'Teste transferência',
          usuario_solicitante_id: usuarioA.id // Adicionando manualmente
        });

      expect(response.status).toBe(201);
      expect(response.body.empresa_id).toBe(empresaA.id);
    });

    test('✅ Empresa A não deve transferir para filial da Empresa B (bloqueado)', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialB1.id, // Filial de outra empresa
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Transferência cruzada'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Uma ou ambas as filiais não encontradas');
    });

    test('✅ Empresa B não deve ver transferências da Empresa A (isolamento)', async () => {
      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body.transferencias).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });
  });

  describe('🔒 Segurança e Validações', () => {
    test('✅ Acesso sem token deve ser negado (401)', async () => {
      const response = await request(app)
        .get('/api/filiais');

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    test('✅ Token inválido deve ser negado (401)', async () => {
      const response = await request(app)
        .get('/api/filiais')
        .set('Authorization', 'Bearer token-invalido');

      expect(response.status).toBe(401);
    });

    test('✅ Validação de dados obrigatórios', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          // Sem nome_fantasia
          tipo: 'filial'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('✅ Validação de formato de CNPJ', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Filial Teste',
          cnpj: '123456789', // Formato inválido
          tipo: 'filial'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('✅ Validação de email', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Filial Teste',
          email: 'email-invalido', // Formato inválido
          tipo: 'filial'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
