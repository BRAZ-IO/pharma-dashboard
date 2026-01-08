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
    console.log('✅ Produtos e estoque criados para Farmácia Teste');

    // ========================================
    // CRIAR SEGUNDA EMPRESA (TESTE MULTI-TENANT)
    // ========================================
    
    const empresaPopular = await Empresa.create({
      razao_social: 'Drogaria Popular Ltda',
      nome_fantasia: 'Drogaria Popular',
      cnpj: '11.111.111/0001-11',
      inscricao_estadual: '111.111.111.111',
      telefone: '(11) 1111-1111',
      email: 'contato@drogariapopular.com',
      endereco: {
        rua: 'Av. Principal',
        numero: '500',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000-000'
      },
      plano: 'premium',
      ativo: true
    });
    console.log('✅ Segunda empresa criada (Drogaria Popular)');

    // Usuários da Drogaria Popular
    const adminPopular = await Usuario.create({
      empresa_id: empresaPopular.id,
      nome: 'Carlos Souza',
      email: 'admin@popular.com',
      senha: '123456',
      cpf: '111.222.333-44',
      telefone: '(21) 98888-7777',
      cargo: 'Diretor',
      role: 'admin'
    });

    const gerentePopular = await Usuario.create({
      empresa_id: empresaPopular.id,
      nome: 'Ana Paula',
      email: 'gerente@popular.com',
      senha: '123456',
      cpf: '555.666.777-88',
      telefone: '(21) 97777-6666',
      cargo: 'Gerente de Vendas',
      role: 'gerente'
    });
    console.log('✅ Usuários da Drogaria Popular criados');

    // Produtos da Drogaria Popular (diferentes da Farmácia Teste)
    const produtosPopular = [
      {
        empresa_id: empresaPopular.id,
        codigo_barras: '7899999999990',
        nome: 'Ibuprofeno 600mg',
        descricao: 'Anti-inflamatório',
        categoria: 'Medicamento',
        subcategoria: 'Anti-inflamatório',
        fabricante: 'Aché',
        principio_ativo: 'Ibuprofeno',
        apresentacao: 'Comprimido',
        dosagem: '600mg',
        preco_custo: 12.00,
        preco_venda: 28.90,
        margem_lucro: 140.83,
        requer_receita: false,
        controlado: false,
        generico: true
      },
      {
        empresa_id: empresaPopular.id,
        codigo_barras: '7899999999991',
        nome: 'Omeprazol 20mg',
        descricao: 'Protetor gástrico',
        categoria: 'Medicamento',
        subcategoria: 'Gastro',
        fabricante: 'Eurofarma',
        principio_ativo: 'Omeprazol',
        apresentacao: 'Cápsula',
        dosagem: '20mg',
        preco_custo: 10.00,
        preco_venda: 24.50,
        margem_lucro: 145.00,
        requer_receita: false,
        controlado: false,
        generico: true
      }
    ];

    for (const produtoData of produtosPopular) {
      const produto = await Produto.create(produtoData);
      
      await Estoque.create({
        empresa_id: empresaPopular.id,
        produto_id: produto.id,
        quantidade_atual: Math.floor(Math.random() * 150) + 30,
        quantidade_minima: 15,
        quantidade_maxima: 300,
        lote: `POP${Math.floor(Math.random() * 10000)}`,
        data_fabricacao: new Date('2024-01-01'),
        data_validade: new Date('2027-06-30'),
        localizacao: `Setor ${Math.floor(Math.random() * 5) + 1}`
      });
    }
    console.log('✅ Produtos e estoque criados para Drogaria Popular');

    console.log('');
    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('📝 CREDENCIAIS DE ACESSO - FARMÁCIA TESTE');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('Admin:');
    console.log('  Email: admin@pharma.com');
    console.log('  Senha: 123456');
    console.log('  Empresa: Farmácia Teste');
    console.log('');
    console.log('Gerente:');
    console.log('  Email: gerente@pharma.com');
    console.log('  Senha: 123456');
    console.log('  Empresa: Farmácia Teste');
    console.log('');
    console.log('Funcionário:');
    console.log('  Email: funcionario@pharma.com');
    console.log('  Senha: 123456');
    console.log('  Empresa: Farmácia Teste');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('📝 CREDENCIAIS DE ACESSO - DROGARIA POPULAR');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('Admin:');
    console.log('  Email: admin@popular.com');
    console.log('  Senha: 123456');
    console.log('  Empresa: Drogaria Popular');
    console.log('');
    console.log('Gerente:');
    console.log('  Email: gerente@popular.com');
    console.log('  Senha: 123456');
    console.log('  Empresa: Drogaria Popular');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🔒 TESTE DE ISOLAMENTO MULTI-TENANT');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('✅ Farmácia Teste: 3 produtos (Dipirona, Paracetamol, Amoxicilina)');
    console.log('✅ Drogaria Popular: 2 produtos (Ibuprofeno, Omeprazol)');
    console.log('');
    console.log('🧪 Para testar o isolamento:');
    console.log('   1. Faça login com admin@pharma.com');
    console.log('   2. Liste os produtos - deve ver apenas 3 produtos');
    console.log('   3. Faça logout e login com admin@popular.com');
    console.log('   4. Liste os produtos - deve ver apenas 2 produtos');
    console.log('   5. Tente acessar produto da outra empresa - deve retornar 404');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seed();
