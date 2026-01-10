const request = require('supertest');
const { sequelize } = require('../src/config/database');
const { Venda, Empresa, Usuario, Produto, ItemVenda } = require('../src/models');
const app = require('../src/app');

describe('Payments API - Testes Simples', () => {
  let authToken;
  let empresa;
  let usuario;
  let venda;
  let produto;

  beforeAll(async () => {
    // Conectar ao banco de dados de teste
    await sequelize.authenticate();
    
    // Sincronizar modelos (sem os models de pagamento)
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Fechar conexão
    await sequelize.close();
  });

  beforeEach(async () => {
    // Limpar dados antes de cada teste
    await sequelize.truncate({ cascade: true });

    // Criar empresa de teste
    empresa = await Empresa.create({
      razao_social: 'Farmácia Teste Ltda',
      nome_fantasia: 'Farmácia Teste',
      cnpj: '12345678901234',
      email: 'teste@farmacia.com',
      telefone: '11999999999',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234567'
    });

    // Criar usuário de teste
    usuario = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'usuario@teste.com',
      senha: '123456',
      cpf: '12345678901',
      telefone: '11999999999',
      cargo: 'Gerente',
      role: 'admin',
      empresa_id: empresa.id,
      ativo: true
    });

    // Fazer login para obter token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@teste.com',
        senha: '123456'
      });

    authToken = loginResponse.body.token;

    // Criar produto de teste
    produto = await Produto.create({
      nome: 'Produto Teste',
      descricao: 'Descrição do produto teste',
      codigo_barras: '1234567890123',
      preco_custo: 10.00,
      preco_venda: 15.00,
      estoque_minimo: 5,
      estoque_maximo: 100,
      estoque_atual: 50,
      empresa_id: empresa.id,
      ativo: true
    });

    // Criar venda de teste
    venda = await Venda.create({
      numero_venda: 'V001',
      tipo: 'venda',
      status: 'pendente',
      subtotal: 15.00,
      desconto: 0,
      acrescimo: 0,
      total: 15.00,
      forma_pagamento: null,
      empresa_id: empresa.id,
      usuario_id: usuario.id
    });

    // Criar item da venda
    await ItemVenda.create({
      venda_id: venda.id,
      produto_id: produto.id,
      quantidade: 1,
      preco_unitario: 15.00,
      desconto: 0,
      subtotal: 15.00
    });
  });

  describe('POST /api/payments/create', () => {
    it('deve criar um pagamento simulado com sucesso', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id,
          paymentMethod: 'simulado'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payment.gateway).toBe('simulado');
      expect(response.body.payment.status).toBe('pendente');
      expect(response.body.venda.status).toBe('aguardando_pagamento');
      expect(response.body.message).toContain('aprovado automaticamente em 3 segundos');
    });

    it('deve retornar erro para venda não encontrada', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: '00000000-0000-0000-0000-000000000000',
          paymentMethod: 'simulado'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Venda não encontrada');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .send({
          vendaId: venda.id,
          paymentMethod: 'simulado'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/payments/methods', () => {
    it('deve listar métodos de pagamento simulados', async () => {
      const response = await request(app)
        .get('/api/payments/methods')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.methods).toHaveLength(1);
      expect(response.body.methods[0].id).toBe('simulado');
      expect(response.body.methods[0].name).toBe('Pagamento Simulado');
      expect(response.body.methods[0].enabled).toBe(true);
      expect(response.body.methods[0].features).toContain('Aprovação automática em 3 segundos');
    });
  });

  describe('POST /api/payments/simulate/:scenario', () => {
    it('deve simular cenário aprovado', async () => {
      const response = await request(app)
        .post('/api/payments/simulate/aprovado')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.scenario).toBe('aprovado');
      expect(response.body.status).toBe('aprovado');
      expect(response.body.delay).toBe(1000);
      expect(response.body.message).toContain('aprovado em 1 segundo');
    });

    it('deve simular cenário rejeitado', async () => {
      const response = await request(app)
        .post('/api/payments/simulate/rejeitado')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id
        });

      expect(response.status).toBe(200);
      expect(response.body.scenario).toBe('rejeitado');
      expect(response.body.status).toBe('rejeitado');
      expect(response.body.motivo).toBe('Cartão inválido');
    });

    it('deve simular cenário pendente', async () => {
      const response = await request(app)
        .post('/api/payments/simulate/pendente')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id
        });

      expect(response.status).toBe(200);
      expect(response.body.scenario).toBe('pendente');
      expect(response.body.status).toBe('pendente');
      expect(response.body.action).toBe('Aprovação manual necessária');
    });

    it('deve retornar erro para cenário inválido', async () => {
      const response = await request(app)
        .post('/api/payments/simulate/cenario_invalido')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cenário não suportado');
    });
  });

  describe('Teste de Integração - Fluxo Básico', () => {
    it('deve executar fluxo básico de pagamento', async () => {
      // 1. Criar pagamento
      const createResponse = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id,
          paymentMethod: 'simulado'
        });

      expect(createResponse.status).toBe(200);
      expect(createResponse.body.success).toBe(true);
      
      const paymentId = createResponse.body.payment.paymentId;

      // 2. Verificar status inicial
      const statusResponse = await request(app)
        .get(`/api/payments/status/${paymentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(statusResponse.body.status).toBe('pendente');

      // 3. Aprovar pagamento manualmente
      const approveResponse = await request(app)
        .post(`/api/payments/approve/${paymentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(approveResponse.status).toBe(200);
      expect(approveResponse.body.venda.status).toBe('finalizada');

      // 4. Verificar status final
      const finalStatusResponse = await request(app)
        .get(`/api/payments/status/${paymentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(finalStatusResponse.body.status).toBe('aprovado');
      expect(finalStatusResponse.body.venda.status).toBe('finalizada');
    });
  });

  describe('DELETE /api/payments/cleanup', () => {
    it('deve limpar pagamentos simulados', async () => {
      // Criar alguns pagamentos simulados
      await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vendaId: venda.id,
          paymentMethod: 'simulado'
        });

      const response = await request(app)
        .delete('/api/payments/cleanup')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('pagamentos simulados limpos');
      expect(response.body.vendasResetadas).toBeGreaterThan(0);
    });
  });
});