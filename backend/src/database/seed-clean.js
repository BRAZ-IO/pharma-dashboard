require('dotenv').config();
const { sequelize } = require('../config/database');
const { Empresa, Usuario } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Iniciando seed limpo do banco de dados...');

    // Sincronizar banco (force: true apaga tudo e recria)
    await sequelize.sync({ force: true });
    console.log('✅ Banco sincronizado e limpo');

    // ========================================
    // CRIAR EMPRESA PADRÃO (apenas uma para testes)
    // ========================================
    
    const empresaPadrao = await Empresa.create({
      razao_social: 'Farmácia Demo Ltda',
      nome_fantasia: 'Farmácia Demo',
      cnpj: '00.000.000/0001-00',
      inscricao_estadual: '000.000.000.000',
      telefone: '(11) 0000-0000',
      email: 'contato@farmaciademo.local',
      endereco: {
        rua: 'Rua Demo',
        numero: '123',
        bairro: 'Bairro Demo',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '00000-000'
      },
      plano: 'basico',
      ativo: true
    });
    console.log('✅ Empresa demo criada');

    // ========================================
    // CRIAR USUÁRIO ADMINISTRADOR (apenas um)
    // ========================================
    
    const admin = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'Administrador Demo',
      email: 'admin@demo.com',
      senha: '123456',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      cargo: 'Administrador',
      role: 'admin',
      ativo: true
    });
    console.log('✅ Usuário administrador criado');

    // ========================================
    // CRIAR USUÁRIO GERENTE (apenas um)
    // ========================================
    
    const gerente = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'Gerente Demo',
      email: 'gerente@demo.com',
      senha: '123456',
      cpf: '234.567.890-11',
      telefone: '(11) 97654-3210',
      cargo: 'Gerente',
      role: 'gerente',
      ativo: true
    });
    console.log('✅ Usuário gerente criado');

    // ========================================
    // CRIAR USUÁRIO FUNCIONÁRIO (apenas um)
    // ========================================
    
    const funcionario = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'Funcionário Demo',
      email: 'funcionario@demo.com',
      senha: '123456',
      cpf: '345.678.901-22',
      telefone: '(11) 96543-2109',
      cargo: 'Funcionário',
      role: 'funcionario',
      ativo: true
    });
    console.log('✅ Usuário funcionário criado');

    // ========================================
    // CRIAR EMPRESA DEMO 2 - Farmácia B (para teste de isolamento)
    // ========================================
    
    const empresaB = await Empresa.create({
      razao_social: 'Farmácia B Ltda',
      nome_fantasia: 'Farmácia B',
      cnpj: '12.345.678/0001-90',
      inscricao_estadual: '987654321',
      telefone: '(21) 98765-4321',
      email: 'contato@farmaciab.com.br',
      endereco: 'Rua das Flores, 200, Botafogo, Rio de Janeiro - RJ',
      configuracoes: {
        tema: 'dark',
        idioma: 'pt-BR',
        moeda: 'BRL',
        timezone: 'America/Sao_Paulo'
      },
      plano: 'premium',
      ativo: true
    });
    console.log('✅ Empresa Farmácia B criada');

    // ========================================
    // CRIAR USUÁRIOS DA FARMÁCIA B
    // ========================================
    
    const adminB = await Usuario.create({
      empresa_id: empresaB.id,
      nome: 'Admin Farmácia B',
      email: 'admin@farmaciab.com',
      senha: '123456',
      cpf: '111.222.333-44',
      telefone: '(21) 91111-1111',
      cargo: 'Administrador',
      role: 'admin',
      ativo: true
    });
    console.log('✅ Admin Farmácia B criado');

    const gerenteB = await Usuario.create({
      empresa_id: empresaB.id,
      nome: 'Gerente Farmácia B',
      email: 'gerente@farmaciab.com',
      senha: '123456',
      cpf: '222.333.444-55',
      telefone: '(21) 92222-2222',
      cargo: 'Gerente',
      role: 'gerente',
      ativo: true
    });
    console.log('✅ Gerente Farmácia B criado');

    // ========================================
    // CRIAR USUÁRIO DEMO (principal) - Farmácia A
    // ========================================
    
    const usuarioDemo = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'Usuario Demo',
      email: 'usuario@demo.com',
      senha: '123456',
      cpf: '456.789.012-33',
      telefone: '(11) 95432-1098',
      cargo: 'Administrador',
      role: 'admin',
      ativo: true
    });
    console.log('✅ Usuário demo criado');

    console.log('');
    console.log('🎉 Seed limpo concluído com sucesso!');
    console.log('');
    console.log('📋 Credenciais de acesso:');
    console.log('');
    console.log('🏢 FARMÁCIA A (Demo):');
    console.log('   Usuario Demo: usuario@demo.com / 123456 (ADMIN)');
    console.log('   Admin: admin@demo.com / 123456');
    console.log('   Gerente: gerente@demo.com / 123456');
    console.log('   Funcionário: funcionario@demo.com / 123456');
    console.log('');
    console.log('🏢 FARMÁCIA B (Teste Isolamento):');
    console.log('   Admin: admin@farmaciab.com / 123456');
    console.log('   Gerente: gerente@farmaciab.com / 123456');
    console.log('');
    console.log('🔒 TESTE DE ISOLAMENTO:');
    console.log('   - Usuários da Farmácia A só veem dados da Farmácia A');
    console.log('   - Usuários da Farmácia B só veem dados da Farmácia B');
    console.log('   - Não é possível acessar dados de outra empresa');
    console.log('');
    console.log('💡 O banco está limpo. Use a interface para criar produtos, clientes, etc.');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    // Fechar conexão
    await sequelize.close();
    console.log('🔌 Conexão com banco fechada');
  }
};

// Executar seed
if (require.main === module) {
  seed();
}

module.exports = seed;
