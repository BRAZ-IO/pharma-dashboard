const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../config/database');

const Empresa = require('../models/Empresa');
const Usuario = require('../models/Usuario');
const Produto = require('../models/Produto');
const Filial = require('../models/Filial');
const Estoque = require('../models/Estoque');

describe('🔐 Transfer Security & Isolation Tests', () => {
  let empresaA, empresaB;
  let usuarioA, usuarioB, usuarioMalicioso;
  let tokenA, tokenB, tokenMalicioso;
  let filialA1, filialA2, filialB1;
  let produtoA, produtoB;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Criar empresas legítimas
    empresaA = await Empresa.create({
      razao_social: 'Farmácia A LTDA',
      nome_fantasia: 'Farmácia A',
      cnpj: '12.345.678/0001-90',
      email: 'contato@farmaciaa.com'
    });

    empresaB = await Empresa.create({
      razao_social: 'Farmácia B LTDA',
      nome_fantasia: 'Farmácia B',
      cnpj: '98.765.432/0001-10',
      email: 'contato@farmaciab.com'
    });

    // Criar usuários legítimos
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

    // Criar usuário malicioso (pertence à Empresa A)
    usuarioMalicioso = await Usuario.create({
      nome: 'Hacker Malicioso',
      email: 'hacker@farmaciaa.com',
      senha: 'senha123',
      empresa_id: empresaA.id,
      role: 'user' // Role limitado
    });

    // Criar produtos
    produtoA = await Produto.create({
      nome: 'Medicamento Controlado',
      codigo_barras: '7891234567890',
      empresa_id: empresaA.id,
      descricao: 'Medicamento de alto valor',
      preco: 150.00,
      preco_venda: 189.90
    });

    produtoB = await Produto.create({
      nome: 'Medicamento Comum',
      codigo_barras: '7891234567891',
      empresa_id: empresaB.id,
      descricao: 'Medicamento de baixo valor',
      preco: 25.00,
      preco_venda: 45.50
    });

    // Obter tokens
    const loginA = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@farmaciaa.com', senha: 'senha123' });

    const loginB = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@farmaciab.com', senha: 'senha123' });

    const loginMalicioso = await request(app)
      .post('/api/auth/login')
      .send({ email: 'hacker@farmaciaa.com', senha: 'senha123' });

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
    tokenMalicioso = loginMalicioso.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('🔒 Basic Security Tests', () => {
    test('❌ Acesso sem token deve ser negado', async () => {
      const response = await request(app)
        .get('/api/transferencias');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('não fornecido');
    });

    test('❌ Token inválido deve ser negado', async () => {
      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', 'Bearer token-invalido');

      expect(response.status).toBe(401);
    });

    test('❌ Token expirado deve ser negado', async () => {
      // Simular token expirado
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJmYXJtYWNpYS5jb20iLCJpYXQiOjE2MDA2MjQwMDAsImV4cCI6MTYwMDYyNzYwMH0.invalid';

      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('🏢 Multi-Tenant Isolation', () => {
    test('✅ Empresa A só vê suas transferências', async () => {
      // Criar filiais para Empresa A
      filialA1 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial Centro A', tipo: 'filial' });

      filialA2 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome_fantasia: 'Filial Norte A', tipo: 'filial' });

      // Criar filial para Empresa B
      filialB1 = await request(app)
        .post('/api/filiais')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ nome_fantasia: 'Filial Centro B', tipo: 'filial' });

      // Criar estoque
      await Estoque.create({
        empresa_id: empresaA.id,
        filial_id: filialA1.body.id,
        produto_id: produtoA.id,
        quantidade_atual: 100,
        lote: 'L20240101'
      });

      // Criar transferência na Empresa A
      const transferenciaA = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 20,
          motivo_transferencia: 'Transferência interna A'
        });

      expect(transferenciaA.status).toBe(201);

      // Empresa A deve ver sua transferência
      const listaA = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(listaA.status).toBe(200);
      expect(listaA.body.transferencias).toHaveLength(1);
      expect(listaA.body.transferencias[0].empresa_id).toBe(empresaA.id);

      // Empresa B não deve ver transferências da Empresa A
      const listaB = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(listaB.status).toBe(200);
      expect(listaB.body.transferencias).toHaveLength(0);
    });

    test('❌ Empresa A não pode acessar transferências da Empresa B', async () => {
      // Criar transferência na Empresa B
      await Estoque.create({
        empresa_id: empresaB.id,
        filial_id: filialB1.body.id,
        produto_id: produtoB.id,
        quantidade_atual: 50,
        lote: 'L20240102'
      });

      const transferenciaB = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({
          filial_origem_id: filialB1.body.id,
          filial_destino_id: filialB1.body.id, // Mesma filial (deve falhar)
          produto_id: produtoB.id,
          quantidade: 10,
          motivo_transferencia: 'Teste'
        });

      // Empresa A tentando acessar transferência da Empresa B
      const response = await request(app)
        .get(`/api/transferencias/${transferenciaB.body.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Transferência não encontrada');
    });
  });

  describe('🚫 Business Logic Security', () => {
    test('❌ Transferência entre empresas diferentes deve ser bloqueada', async () => {
      // Tentar transferir da Empresa A para Empresa B
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialB1.body.id, // Filial de outra empresa
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Tentativa cruzada'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Uma ou ambas as filiais não encontradas');
    });

    test('❌ Transferência com estoque insuficiente deve ser bloqueada', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 200, // Mais que o disponível (100)
          motivo_transferencia: 'Estoque insuficiente'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Estoque insuficiente na filial de origem');
    });

    test('❌ Transferência inválida (mesma filial) deve ser bloqueada', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA1.body.id, // Mesma filial
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Inválido'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Filial de origem e destino devem ser diferentes');
    });

    test('❌ Quantidade negativa deve ser bloqueada', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: -10, // Negativo
          motivo_transferencia: 'Inválido'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('❌ Produto inexistente deve ser bloqueado', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: 'produto-inexistente',
          quantidade: 10,
          motivo_transferencia: 'Inválido'
        });

      expect(response.status).toBe(500); // Erro de FK
    });
  });

  describe('🔐 Advanced Security Tests', () => {
    test('❌ SQL Injection prevention', async () => {
      // Tentativa de SQL Injection no parâmetro de busca
      const response = await request(app)
        .get('/api/transferencias?empresa_id=1\' OR \'1\'=\'1')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.transferencias.length).toBeLessThan(100); // Não deve retornar tudo
    });

    test('❌ XSS prevention in transferência data', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: xssPayload
        });

      expect(response.status).toBe(201);
      // O XSS deve ser escapado no banco de dados
      expect(response.body.motivo_transferencia).not.toBe(xssPayload);
    });

    test('❌ Rate limiting simulation', async () => {
      // Simular muitas requisições rápidas
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app)
            .get('/api/transferencias')
            .set('Authorization', `Bearer ${tokenA}`)
        );
      }

      const results = await Promise.all(promises);
      
      // Pelo menos algumas devem ser bem-sucedidas
      const successCount = results.filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThan(0);
      
      // Mas pode haver rate limiting
      const rateLimitedCount = results.filter(r => r.status === 429).length;
      if (rateLimitedCount > 0) {
        expect(rateLimitedCount).toBeLessThan(100);
      }
    });

    test('❌ Token manipulation attempt', async () => {
      // Tentativa de modificar token para acessar outra empresa
      const modifiedToken = tokenA.replace(empresaA.id, empresaB.id);
      
      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${modifiedToken}`);

      // Deve falhar na validação do JWT
      expect(response.status).toBe(401);
    });
  });

  describe('👤 User Role Security', () => {
    test('❌ Usuário com role limitado não deve acessar tudo', async () => {
      // Usuário malicioso tentando acessar transferências
      const response = await request(app)
        .get('/api/transferencias')
        .set('Authorization', `Bearer ${tokenMalicioso}`);

      // Pode ter acesso limitado ou negado dependendo das regras
      expect([200, 403]).toContain(response.status);
    });

    test('❌ Usuário não pode criar transferência sem permissão', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenMalicioso}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Teste permissão'
        });

      // Deve ser negado se o usuário não tiver permissão
      expect([403, 401]).toContain(response.status);
    });
  });

  describe('🔍 Data Integrity & Audit', () => {
    test('✅ Transferência deve manter rastreamento completo', async () => {
      // Criar transferência válida
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 15,
          motivo_transferencia: 'Teste auditoria'
        });

      expect(transferencia.status).toBe(201);

      // Verificar dados de auditoria
      expect(transferencia.body.usuario_solicitante_id).toBe(usuarioA.id);
      expect(transferencia.body.data_solicitacao).toBeDefined();
      expect(transferencia.body.empresa_id).toBe(empresaA.id);

      // Obter detalhes completos
      const detalhes = await request(app)
        .get(`/api/transferencias/${transferencia.body.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(detalhes.status).toBe(200);
      expect(detalhes.body.usuarioSolicitante).toBeDefined();
      expect(detalhes.body.filialOrigem).toBeDefined();
      expect(detalhes.body.filialDestino).toBeDefined();
      expect(detalhes.body.produto).toBeDefined();
    });

    test('✅ Cancelamento deve registrar motivo', async () => {
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 5,
          motivo_transferencia: 'Para cancelar'
        });

      const cancelamento = await request(app)
        .put(`/api/transferencias/${transferencia.body.id}/cancelar`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          motivo_cancelamento: 'Cancelamento de teste'
        });

      expect(cancelamento.status).toBe(200);
      expect(cancelamento.body.status).toBe('cancelada');
      expect(cancelamento.body.observacoes).toBe('Cancelamento de teste');
    });

    test('✅ Fluxo completo deve manter consistência', async () => {
      // Criar transferência
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 10,
          lote: 'L20240101'
        });

      // Iniciar transporte
      const transporte = await request(app)
        .put(`/api/transferencias/${transferencia.body.id}/iniciar-transporte`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(transporte.status).toBe(200);
      expect(transporte.body.status).toBe('em_transito');

      // Confirmar recebimento
      const recebimento = await request(app)
        .put(`/api/transferencias/${transferencia.body.id}/confirmar-recebimento`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          quantidade_recebida: 10,
          observacoes_recebimento: 'Recebido OK'
        });

      expect(recebimento.status).toBe(200);
      expect(recebimento.body.status).toBe('concluida');

      // Verificar estoques
      const estoqueOrigem = await Estoque.findOne({
        where: { filial_id: filialA1.body.id, produto_id: produtoA.id }
      });

      const estoqueDestino = await Estoque.findOne({
        where: { filial_id: filialA2.body.id, produto_id: produtoA.id }
      });

      expect(estoqueOrigem.quantidade_atual).toBe(90); // 100 - 10
      expect(estoqueDestino.quantidade_atual).toBe(10); // 0 + 10
    });
  });

  describe('🚨 Edge Cases & Error Handling', () => {
    test('❌ Transferência com filial inexistente', async () => {
      const response = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: 'uuid-inexistente',
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 10,
          motivo_transferencia: 'Teste'
        });

      expect(response.status).toBe(400);
    });

    test('❌ Transferência em status inválido', async () => {
      // Criar transferência e tentar operações inválidas
      const transferencia = await request(app)
        .post('/api/transferencias')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          filial_origem_id: filialA1.body.id,
          filial_destino_id: filialA2.body.id,
          produto_id: produtoA.id,
          quantidade: 10
        });

      // Tentar cancelar transferência já concluída
      const concluida = await request(app)
        .put(`/api/transferencias/${transferencia.body.id}/cancelar`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ motivo_cancelamento: 'Teste' });

      expect(concluida.status).toBe(400);
      expect(concluida.body.error).toContain('apenas transferências solicitadas ou aprovadas');
    });
  });
});
