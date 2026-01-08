const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Empresa, Usuario, Fornecedor } = require('../models');

describe('Performance e Carga', () => {
  let empresa, usuarios = [], tokens = [];
  const NUM_USUARIOS = 50;
  const NUM_FORNECEDORES = 100;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Criar empresa
    empresa = await Empresa.create({
      razao_social: 'Empresa Teste Performance LTDA',
      nome_fantasia: 'Teste Performance',
      cnpj: '12345678901234',
      email: 'teste@performance.com',
      telefone: '11999999999'
    });

    // Criar múltiplos usuários
    const senhaHash = await bcrypt.hash('123456', 10);
    for (let i = 0; i < NUM_USUARIOS; i++) {
      const usuario = await Usuario.create({
        nome: `Usuário ${i}`,
        email: `usuario${i}@teste.com`,
        senha: senhaHash,
        empresa_id: empresa.id,
        role: i % 3 === 0 ? 'gerente' : 'funcionario'
      });

      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          empresa_id: usuario.empresa_id,
          role: usuario.role 
        },
        process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
        { expiresIn: '1h' }
      );

      usuarios.push(usuario);
      tokens.push(token);
    }

    // Criar múltiplos fornecedores com CNPJs válidos
    for (let i = 0; i < NUM_FORNECEDORES; i++) {
      // Gerar CNPJs válidos usando base + contador
      const cnpjBase = 11222333000100 + i;
      await Fornecedor.create({
        nome: `Fornecedor ${i}`,
        cnpj: cnpjBase.toString(),
        email: `fornecedor${i}@teste.com`,
        empresa_id: empresa.id,
        status: i % 5 === 0 ? 'inativo' : 'ativo'
      });
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Testes de Carga', () => {
    test('Deve suportar múltiplas requisições simultâneas', async () => {
      const promises = [];
      const startTime = Date.now();

      // Fazer 20 requisições simultâneas
      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app)
            .get('/api/fornecedores')
            .set('Authorization', `Bearer ${tokens[0]}`)
        );
      }

      const responses = await Promise.all(promises);
      const endTime = Date.now();

      // Todas devem ser bem-sucedidas
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.fornecedores).toBeDefined();
      });

      // Tempo de resposta deve ser razoável (< 5 segundos)
      expect(endTime - startTime).toBeLessThan(5000);
    }, 10000);

    test('Deve suportar paginação com grande volume de dados', async () => {
      const response = await request(app)
        .get('/api/fornecedores?page=1&limit=50')
        .set('Authorization', `Bearer ${tokens[0]}`)
        .expect(200);

      expect(response.body.fornecedores).toHaveLength(50);
      expect(response.body.pagination.total).toBe(NUM_FORNECEDORES);
      expect(response.body.pagination.totalPages).toBe(Math.ceil(NUM_FORNECEDORES / 50));
    });

    test('Deve manter performance em buscas com filtros', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/fornecedores?busca=Fornecedor&status=ativo')
        .set('Authorization', `Bearer ${tokens[0]}`)
        .expect(200);

      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(2000); // Busca deve ser rápida
      expect(response.body.fornecedores.length).toBeGreaterThan(0);
      expect(response.body.fornecedores.every(f => f.status === 'ativo')).toBe(true);
    });
  });

  describe('Testes de Concorrência', () => {
    test('Deve lidar com criações simultâneas sem conflitos', async () => {
      const promises = [];
      const startTime = Date.now();

      // Criar 10 fornecedores simultaneamente
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/fornecedores')
            .set('Authorization', `Bearer ${tokens[0]}`)
            .send({
              nome: `Fornecedor Concorrente ${i}`,
              cnpj: `${9999 + i}0000000001${i}`,
              email: `concorrente${i}@teste.com`
            })
        );
      }

      const responses = await Promise.all(promises);
      const endTime = Date.now();

      // Todas devem ser criadas com sucesso
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.nome).toBe(`Fornecedor Concorrente ${index}`);
      });

      expect(endTime - startTime).toBeLessThan(3000);
    }, 15000);

    test('Deve manter consistência em atualizações simultâneas', async () => {
      // Criar um fornecedor para teste
      const fornecedor = await Fornecedor.create({
        nome: 'Fornecedor Base',
        cnpj: '12345678901234',
        email: 'base@concorrente.com',
        empresa_id: empresa.id
      });

      const promises = [];
      
      // Atualizar o mesmo fornecedor simultaneamente
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .put(`/api/fornecedores/${fornecedor.id}`)
            .set('Authorization', `Bearer ${tokens[i]}`)
            .send({ nome: `Nome Atualizado ${i}` })
        );
      }

      const responses = await Promise.all(promises);
      
      // Pelo menos uma deve ter sucesso
      const successfulUpdates = responses.filter(r => r.status === 200);
      expect(successfulUpdates.length).toBeGreaterThan(0);
      
      // Verificar consistência final
      const finalFornecedor = await Fornecedor.findByPk(fornecedor.id);
      expect(finalFornecedor.nome).toMatch(/Nome Atualizado \d/);
    }, 10000);
  });

  describe('Testes de Limite', () => {
    test('Deve rejeitar payloads muito grandes', async () => {
      const largePayload = {
        nome: 'A'.repeat(10000), // Nome muito grande
        cnpj: '12345678901234',
        email: 'teste@grande.com',
        telefone: 'A'.repeat(1000)
      };

      const response = await request(app)
        .post('/api/fornecedores')
        .set('Authorization', `Bearer ${tokens[0]}`)
        .send(largePayload)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    test('Deve limitar número de resultados por página', async () => {
      const response = await request(app)
        .get('/api/fornecedores?limit=200') // Tentativa de limite muito alto
        .set('Authorization', `Bearer ${tokens[0]}`)
        .expect(200);

      // Deve aplicar o limite máximo do sistema (provavelmente 100)
      expect(response.body.fornecedores.length).toBeLessThanOrEqual(100);
    });

    test('Deve handle caracteres especiais corretamente', async () => {
      const specialChars = {
        nome: 'Fornecedor Êncïdìng Têsté 🏥💊',
        cnpj: '12345678901234',
        email: 'têsté+especial@café.com.br',
        contato: 'João Silva & Cia Ltda.'
      };

      const response = await request(app)
        .post('/api/fornecedores')
        .set('Authorization', `Bearer ${tokens[0]}`)
        .send(specialChars)
        .expect(201);

      expect(response.body.nome).toBe(specialChars.nome);
      expect(response.body.email).toBe(specialChars.email);
    });
  });
});