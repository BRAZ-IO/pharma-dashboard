const request = require('supertest');
const app = require('../src/server');

describe('Teste de Permissões de Acesso', () => {
  let adminToken, gerenteToken, funcionarioToken;
  let adminUser, gerenteUser, funcionarioUser;

  beforeAll(async () => {
    // Login como Admin
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@pharma.com', senha: '123456' });
    
    adminToken = adminLogin.body.token;
    adminUser = adminLogin.body.usuario;

    // Login como Gerente
    const gerenteLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'gerente@pharma.com', senha: '123456' });
    
    gerenteToken = gerenteLogin.body.token;
    gerenteUser = gerenteLogin.body.usuario;

    // Login como Funcionário
    const funcionarioLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'viniciusbatistabraz@gmail.com', senha: 'farmaciac123' });
    
    funcionarioToken = funcionarioLogin.body.token;
    funcionarioUser = funcionarioLogin.body.usuario;
  });

  describe('Acesso ao Dashboard', () => {
    it('Admin deve acessar dashboard', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('stats');
    });

    it('Gerente deve acessar dashboard', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('stats');
    });

    it('Funcionário deve acessar dashboard', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('stats');
    });
  });

  describe('Acesso à Gestão de Usuários', () => {
    it('Admin pode ver lista de usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Gerente pode ver lista de usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Funcionário NÃO pode ver lista de usuários', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .expect(403);
      
      expect(response.body.error).toBe('Acesso negado');
    });

    it('Admin pode criar usuário', async () => {
      const newUser = {
        nome: 'Teste User',
        email: 'teste@pharma.com',
        senha: '123456',
        empresa_id: adminUser.empresa_id,
        cargo: 'Testador',
        role: 'funcionario'
      };

      const response = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser)
        .expect(201);
      
      expect(response.body.nome).toBe('Teste User');
    });

    it('Gerente NÃO pode criar usuário', async () => {
      const newUser = {
        nome: 'Teste Gerente',
        email: 'teste2@pharma.com',
        senha: '123456',
        empresa_id: gerenteUser.empresa_id,
        cargo: 'Testador',
        role: 'funcionario'
      };

      const response = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .send(newUser)
        .expect(403);
      
      expect(response.body.error).toBe('Acesso negado');
    });

    it('Funcionário NÃO pode criar usuário', async () => {
      const newUser = {
        nome: 'Teste Func',
        email: 'teste3@pharma.com',
        senha: '123456',
        empresa_id: funcionarioUser.empresa_id,
        cargo: 'Testador',
        role: 'funcionario'
      };

      const response = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .send(newUser)
        .expect(403);
      
      expect(response.body.error).toBe('Acesso negado');
    });
  });

  describe('Acesso à Configurações', () => {
    it('Admin pode acessar configurações', async () => {
      const response = await request(app)
        .get('/api/configuracoes')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('Gerente NÃO pode acessar configurações', async () => {
      const response = await request(app)
        .get('/api/configuracoes')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .expect(403);
      
      expect(response.body.error).toBe('Acesso negado');
    });

    it('Funcionário NÃO pode acessar configurações', async () => {
      const response = await request(app)
        .get('/api/configuracoes')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .expect(403);
      
      expect(response.body.error).toBe('Acesso negado');
    });
  });

  describe('Acesso ao Fluxo de Caixa', () => {
    it('Admin pode acessar fluxo de caixa', async () => {
      const response = await request(app)
        .get('/api/fluxo-caixa')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('Gerente pode acessar fluxo de caixa', async () => {
      const response = await request(app)
        .get('/api/fluxo-caixa')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .expect(200);
    });

    it('Funcionário NÃO pode acessar fluxo de caixa', async () => {
      const response = await request(app)
        .get('/api/fluxo-caixa')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .expect(403);
      
      expect(response.body.error).toBe('Acesso negado');
    });
  });

  describe('Acesso ao PDV', () => {
    it('Admin pode usar PDV', async () => {
      const response = await request(app)
        .get('/api/pdv')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('Gerente pode usar PDV', async () => {
      const response = await request(app)
        .get('/api/pdv')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .expect(200);
    });

    it('Funcionário pode usar PDV', async () => {
      const response = await request(app)
        .get('/api/pdv')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .expect(200);
    });
  });

  describe('Acesso ao Estoque', () => {
    it('Admin pode ver estoque', async () => {
      const response = await request(app)
        .get('/api/estoque')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('Gerente pode ver estoque', async () => {
      const response = await request(app)
        .get('/api/estoque')
        .set('Authorization', `Bearer ${gerenteToken}`)
        .expect(200);
    });

    it('Funcionário pode ver estoque', async () => {
      const response = await request(app)
        .get('/api/estoque')
        .set('Authorization', `Bearer ${funcionarioToken}`)
        .expect(200);
    });
  });

  describe('Teste de Roles Frontend', () => {
    it('Admin deve ter role admin', () => {
      expect(adminUser.role).toBe('admin');
    });

    it('Gerente deve ter role gerente', () => {
      expect(gerenteUser.role).toBe('gerente');
    });

    it('Funcionário deve ter role funcionario', () => {
      expect(funcionarioUser.role).toBe('funcionario');
    });
  });
});

// Teste manual para execução direta
async function testarPermissoes() {
  console.log('🧪 Iniciando testes de permissões...');
  
  try {
    // Testar login com diferentes roles
    console.log('\n📋 Testando login com diferentes roles:');
    
    const roles = [
      { email: 'admin@pharma.com', senha: '123456', expectedRole: 'admin' },
      { email: 'gerente@pharma.com', senha: '123456', expectedRole: 'gerente' },
      { email: 'viniciusbatistabraz@gmail.com', senha: 'farmaciac123', expectedRole: 'funcionario' }
    ];

    for (const role of roles) {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: role.email, senha: role.senha })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${role.email}: Role = ${result.usuario.role} (esperado: ${role.expectedRole})`);
        
        // Testar permissões baseadas no role
        const permissions = {
          admin: ['configuracoes', 'usuarios', 'fluxo-caixa'],
          gerente: ['usuarios', 'fluxo-caixa'],
          funcionario: ['dashboard', 'pdv', 'estoque']
        };

        const userPermissions = permissions[result.usuario.role] || [];
        console.log(`🔐 Permissões: ${userPermissions.join(', ')}`);
      } else {
        console.log(`❌ ${role.email}: Falha no login`);
      }
    }

    console.log('\n🎯 Teste de permissões concluído!');
    console.log('\n📊 Resumo dos acessos:');
    console.log('🔴 Admin: Acesso total ao sistema');
    console.log('🟡 Gerente: Acesso a usuários e fluxo de caixa');
    console.log('🟢 Funcionário: Acesso a PDV e estoque');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

// Exportar para uso manual
module.exports = { testarPermissoes };

// Executar se chamado diretamente
if (require.main === module) {
  testarPermissoes();
}
