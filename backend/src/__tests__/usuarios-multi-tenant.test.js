const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Empresa, Usuario } = require('../models');

describe('Usuarios - Isolamento Multi-Tenant', () => {
  let empresaA, empresaB;
  let usuarioA, usuarioB, usuarioExtraA, usuarioExtraB;
  let tokenA, tokenB;

  beforeAll(async () => {
    // Sincronizar banco de dados
    await sequelize.sync({ force: true });

    // Criar empresas
    empresaA = await Empresa.create({
      razao_social: 'Farmacia A LTDA',
      nome_fantasia: 'Farmacia A',
      cnpj: '11222333000181',
      email: 'contato@farmaciaa.com',
      telefone: '11999999999'
    });

    empresaB = await Empresa.create({
      razao_social: 'Farmacia B LTDA',
      nome_fantasia: 'Farmacia B',
      cnpj: '22333444000182',
      email: 'contato@farmaciab.com',
      telefone: '11888888888'
    });

    // Criar usuários para cada empresa
    const senhaHash = await bcrypt.hash('123456', 10);

    usuarioA = await Usuario.create({
      nome: 'Gerente A',
      email: 'gerente@farmaciaa.com',
      senha: senhaHash,
      empresa_id: empresaA.id,
      role: 'gerente'
    });

    usuarioB = await Usuario.create({
      nome: 'Gerente B',
      email: 'gerente@farmaciab.com',
      senha: senhaHash,
      empresa_id: empresaB.id,
      role: 'gerente'
    });

    // Criar usuários adicionais para teste
    usuarioExtraA = await Usuario.create({
      nome: 'Funcionario A',
      email: 'funcionario@farmaciaa.com',
      senha: senhaHash,
      empresa_id: empresaA.id,
      role: 'funcionario'
    });

    usuarioExtraB = await Usuario.create({
      nome: 'Funcionario B',
      email: 'funcionario@farmaciab.com',
      senha: senhaHash,
      empresa_id: empresaB.id,
      role: 'funcionario'
    });

    // Criar tokens
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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Isolamento Multi-Tenant', () => {
    test('Usuário A deve acessar apenas seus usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.usuarios).toHaveLength(2);
      expect(response.body.usuarios.map(u => u.nome)).toContain('Gerente A');
      expect(response.body.usuarios.map(u => u.nome)).toContain('Funcionario A');
      expect(response.body.usuarios.every(u => u.empresa_id === empresaA.id)).toBe(true);
    });

    test('Usuário B deve acessar apenas seus usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(response.body.usuarios).toHaveLength(2);
      expect(response.body.usuarios.map(u => u.nome)).toContain('Gerente B');
      expect(response.body.usuarios.map(u => u.nome)).toContain('Funcionario B');
      expect(response.body.usuarios.every(u => u.empresa_id === empresaB.id)).toBe(true);
    });

    test('Usuário A não deve acessar usuário da Empresa B', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${usuarioB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);

      expect(response.body.error).toBe('Usuário não encontrado');
    });

    test('Usuário B não deve acessar usuário da Empresa A', async () => {
      const response = await request(app)
        .get(`/api/usuarios/${usuarioA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(404);

      expect(response.body.error).toBe('Usuário não encontrado');
    });

    test('Usuário A não deve atualizar usuário da Empresa B', async () => {
      const response = await request(app)
        .put(`/api/usuarios/${usuarioB.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ nome: 'Nome Alterado' })
        .expect(404);

      expect(response.body.error).toBe('Usuário não encontrado');
    });

    test('Usuário A não deve desativar usuário da Empresa B', async () => {
      // Usar PATCH status em vez de DELETE (requer apenas gerente)
      const response = await request(app)
        .patch(`/api/usuarios/${usuarioB.id}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ ativo: false })
        .expect(404);

      expect(response.body.error).toBe('Usuário não encontrado');
    });

    test('Usuário A não deve alterar status de usuário da Empresa B', async () => {
      const response = await request(app)
        .patch(`/api/usuarios/${usuarioB.id}/status`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ ativo: false })
        .expect(404);

      expect(response.body.error).toBe('Usuário não encontrado');
    });
  });

  describe('Cross-tenant Data Leakage Tests', () => {
    test('Busca não deve retornar dados de outras empresas', async () => {
      const response = await request(app)
        .get('/api/usuarios?search=Gerente')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.usuarios).toHaveLength(1);
      expect(response.body.usuarios[0].nome).toBe('Gerente A');
      expect(response.body.usuarios[0].empresa_id).toBe(empresaA.id);
    });

    test('Filtro por role deve ser isolado por empresa', async () => {
      const response = await request(app)
        .get('/api/usuarios?role=funcionario')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(response.body.usuarios).toHaveLength(1);
      expect(response.body.usuarios[0].nome).toBe('Funcionario A');
      expect(response.body.usuarios[0].empresa_id).toBe(empresaA.id);
    });
  });

  describe('Security Boundary Tests', () => {
    test('Token inválido não deve acessar dados', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });

    test('Sem token não deve acessar dados', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .expect(401);
    });
  });
});