const request = require('supertest');
const app = require('../src/server');

describe('Registro de Farmácia C', () => {
  it('Deve registrar nova farmácia com email viniciusbatistabraz@gmail.com', async () => {
    const dadosFarmacia = {
      // Dados da Empresa
      nomeEmpresa: 'Farmácia C Soluções Farmacêuticas',
      cnpj: '55.666.777/0001-33',
      razaoSocial: 'Farmácia C Soluções Farmacêuticas Ltda',
      telefone: '(11) 98765-4321',
      email: 'viniciusbatistabraz@gmail.com',
      endereco: 'Rua das Farmácias, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      
      // Dados do Administrador
      nomeAdmin: 'Vinicius Batista Braz',
      emailAdmin: 'viniciusbatistabraz@gmail.com',
      telefoneAdmin: '(11) 98765-4321',
      cpfAdmin: '123.456.789-00',
      senha: 'farmaciac123',
      confirmarSenha: 'farmaciac123',
      
      // Plano
      plano: 'basico',
      
      // Termos
      aceitarTermos: true
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(dadosFarmacia)
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');
    expect(response.body.usuario.email).toBe('viniciusbatistabraz@gmail.com');
    expect(response.body.usuario.empresa.nome_fantasia).toBe('Farmácia C Soluções Farmacêuticas');
    expect(response.body.usuario.role).toBe('admin');

    console.log('✅ Farmácia C registrada com sucesso!');
    console.log(`📧 Email: ${response.body.usuario.email}`);
    console.log(`🏢 Empresa: ${response.body.usuario.empresa.nome_fantasia}`);
    console.log(`🆔 ID Usuário: ${response.body.usuario.id}`);
    console.log(`🆔 ID Empresa: ${response.body.usuario.empresa.id}`);
  });

  it('Deve fazer login com a farmácia recém-criada', async () => {
    const loginData = {
      email: 'viniciusbatistabraz@gmail.com',
      senha: 'farmaciac123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.usuario.email).toBe('viniciusbatistabraz@gmail.com');
    expect(response.body.usuario.empresa.nome_fantasia).toBe('Farmácia C Soluções Farmacêuticas');

    console.log('✅ Login realizado com sucesso!');
    console.log(`🔑 Token: ${response.body.token.substring(0, 50)}...`);
  });

  it('Deve recuperar senha da Farmácia C', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'viniciusbatistabraz@gmail.com' })
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');

    console.log('✅ Email de recuperação enviado!');
    console.log(`📧 Mensagem: ${response.body.message}`);
  });
});

// Teste manual para execução direta
async function registrarFarmaciaC() {
  try {
    console.log('🚀 Iniciando registro da Farmácia C...');
    
    const dadosFarmacia = {
      nomeEmpresa: 'Farmácia C Soluções Farmacêuticas',
      cnpj: '55.666.777/0001-33',
      razaoSocial: 'Farmácia C Soluções Farmacêuticas Ltda',
      telefone: '11987654321',
      email: 'viniciusbatistabraz@gmail.com',
      endereco: 'Rua das Farmácias, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234567',
      nomeAdmin: 'Vinicius Batista Braz',
      emailAdmin: 'viniciusbatistabraz@gmail.com',
      telefoneAdmin: '11987654321',
      cpfAdmin: '12345678900',
      senha: 'farmaciac123',
      confirmarSenha: 'farmaciac123',
      plano: 'basico',
      aceitarTermos: true
    };

    // Fazer requisição para o backend
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosFarmacia)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Farmácia C registrada com sucesso!');
      console.log(`📧 Email: ${result.usuario.email}`);
      console.log(`🏢 Empresa: ${result.usuario.empresa.nome_fantasia}`);
      console.log(`🔑 Use: viniciusbatistabraz@gmail.com / farmaciac123`);
    } else {
      console.error('❌ Erro no registro:', result);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Exportar para uso manual
module.exports = { registrarFarmaciaC };

// Executar se chamado diretamente
if (require.main === module) {
  registrarFarmaciaC();
}
