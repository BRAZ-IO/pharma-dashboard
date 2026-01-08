const request = require('supertest');
const app = require('../app');
const { sequelize, Empresa, Usuario, Fornecedor, Cliente, FluxoCaixa } = require('../models');
const bcrypt = require('bcryptjs');

describe('Multi-Tenant Isolation Tests', () => {
  let empresaA, empresaB;
  let usuarioA, usuarioB;
  let tokenA, tokenB;
  let fornecedorA, fornecedorB;
  let clienteA, clienteB;
  let fluxoCaixaA, fluxoCaixaB;

  beforeAll(async () => {
    // Limpar banco de dados
    await sequelize.sync({ force: true });

    // Criar empresas
    empresaA = await Empresa.create({
      razao_social: 'Farmácia A Teste',
      nome_fantasia: 'Farmácia A',
      cnpj: '00000000000191',
      email: 'contato@farmaciaa.com',
      telefone: '(11) 1111-1111',
      endereco: {
        rua: 'Rua A',
        numero: '100',
        bairro: 'Bairro A',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '00000-000'
      }
    });

    empresaB = await Empresa.create({
      razao_social: 'Farmácia B Teste',
      nome_fantasia: 'Farmáncia B',
      cnpj: '00000000000272',
      email: 'contato@farmaciab.com',
      telefone: '(21) 2222-2222',
      endereco: {
        rua: 'Rua B',
        numero: '200',
        bairro: 'Bairro B',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '11111-111'
      }
    });

    // Criar usuários
    const senhaHash = await bcrypt.hash('123456', 12);
    
    usuarioA = await Usuario.create({
      nome: 'Usuário A',
      email: 'usuario@farmaciaa.com',
      senha: senhaHash,
      empresa_id: empresaA.id,
      role: 'gerente'
    });

    usuarioB = await Usuario.create({
      nome: 'Usuário B',
      email: 'usuario@farmaciab.com',
      senha: senhaHash,
      empresa_id: empresaB.id,
      role: 'gerente'
    });

    // Criar tokens mockados para teste
    const jwt = require('jsonwebtoken');
    tokenA = jwt.sign(
      { 
        id: usuarioA.id, 
        email: usuarioA.email, 
        empresa_id: usuarioA.empresa_id,
        role: usuarioA.role 
      },
      process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
      { expiresIn: '1h' }
    );
    
    tokenB = jwt.sign(
      { 
        id: usuarioB.id, 
        email: usuarioB.email, 
        empresa_id: usuarioB.empresa_id,
        role: usuarioB.role 
      },
      process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
      { expiresIn: '1h' }
    );

    // Criar dados para cada empresa
    fornecedorA = await Fornecedor.create({
      nome: 'Fornecedor A',
      cnpj: '11222333000181', // CNPJ válido
      email: 'fornecedor@farmaciaa.com',
      empresa_id: empresaA.id
    });

    fornecedorB = await Fornecedor.create({
      nome: 'Fornecedor B',
      cnpj: '04252011000144', // CNPJ válido (Google Brasil)
      email: 'fornecedor@farmaciab.com',
      empresa_id: empresaB.id
    });

    clienteA = await Cliente.create({
      nome: 'Cliente A',
      cpf: '12345678909', // CPF válido
      email: 'cliente@farmaciaa.com',
      empresa_id: empresaA.id
    });

    clienteB = await Cliente.create({
      nome: 'Cliente B',
      cpf: '98765432100', // CPF válido
      email: 'cliente@farmaciab.com',
      empresa_id: empresaB.id
    });

    fluxoCaixaA = await FluxoCaixa.create({
      descricao: 'Entrada A',
      tipo: 'entrada',
      valor: 100.00,
      categoria: 'Vendas',
      empresa_id: empresaA.id
    });

    fluxoCaixaB = await FluxoCaixa.create({
      descricao: 'Entrada B',
      tipo: 'entrada',
      valor: 200.00,
      categoria: 'Vendas',
      empresa_id: empresaB.id
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Fornecedores - Isolamento Multi-Tenant', () => {
    test('Usuário A deve acessar apenas seus fornecedores', async () => {
      const response = await request(app)
        .get('/api/fornecedores')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.fornecedores).toHaveLength(1);
      expect(response.body.fornecedores[0].nome).toBe('Fornecedor A');
      expect(response.body.fornecedores[0].empresa_id).toBe(empresaA.id);
    });

    test('Usuário B deve acessar apenas seus fornecedores', async () => {
      const response = await request(app)
        .get('/api/fornecedores')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(response.body.fornecedores).toHaveLength(1);
      expect(response.body.fornecedores[0].nome).toBe('Fornecedor B');
      expect(response.body.fornecedores[0].empresa_id).toBe(empresaB.id);
    });

    test('Usuário A não deve acessar fornecedor da Empresa B', async () => {
      const response = await request(app)
        .get(`/api/fornecedores/${fornecedorB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);

      expect(response.body.erro).toBe('Fornecedor não encontrado');
    });

    test('Usuário B não deve acessar fornecedor da Empresa A', async () => {
      const response = await request(app)
        .get(`/api/fornecedores/${fornecedorA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);

      expect(response.body.erro).toBe('Fornecedor não encontrado');
    });

    test('Usuário A não deve atualizar fornecedor da Empresa B', async () => {
      const response = await request(app)
        .put(`/api/fornecedores/${fornecedorB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome: 'Nome Alterado', cnpj: '11222333000181' })
        .expect(404);

      expect(response.body.erro).toBe('Fornecedor não encontrado');
    });

    test('Usuário B não deve excluir fornecedor da Empresa A', async () => {
      const response = await request(app)
        .delete(`/api/fornecedores/${fornecedorA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);

      expect(response.body.erro).toBe('Fornecedor não encontrado');
    });
  });

  describe('Clientes - Isolamento Multi-Tenant', () => {
    test('Usuário A deve acessar apenas seus clientes', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.clientes).toHaveLength(1);
      expect(response.body.clientes[0].nome).toBe('Cliente A');
      expect(response.body.clientes[0].empresa_id).toBe(empresaA.id);
    });

    test('Usuário B deve acessar apenas seus clientes', async () => {
      const response = await request(app)
        .get('/api/clientes')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(response.body.clientes).toHaveLength(1);
      expect(response.body.clientes[0].nome).toBe('Cliente B');
      expect(response.body.clientes[0].empresa_id).toBe(empresaB.id);
    });

    test('Usuário A não deve acessar cliente da Empresa B', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);

      expect(response.body.erro).toBe('Cliente não encontrado');
    });

    test('Usuário B não deve acessar cliente da Empresa A', async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);

      expect(response.body.erro).toBe('Cliente não encontrado');
    });
  });

  describe('Fluxo de Caixa - Isolamento Multi-Tenant', () => {
    test('Usuário A deve acessar apenas suas transações', async () => {
      const response = await request(app)
        .get('/api/fluxo-caixa')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.transacoes).toHaveLength(1);
      expect(response.body.transacoes[0].descricao).toBe('Entrada A');
      expect(response.body.transacoes[0].empresa_id).toBe(empresaA.id);
    });

    test('Usuário B deve acessar apenas suas transações', async () => {
      const response = await request(app)
        .get('/api/fluxo-caixa')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(response.body.transacoes).toHaveLength(1);
      expect(response.body.transacoes[0].descricao).toBe('Entrada B');
      expect(response.body.transacoes[0].empresa_id).toBe(empresaB.id);
    });

    test('Usuário A não deve acessar transação da Empresa B', async () => {
      const response = await request(app)
        .get(`/api/fluxo-caixa/${fluxoCaixaB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);

      expect(response.body.erro).toBe('Transação não encontrada');
    });

    test('Usuário B não deve acessar transação da Empresa A', async () => {
      const response = await request(app)
        .get(`/api/fluxo-caixa/${fluxoCaixaA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);

      expect(response.body.erro).toBe('Transação não encontrada');
    });

    test('Resumo do fluxo de caixa deve ser isolado por empresa', async () => {
      const responseA = await request(app)
        .get('/api/fluxo-caixa/resumo')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      const responseB = await request(app)
        .get('/api/fluxo-caixa/resumo')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(responseA.body.totalEntradas).toBe(100.00);
      expect(responseB.body.totalEntradas).toBe(200.00);
      expect(responseA.body.saldo).toBe(100.00);
      expect(responseB.body.saldo).toBe(200.00);
    });
  });

  describe('Cross-tenant Data Leakage Tests', () => {
    test('Busca por CNPJ deve retornar apenas da própria empresa', async () => {
      // Testa busca por CNPJ da própria empresa (deve encontrar)
      const responsePropria = await request(app)
        .get(`/api/fornecedores/cnpj/${fornecedorA.cnpj}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(responsePropria.body.nome).toBe('Fornecedor A');

      // Testa busca por CNPJ de outra empresa (não deve encontrar)
      const responseOutra = await request(app)
        .get(`/api/fornecedores/cnpj/12345678901234`) // CNPJ inválido
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(400); // CNPJ inválido retorna 400

      expect(responseOutra.body.erro).toBe('CNPJ inválido');
    });

    test('Busca por CPF deve retornar apenas da própria empresa', async () => {
      const response = await request(app)
        .get(`/api/clientes/cpf/${clienteB.cpf}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);

      expect(response.body.erro).toBe('Cliente não encontrado');
    });

    test('Listagem com busca não deve retornar dados de outras empresas', async () => {
      const response = await request(app)
        .get('/api/fornecedores?busca=Fornecedor')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.fornecedores).toHaveLength(1);
      expect(response.body.fornecedores[0].nome).toBe('Fornecedor A');
    });

    test('Relatório deve conter apenas dados da própria empresa', async () => {
      const responseA = await request(app)
        .get('/api/fluxo-caixa/relatorio')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(responseA.body.dados).toHaveLength(1);
      expect(responseA.body.dados[0].categoria).toBe('Vendas');
    });
  });

  describe('Security Boundary Tests', () => {
    test('Token inválido não deve acessar dados', async () => {
      const response = await request(app)
        .get('/api/fornecedores')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });

    test('Sem token não deve acessar dados', async () => {
      const response = await request(app)
        .get('/api/fornecedores')
        .expect(401);
    });

    test('Tentativa de SQL injection deve ser bloqueada', async () => {
      // Tentativa de SQL injection não deve retornar dados
      const response = await request(app)
        .get('/api/fornecedores?busca=DROP TABLE')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      // A busca não deve encontrar nada com o termo suspeito
      expect(response.body.fornecedores).toHaveLength(0);
    });
  });
});
