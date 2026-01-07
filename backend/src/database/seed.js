require('dotenv').config();
const { sequelize } = require('../config/database');
const { Empresa, Usuario, Produto, Estoque } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Sincronizar banco
    await sequelize.sync({ force: true });
    console.log('✅ Banco sincronizado');

    // ========================================
    // CRIAR EMPRESA PADRÃO
    // ========================================
    
    const empresaPadrao = await Empresa.create({
      razao_social: 'Farmácia Teste Desenvolvimento Ltda',
      nome_fantasia: 'Farmácia Teste',
      cnpj: '00.000.000/0001-00',
      inscricao_estadual: '000.000.000.000',
      telefone: '(11) 0000-0000',
      email: 'contato@farmaciateste.local',
      endereco: {
        rua: 'Rua de Teste',
        numero: '123',
        bairro: 'Bairro Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '00000-000'
      },
      plano: 'basico',
      ativo: true
    });
    console.log('✅ Empresa de teste criada');

    // ========================================
    // CRIAR USUÁRIOS
    // ========================================
    
    const admin = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'Administrador',
      email: 'admin@pharma.com',
      senha: '123456',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      cargo: 'Administrador',
      role: 'admin'
    });
    console.log('✅ Usuário admin criado');

    const gerente = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'João Silva',
      email: 'gerente@pharma.com',
      senha: '123456',
      cpf: '987.654.321-00',
      telefone: '(11) 91234-5678',
      cargo: 'Gerente',
      role: 'gerente'
    });
    console.log('✅ Usuário gerente criado');

    const funcionario = await Usuario.create({
      empresa_id: empresaPadrao.id,
      nome: 'Maria Santos',
      email: 'funcionario@pharma.com',
      senha: '123456',
      telefone: '(11) 95555-4444',
      cargo: 'Atendente',
      role: 'funcionario'
    });
    console.log('✅ Usuário funcionário criado');

    // ========================================
    // CRIAR PRODUTOS
    // ========================================
    
    const produtos = [
      {
        empresa_id: empresaPadrao.id,
        codigo_barras: '7891234567890',
        nome: 'Dipirona 500mg',
        descricao: 'Analgésico e antitérmico',
        categoria: 'Medicamento',
        subcategoria: 'Analgésico',
        fabricante: 'EMS',
        principio_ativo: 'Dipirona Sódica',
        apresentacao: 'Comprimido',
        dosagem: '500mg',
        preco_custo: 5.50,
        preco_venda: 12.90,
        margem_lucro: 134.55,
        requer_receita: false,
        controlado: false,
        generico: true
      },
      {
        empresa_id: empresaPadrao.id,
        codigo_barras: '7891234567891',
        nome: 'Paracetamol 750mg',
        descricao: 'Analgésico e antitérmico',
        categoria: 'Medicamento',
        subcategoria: 'Analgésico',
        fabricante: 'Medley',
        principio_ativo: 'Paracetamol',
        apresentacao: 'Comprimido',
        dosagem: '750mg',
        preco_custo: 8.00,
        preco_venda: 18.50,
        margem_lucro: 131.25,
        requer_receita: false,
        controlado: false,
        generico: true
      },
      {
        empresa_id: empresaPadrao.id,
        codigo_barras: '7891234567892',
        nome: 'Amoxicilina 500mg',
        descricao: 'Antibiótico',
        categoria: 'Medicamento',
        subcategoria: 'Antibiótico',
        fabricante: 'Neo Química',
        principio_ativo: 'Amoxicilina',
        apresentacao: 'Cápsula',
        dosagem: '500mg',
        preco_custo: 15.00,
        preco_venda: 35.00,
        margem_lucro: 133.33,
        requer_receita: true,
        controlado: false,
        generico: true
      }
    ];

    for (const produtoData of produtos) {
      const produto = await Produto.create(produtoData);
      
      await Estoque.create({
        empresa_id: empresaPadrao.id,
        produto_id: produto.id,
        quantidade_atual: Math.floor(Math.random() * 100) + 20,
        quantidade_minima: 10,
        quantidade_maxima: 200,
        lote: `LOTE${Math.floor(Math.random() * 10000)}`,
        data_fabricacao: new Date('2024-01-01'),
        data_validade: new Date('2026-12-31'),
        localizacao: `Prateleira ${Math.floor(Math.random() * 10) + 1}`
      });
    }
    console.log('✅ Produtos e estoque criados');

    console.log('');
    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📝 Credenciais de acesso:');
    console.log('');
    console.log('Admin:');
    console.log('  Email: admin@pharma.com');
    console.log('  Senha: 123456');
    console.log('');
    console.log('Gerente:');
    console.log('  Email: gerente@pharma.com');
    console.log('  Senha: 123456');
    console.log('');
    console.log('Funcionário:');
    console.log('  Email: funcionario@pharma.com');
    console.log('  Senha: 123456');
    console.log('');
    console.log('💡 Sistema multi-tenant ativo!');
    console.log('   Você pode cadastrar novas empresas via API');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seed();
