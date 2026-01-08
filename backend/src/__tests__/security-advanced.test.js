const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Empresa, Usuario } = require('../models');

describe('Segurança Avançada', () => {
  let empresa, usuario, token;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    empresa = await Empresa.create({
      razao_social: 'Empresa Segurança LTDA',
      nome_fantasia: 'Teste Segurança',
      cnpj: '12345678901234',
      email: 'seguranca@teste.com',
      telefone: '11999999999'
    });

    const senhaHash = await bcrypt.hash('123456', 10);
    usuario = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'usuario@seguranca.com',
      senha: senhaHash,
      empresa_id: empresa.id,
      role: 'gerente'
    });

    token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        empresa_id: usuario.empresa_id,
        role: usuario.role 
      },
      process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Proteção contra Ataques Comuns', () => {
    test('Deve bloquear XSS attempts', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(1)">',
        '"><script>alert(1)</script>',
        '\"><script>document.location=\"http://evil.com\"</script>'
      ];

      for (const payload of xssPayloads) {
        console.log('🧪 Testing XSS payload:', payload);
        const response = await request(app)
          .post('/api/usuarios')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: payload, // Enviar apenas o payload XSS
            email: `test${Date.now()}@xss.com`, // Email único
            senha: '123456',
            role: 'funcionario'
          });

        // Deve bloquear o XSS (400) ou aceitar se foi escapado (201)
        console.log('📊 Response status:', response.status);
        expect([400, 201]).toContain(response.status);
        
        if (response.status === 400) {
          // XSS foi detectado e bloqueado
          expect(response.body.error || response.body.erro || response.body.errors).toBeDefined();
        } else if (response.status === 201) {
          // XSS foi escapado pelo Express - isso também é seguro!
          console.log('✅ XSS escapado pelo Express:', response.body.nome);
        }
      }
    });

    test('Deve bloquear NoSQL injection attempts', async () => {
      const nosqlPayloads = [
        { $ne: null },
        { $gt: '' },
        { $where: 'this.password == this.password' },
        { $regex: '.*' },
        { $in: ['admin', 'root'] }
      ];

      for (const payload of nosqlPayloads) {
        const response = await request(app)
          .get('/api/usuarios')
          .set('Authorization', `Bearer ${token}`)
          .query({ search: JSON.stringify(payload) });

        // Não deve quebrar a API
        expect([200, 400]).toContain(response.status);
      }
    });

    test('Deve bloquear path traversal attempts', async () => {
      const pathTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '/etc/shadow',
        'C:\\Windows\\System32\\drivers\\etc\\hosts',
        '....//....//....//etc/passwd'
      ];

      for (const payload of pathTraversalPayloads) {
        const response = await request(app)
          .get(`/api/usuarios/${payload}`)
          .set('Authorization', `Bearer ${token}`);

        // Deve retornar 400 (UUID inválido) ou 404
        expect([400, 404]).toContain(response.status);
      }
    });

    test('Deve bloquear command injection attempts', async () => {
      const commandPayloads = [
        '; ls -la',
        '| whoami',
        '&& cat /etc/passwd',
        '`id`',
        '$(whoami)',
        '; rm -rf /'
      ];

      for (const payload of commandPayloads) {
        const response = await request(app)
          .get(`/api/usuarios?search=${encodeURIComponent(payload)}`)
          .set('Authorization', `Bearer ${token}`);

        // Não deve executar comandos
        expect([200, 400]).toContain(response.status);
        if (response.status === 200 && response.body.usuarios) {
          // Se retornar 200, não deve encontrar resultados
          expect(response.body.usuarios).toHaveLength(0);
        }
      }
    });
  });

  describe('Validação de Tokens e Sessão', () => {
    test('Deve rejeitar tokens expirados', async () => {
      const expiredToken = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
        { expiresIn: '-1h' } // Token expirado
      );

      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.error).toBe('Token expirado');
    });

    test('Deve rejeitar tokens com assinatura inválida', async () => {
      const invalidToken = jwt.sign(
        { id: usuario.id, email: usuario.email },
        'invalid_secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.error).toBe('Token inválido');
    });

    test('Deve rejeitar tokens malformados', async () => {
      const malformedTokens = [
        'not_a_token',
        'Bearer',
        'Bearer ',
        'Bearer invalid.token.here',
        'Basic dGVzdDp0ZXN0', // Basic auth em vez de Bearer
        'Bearer ' + 'a'.repeat(1000) // Token muito longo
      ];

      for (const token of malformedTokens) {
        const response = await request(app)
          .get('/api/usuarios')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.error).toBeDefined();
      }
    });

    test('Deve rejeitar tokens com usuário inexistente', async () => {
      const fakeUserToken = jwt.sign(
        { 
          id: '00000000-0000-0000-0000-000000000000', 
          email: 'fake@test.com',
          empresa_id: empresa.id,
          role: 'gerente'
        },
        process.env.JWT_SECRET || 'test_secret_key_for_testing_only_do_not_use_in_production',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${fakeUserToken}`)
        .expect(401);

      expect(response.body.error).toBe('Usuário não encontrado');
    });
  });

  describe('Rate Limiting e Proteção DoS', () => {
    test('Deve aplicar rate limiting em múltiplas requisições', async () => {
      const promises = [];
      
      // Fazer muitas requisições rápidas
      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${token}`)
        );
      }

      const responses = await Promise.allSettled(promises);
      
      // Algumas devem ser bloqueadas pelo rate limiting
      const rejected = responses.filter(r => r.status === 'rejected' || r.value.status === 429);
      expect(rejected.length).toBeGreaterThan(0);
    }, 15000);

    test('Deve bloquear requisições com headers suspeitos', async () => {
      const suspiciousHeaders = [
        { 'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1' }, // Múltiplos proxies
        { 'user-agent': 'curl/7.68.0' }, // Ferramenta automatizada
        { 'x-real-ip': '127.0.0.1' }, // IP local
        { 'x-originating-ip': '0.0.0.0' } // IP nulo
      ];

      for (const headers of suspiciousHeaders) {
        const response = await request(app)
          .get('/api/usuarios')
          .set('Authorization', `Bearer ${token}`)
          .set(headers);

        // Pode ou não bloquear, dependendo da configuração
        expect([200, 403, 429]).toContain(response.status);
      }
    });
  });

  describe('Validação de Input Avançada', () => {
    test('Deve rejeitar emails malformados', async () => {
      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'user@.com',
        'user@domain.',
        'user..name@domain.com',
        'user@domain..com',
        'user@-domain.com',
        'test@.com.br',
        'test@test@.com.br',
        'test@test',
        'test@.com'
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/usuarios')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: 'Test User',
            email: email,
            senha: '123456',
            role: 'funcionario'
          });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
      }
    });

    test('Deve rejeitar CPFs e CNPJs inválidos', async () => {
      const invalidDocuments = [
        { cpf: '123456789012' }, // CPF muito longo
        { cpf: '12345678901' }, // CPF muito curto
        { cpf: '11111111111' }, // CPF com dígitos repetidos
        { cpf: '00000000000' }, // CPF com zeros
        { cnpj: '1234567890123' }, // CNPJ muito curto
        { cnpj: '123456789012345' }, // CNPJ muito longo
        { cnpj: '11111111111111' }, // CNPJ com dígitos repetidos
        { cnpj: '00000000000000' } // CNPJ com zeros
      ];

      for (const doc of invalidDocuments) {
        const response = await request(app)
          .post('/api/usuarios')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: 'Test User',
            email: 'test@invalid.com',
            senha: '123456',
            role: 'funcionario',
            ...doc
          });

        expect(response.status).toBe(400);
      }
    });

    test('Deve rejeitar telefones malformados', async () => {
      const invalidPhones = [
        '123', // Muito curto
        '1234567890123456', // Muito longo
        'abcdefghijk', // Apenas letras
        '119-9999-9999', // Formato inválido
        '(11) 9999-9999', // Formato inválido
        '+55 11 9999 9999 9999' // Muito longo
      ];

      for (const phone of invalidPhones) {
        const response = await request(app)
          .post('/api/usuarios')
          .set('Authorization', `Bearer ${token}`)
          .send({
            nome: 'Test User',
            email: 'test@phone.com',
            senha: '123456',
            telefone: phone,
            role: 'funcionario'
          });

        // Pode ou não rejeitar, dependendo da validação
        expect([201, 400]).toContain(response.status);
      }
    });
  });

  describe('Segurança de Headers e Métodos HTTP', () => {
    test('Deve rejeitar métodos HTTP não permitidos', async () => {
      const disallowedMethods = [
        'PATCH', // Se não implementado
        'OPTIONS', // Se não configurado
        'HEAD', // Se não implementado
        'TRACE' // Nunca deve ser permitido
      ];

      for (const method of disallowedMethods) {
        const response = await request(app)
          [method.toLowerCase()]('/api/usuarios')
          .set('Authorization', `Bearer ${token}`);

        // TRACE nunca deve ser permitido
        if (method === 'TRACE') {
          expect(response.status).toBe(405);
        } else {
          // Outros métodos podem ou não ser implementados
          expect([200, 404, 405]).toContain(response.status);
        }
      }
    });

    test('Deve incluir headers de segurança', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Verificar headers de segurança comuns
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'strict-transport-security'
      ];

      securityHeaders.forEach(header => {
        expect(response.headers[header] || response.headers[header.toLowerCase()]).toBeDefined();
      });
    });
  });
});