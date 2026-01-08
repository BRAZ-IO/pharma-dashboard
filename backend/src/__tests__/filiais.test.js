const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../config/database');
const Filial = require('../models/Filial');
const TransferenciaEstoque = require('../models/TransferenciaEstoque');
const Empresa = require('../models/Empresa');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Estoque = require('../models/Estoque');

describe(' Filial Management Tests', () => {
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

    test('❌ Empresa B não deve ver filiais da Empresa A', async () => {
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

    test('❌ Empresa A não deve acessar filial da Empresa B', async () => {
      const response = await request(app)
        .get(`/api/filiais/${filialB1.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Filial não encontrada');
    });

    test('✅ Validação de CNPJ duplicado na mesma empresa', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Filial Duplicada',
          cnpj: '12.345.678/0002-10', // Mesmo CNPJ da filialA1
          tipo: 'filial'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('CNPJ já cadastrado para outra filial');
    });

    test('✅ Validação de matriz única por empresa', async () => {
      const response = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Matriz A',
          tipo: 'matriz'
        });

      expect(response.status).toBe(201);

      // Tentar criar outra matriz
      const response2 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome_fantasia: 'Matriz A 2',
          tipo: 'matriz'
        });

      expect(response2.status).toBe(400);
      expect(response2.body.error).toBe('Já existe uma matriz cadastrada');
    });
  });

  describe('🚚 Transferências Multi-Tenant', () => {
    beforeAll(async () => {
      // Criar filiais adicionais para testes
      filialA2 = await Filial.create({
        empresa_id: empresaA.id,
        nome_fantasia: 'Filial Sul A',
        tipo: 'filial',
        status: 'ativa'
      });

      // Criar estoque para testes
      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA1.id,
        produto_id: produtoA.id,
        quantidade_atual: 100,
        quantidade_minima: 10,
        quantidade_maxima: 200,
        lote: 'L20240101'
      });

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
          motivo_transferencia: 'Reposição de estoque'
        });

      expect(response.status).toBe(201);
      expect(response.body.empresa_id).toBe(empresaA.id);
      expect(response.body.filial_origem_id).toBe(filialA1.id);
      expect(response.body.filial_destino_id).toBe(filialA2.id);
      expect(response.body.status).toBe('aprovada'); // Auto-aprovada
    });

    test('❌ Empresa A não deve transferir para filial da Empresa B', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialB1.id, // Filial da Empresa B
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Transferência cruzada'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Uma ou ambas as filiais não encontradas');
    });

    test('❌ Empresa B não deve ver transferências da Empresa A', async () => {
      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body.transferencias).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    test('✅ Empresa A deve ver apenas suas transferências', async () => {
      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.transferencias).toHaveLength(1);
      expect(response.body.transferencias[0].empresa_id).toBe(empresaA.id);
    });

    test('❌ Validação de estoque insuficiente', async () => {
      // Tentar transferir mais do que o disponível
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialA2.id,
          produto_id: produtoA.id,
          quantidade: 200, // Mais que o disponível (100)
          lote: 'L20240101',
          motivo_transferencia: 'Transferência excessiva'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Estoque insuficiente na filial de origem');
    });

    test('✅ Fluxo completo de transferência', async () => {
      // 1. Criar transferência
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.id,
          filial_destino_id: filialA2.id,
          produto_id: produtoA.id,
          quantidade: 10,
          lote: 'L20240101',
          motivo_transferencia: 'Teste fluxo completo'
        });

      expect(transferencia.status).toBe(201);
      const transferenciaId = transferencia.body.id;

      // 2. Iniciar transporte
      const transporte = await request(app)
        .put(`/api/transferencias/${transferenciaId}/iniciar-transporte`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(transporte.status).toBe(200);
      expect(transporte.body.status).toBe('em_transito');

      // 3. Confirmar recebimento
      const recebimento = await request(app)
        .put(`/api/transferencias/${transferenciaId}/confirmar-recebimento`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          quantidade_recebida: 10,
          observacoes_recebimento: 'Recebido com sucesso'
        });

      expect(recebimento.status).toBe(200);
      expect(recebimento.body.status).toBe('concluida');

      // 4. Verificar estoques atualizados
      const estoqueOrigem = await Estoque.findOne({
        where: { filial_id: filialA1.id, produto_id: produtoA.id }
      });

      const estoqueDestino = await Estoque.findOne({
        where: { filial_id: filialA2.id, produto_id: produtoA.id }
      });

      expect(estoqueOrigem.quantidade_atual).toBe(80); // 100 - 20 (primeira) - 10 (segunda)
      expect(estoqueDestino.quantidade_atual).toBe(60); // 50 + 10
    });
  });

  describe('🔒 Segurança e Validações', () => {
    test('❌ Acesso sem token deve ser negado', async () => {
      const response = await request(app)
        .get('/api/filiais');

      expect(response.status).toBe(401);
    });

    test('❌ Token inválido deve ser negado', async () => {
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

  describe('📊 Estatísticas e Relatórios', () => {
    test('✅ Estatísticas por empresa', async () => {
      const response = await request(app)
        .get('/api/filiais/stats/overview')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.statusStats).toBeDefined();
      expect(response.body.tipoStats).toBeDefined();
    });

    test('✅ Estatísticas de transferências por empresa', async () => {
      const response = await request(app)
        .get('/api/transferencias/stats/overview')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
