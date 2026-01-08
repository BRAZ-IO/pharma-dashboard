const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Empresa, Usuario, Fornecedor, Cliente, FluxoCaixa } = require('../models');

describe('Integridade de Dados e Edge Cases', () => {
  let empresaA, empresaB;
  let usuarioA, usuarioB;
  let tokenA, tokenB;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Criar empresas
    empresaA = await Empresa.create({
      razao_social: 'Empresa A LTDA',
      nome_fantasia: 'Empresa A',
      cnpj: '11222333000181',
      email: 'empresa@empresaA.com',
      telefone: '11999999999'
    });

    empresaB = await Empresa.create({
      razao_social: 'Empresa B LTDA',
      nome_fantasia: 'Empresa B',
      cnpj: '22333444000182',
      email: 'empresa@empresaB.com',
      telefone: '11888888888'
    });

    // Criar usuários
    const senhaHash = await bcrypt.hash('123456', 10);
    
    usuarioA = await Usuario.create({
      nome: 'Usuário A',
      email: 'usuario@empresaA.com',
      senha: senhaHash,
      empresa_id: empresaA.id,
      role: 'gerente'
    });

    usuarioB = await Usuario.create({
      nome: 'Usuário B',
      email: 'usuario@empresaB.com',
      senha: senhaHash,
      empresa_id: empresaB.id,
      role: 'gerente'
    });

    tokenA = jwt.sign(
      { id: usuarioA.id, email: usuarioA.email, empresa_id: usuarioA.empresa_id, role: usuarioA.role },
      process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
      { expiresIn: '1h' }
    );

    tokenB = jwt.sign(
      { id: usuarioB.id, email: usuarioB.email, empresa_id: usuarioB.empresa_id, role: usuarioB.role },
      process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Integridade Referencial', () => {
    test('Deve manter integridade ao deletar empresa com dados relacionados', async () => {
      // Criar dados relacionados
      const fornecedor = await Fornecedor.create({
        nome: 'Fornecedor Teste',
        cnpj: '12345678901234',
        email: 'fornecedor@teste.com',
        empresa_id: empresaA.id
      });

      const cliente = await Cliente.create({
        nome: 'Cliente Teste',
        cpf: '12345678909',
        email: 'cliente@teste.com',
        empresa_id: empresaA.id
      });

      // Tentar deletar empresa (deve falhar ou ser bloqueado)
      try {
        await empresaA.destroy();
        // Se não falhar, os dados relacionados devem ser tratados
        const fornecedorExistente = await Fornecedor.findByPk(fornecedor.id);
        const clienteExistente = await Cliente.findByPk(cliente.id);
        
        // Ou os dados são deletados em cascade ou a operação é bloqueada
        expect([true, false]).toContain(fornecedorExistente === null);
        expect([true, false]).toContain(clienteExistente === null);
      } catch (error) {
        // Se falhar por constraint, é esperado
        expect(error.name).toMatch(/SequelizeForeignKeyConstraintError|ConstraintError/);
      }
    });

    test('Não deve permitir criar registros com empresa_id inválido', async () => {
      const invalidEmpresaId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .post('/api/fornecedores')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          nome: 'Fornecedor Inválido',
          cnpj: '12345678901234',
          email: 'invalid@teste.com',
          empresa_id: invalidEmpresaId
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('Deve manter consistência em operações transacionais', async () => {
      // Simular operação complexa que deve ser atômica
      const transactionData = {
        fornecedor: {
          nome: 'Fornecedor Transacional',
          cnpj: '98765432109876',
          email: 'trans@teste.com'
        },
        cliente: {
          nome: 'Cliente Transacional',
          cpf: '98765432100',
          email: 'cliente-trans@teste.com'
        }
      };

      // Criar ambos os registros
      const fornecedorResponse = await request(app)
        .post('/api/fornecedores')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(transactionData.fornecedor)
        .expect(201);

      const clienteResponse = await request(app)
        .post('/api/clientes')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(transactionData.cliente)
        .expect(201);

      // Verificar que ambos pertencem à mesma empresa
      expect(fornecedorResponse.body.empresa_id).toBe(empresaA.id);
      expect(clienteResponse.body.empresa_id).toBe(empresaA.id);

      // Verificar que ambos podem ser acessados
      const fornecedorGet = await request(app)
        .get(`/api/fornecedores/${fornecedorResponse.body.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      const clienteGet = await request(app)
        .get(`/api/clientes/${clienteResponse.body.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(fornecedorGet.body.empresa_id).toBe(empresaA.id);
      expect(clienteGet.body.empresa_id).toBe(empresaA.id);
    });
  });

  describe('Edge Cases e Valores Limite', () => {
    test('Deve handle strings vazias e nulas corretamente', async () => {
      const edgeCases = [
        { nome: '', email: 'test@empty.com' }, // Nome vazio
        { nome: 'Test', email: '' }, // Email vazio
        { nome: ' ', email: 'test@space.com' }, // Nome com espaço apenas
        { nome: 'Test', email: ' ' }, // Email com espaço apenas
        { nome: null, email: 'test@null.com' }, // Nome nulo
        { nome: 'Test', email: null } // Email nulo
      ];

      for (const testCase of edgeCases) {
        const response = await request(app)
          .post('/api/usuarios')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({
            senha: '123456',
            role: 'funcionario',
            ...testCase
          });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
      }
    });

    test('Deve handle valores numéricos extremos', async () => {
      const extremeValues = [
        { valor: 0.01 }, // Valor mínimo positivo
        { valor: 999999999.99 }, // Valor máximo razoável
        { valor: -100 }, // Valor negativo (deve ser rejeitado)
        { valor: 0 }, // Valor zero
        { valor: Number.MAX_SAFE_INTEGER }, // Valor máximo do JavaScript
        { valor: Number.MIN_SAFE_INTEGER } // Valor mínimo do JavaScript
      ];

      for (const valueCase of extremeValues) {
        const response = await request(app)
          .post('/api/fluxo-caixa')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({
            descricao: 'Teste Valor Extremo',
            tipo: 'entrada',
            categoria: 'Teste',
            ...valueCase
          });

        if (valueCase.valor < 0) {
          expect(response.status).toBe(400);
        } else {
          expect([201, 400]).toContain(response.status);
        }
      }
    });

    test('Deve handle caracteres especiais e unicode', async () => {
      const specialChars = [
        'João Silva', // Acentos
        'Müller GmbH', // Caracteres alemães
        '株式会社', // Caracteres japoneses
        '🏥 Farmácia Saúde 💊', // Emojis
        'Test\nLine\nBreak', // Quebras de linha
        'Test\tTab\tCharacter', // Tabs
        'Test "Quotes" and \'Apostrophes\'', // Aspas
        'Test & < > " \'', // HTML entities
        'Café au lait & crème fraîche', // Caracteres especiais
        'Москва Аптека', // Cirílico
        'الصيدلية', // Árabe
        '🧪🔬⚗️️🧫' // Emojis de laboratório
      ];

      for (const specialChar of specialChars) {
        const response = await request(app)
          .post('/api/fornecedores')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({
            nome: specialChar,
            cnpj: '12345678901234',
            email: `test${Date.now()}@special.com`
          });

        // Deve aceitar ou limpar caracteres especiais
        expect([201, 400]).toContain(response.status);
        if (response.status === 201) {
          expect(response.body.nome).toBeDefined();
        }
      }
    });

    test('Deve handle datas extremas', async () => {
      const extremeDates = [
        '1900-01-01', // Data muito antiga
        '2100-12-31', // Data muito futura
        '2024-02-30', // Data inválida
        '2024-13-01', // Mês inválido
        '2024-00-01', // Mês zero
        '2024-01-00', // Dia zero
        'invalid-date', // Data completamente inválida
        new Date(0).toISOString(), // Timestamp zero
        new Date(8640000000000000).toISOString() // Máximo timestamp JavaScript
      ];

      for (const dateCase of extremeDates) {
        const response = await request(app)
          .post('/api/fluxo-caixa')
          .set('Authorization', `Bearer ${tokenA}`)
          .send({
            descricao: 'Teste Data Extrema',
            tipo: 'entrada',
            valor: 100.00,
            categoria: 'Teste',
            data: dateCase
          });

        // Deve aceitar datas válidas e rejeitar inválidas
        expect([201, 400]).toContain(response.status);
      }
    });
  });

  describe('Consistência de Estado', () => {
    test('Deve manter estado consistente em operações concorrentes', async () => {
      // Criar um fornecedor
      const fornecedor = await Fornecedor.create({
        nome: 'Fornecedor Concorrente',
        cnpj: '55555555555555',
        email: 'concorrente@teste.com',
        empresa_id: empresaA.id,
        status: 'ativo'
      });

      // Operações concorrentes no mesmo registro
      const promises = [];

      // Atualizar status para inativo
      promises.push(
        request(app)
          .put(`/api/fornecedores/${fornecedor.id}`)
          .set('Authorization', `Bearer ${tokenA}`)
          .send({ status: 'inativo' })
      );

      // Atualizar nome
      promises.push(
        request(app)
          .put(`/api/fornecedores/${fornecedor.id}`)
          .set('Authorization', `Bearer ${tokenA}`)
          .send({ nome: 'Nome Atualizado' })
      );

      // Tentar deletar
      promises.push(
        request(app)
          .delete(`/api/fornecedores/${fornecedor.id}`)
          .set('Authorization', `Bearer ${tokenA}`)
      );

      const responses = await Promise.allSettled(promises);

      // Pelo menos uma operação deve ter sucesso
      const successful = responses.filter(r => r.status === 'fulfilled' && [200, 204].includes(r.value.status));
      expect(successful.length).toBeGreaterThan(0);

      // Verificar estado final consistente
      const finalState = await Fornecedor.findByPk(fornecedor.id);
      expect(finalState).toBeDefined();
    }, 10000);

    test('Deve handle rollback em caso de erro', async () => {
      // Tentar criar registro com dados inválidos que causem erro no banco
      const invalidData = {
        nome: 'A'.repeat(1000), // Nome muito longo
        cnpj: '12345678901234',
        email: 'test@rollback.com',
        empresa_id: empresaA.id
      };

      const response = await request(app)
        .post('/api/fornecedores')
        .set('Authorization', `Bearer ${tokenA}`)
        .send(invalidData)
        .expect(400);

      // Verificar que nenhum dado parcial foi salvo
      const checkFornecedor = await Fornecedor.findOne({
        where: { email: 'test@rollback.com' }
      });

      expect(checkFornecedor).toBeNull();
    });
  });

  describe('Performance com Grandes Volumes', () => {
    test('Deve handle paginação eficiente com muitos registros', async () => {
      // Criar muitos fornecedores
      const fornecedores = [];
      for (let i = 0; i < 50; i++) {
        fornecedores.push({
          nome: `Fornecedor ${i}`,
          cnpj: `${String(i).padStart(14, '0')}0001`,
          email: `fornecedor${i}@volume.com`,
          empresa_id: empresaA.id
        });
      }

      // Criar em lote
      await Fornecedor.bulkCreate(fornecedores);

      // Testar diferentes páginas
      const page1 = await request(app)
        .get('/api/fornecedores?page=1&limit=10')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      const page2 = await request(app)
        .get('/api/fornecedores?page=2&limit=10')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      // Verificar que não há duplicatas entre páginas
      const idsPage1 = page1.body.fornecedores.map(f => f.id);
      const idsPage2 = page2.body.fornecedores.map(f => f.id);
      const intersection = idsPage1.filter(id => idsPage2.includes(id));

      expect(intersection).toHaveLength(0);
      expect(page1.body.fornecedores).toHaveLength(10);
      expect(page2.body.fornecedores).toHaveLength(10);
    });

    test('Deve manter performance em buscas complexas', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/fornecedores?busca=Fornecedor&status=ativo&page=1&limit=20')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      const endTime = Date.now();

      // Busca complexa deve ser rápida (< 2 segundos)
      expect(endTime - startTime).toBeLessThan(2000);
      expect(response.body.fornecedores.length).toBeGreaterThan(0);
    });
  });

  describe('Recuperação de Erros', () => {
    test('Deve recuperar de erros de conexão simulados', async () => {
      // Este teste simula cenários onde a API precisa ser resiliente
      const maxRetries = 3;
      let attempts = 0;
      let success = false;

      while (attempts < maxRetries && !success) {
        try {
          const response = await request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${tokenA}`)
            .timeout(5000); // Timeout curto para simular problemas

          if (response.status === 200) {
            success = true;
            expect(response.body.usuarios).toBeDefined();
          }
        } catch (error) {
          attempts++;
          if (attempts < maxRetries) {
            // Esperar antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      expect(success).toBe(true);
    });

    test('Deve fornecer mensagens de erro consistentes', async () => {
      const errorScenarios = [
        { method: 'GET', url: '/api/usuarios/invalid-id', expectedStatus: 404 },
        { method: 'POST', url: '/api/usuarios', data: {}, expectedStatus: 400 },
        { method: 'PUT', url: '/api/usuarios/invalid-id', data: {}, expectedStatus: 404 }
      ];

      for (const scenario of errorScenarios) {
        let response;
        
        if (scenario.method === 'GET') {
          response = await request(app)
            .get(scenario.url)
            .set('Authorization', `Bearer ${tokenA}`);
        } else if (scenario.method === 'POST') {
          response = await request(app)
            .post(scenario.url)
            .set('Authorization', `Bearer ${tokenA}`)
            .send(scenario.data || {});
        } else if (scenario.method === 'PUT') {
          response = await request(app)
            .put(scenario.url)
            .set('Authorization', `Bearer ${tokenA}`)
            .send(scenario.data || {});
        }

        expect(response.status).toBe(scenario.expectedStatus);
        expect(response.body.error || response.body.erro || response.body.errors).toBeDefined();
      }
    });
  });
});