require('dotenv').config();
const { sequelize } = require('../config/database');
const { Empresa, Usuario, Produto, Estoque, Fornecedor, Cliente, FluxoCaixa, Venda, ItemVenda } = require('../models');
const { v4: uuidv4 } = require('uuid');

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
    // CRIAR FILIAL PADRÃO
    // ========================================
    
    const filialPadrao = await sequelize.models.Filial.create({
      empresa_id: empresaPadrao.id,
      nome: 'Matriz',
      nome_fantasia: 'Matriz - Farmácia Teste',
      cnpj: '00.000.000/0002-00',
      telefone: '(11) 0000-0001',
      email: 'matriz@farmaciateste.local',
      endereco: {
        rua: 'Rua da Matriz',
        numero: '456',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '00000-001'
      },
      ativo: true
    });
    console.log('✅ Filial matriz criada');

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
        filial_id: filialPadrao.id,
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
    
    // Buscar produtos criados para usar nas vendas
    const produtosCriados = await Produto.findAll({
      where: { empresa_id: empresaPadrao.id }
    });
    
    console.log('✅ Produtos e estoque criados para Farmácia Teste');

    // ========================================
    // CRIAR FORNECEDORES
    // ========================================
    
    const fornecedores = await Fornecedor.bulkCreate([
      {
        nome: 'Distribuidora Medicamentos Ltda',
        cnpj: '12345678901234',
        email: 'contato@distmed.com.br',
        telefone: '1134567890',
        contato: 'João Silva',
        endereco: 'Rua das Indústrias, 1000 - São Paulo/SP',
        status: 'ativo',
        empresa_id: empresaPadrao.id
      },
      {
        nome: 'Laboratório Farma Brasil',
        cnpj: '56789012345678',
        email: 'vendas@farmabrasil.com',
        telefone: '1123456789',
        contato: 'Maria Santos',
        endereco: 'Av. Brasil, 2000 - Rio de Janeiro/RJ',
        status: 'ativo',
        empresa_id: empresaPadrao.id
      },
      {
        nome: 'Distribuidora Central',
        cnpj: '90123456789012',
        email: null,
        telefone: '11987654321',
        contato: 'Carlos Oliveira',
        endereco: 'Rua Central, 500 - São Paulo/SP',
        status: 'inativo',
        empresa_id: empresaPadrao.id
      }
    ]);
    console.log('✅ Fornecedores criados');

    // ========================================
    // CRIAR CLIENTES
    // ========================================
    
    const clientes = await Cliente.bulkCreate([
      {
        nome: 'Ana Silva',
        cpf: '12345678901',
        email: 'ana.silva@email.com',
        telefone: '11987654321',
        endereco: 'Rua das Flores, 123 - São Paulo/SP',
        data_cadastro: '2024-01-15',
        status: 'ativo',
        empresa_id: empresaPadrao.id
      },
      {
        nome: 'Carlos Oliveira',
        cpf: '98765432109',
        email: 'carlos.oliveira@email.com',
        telefone: '21912345678',
        endereco: 'Av. Central, 456 - Rio de Janeiro/RJ',
        data_cadastro: '2024-02-20',
        status: 'ativo',
        empresa_id: empresaPadrao.id
      },
      {
        nome: 'Mariana Costa',
        cpf: '55566677788',
        email: 'mariana.costa@email.com',
        telefone: '31988765432',
        endereco: 'Alameda dos Clientes, 789 - Belo Horizonte/MG',
        data_cadastro: '2024-03-10',
        status: 'inativo',
        empresa_id: empresaPadrao.id
      },
      {
        nome: 'Posto de Saúde Central',
        cnpj: '11122233344455',
        email: 'compras@postosaude.gov.br',
        telefone: '1131234567',
        endereco: 'Rua da Saúde, 100 - São Paulo/SP',
        data_cadastro: '2024-01-05',
        status: 'ativo',
        empresa_id: empresaPadrao.id
      }
    ]);
    console.log('✅ Clientes criados');

    // ========================================
    // CRIAR FLUXO DE CAIXA
    // ========================================
    
    const fluxoCaixa = await FluxoCaixa.bulkCreate([
      {
        descricao: 'Venda PDV - Pedido #1234',
        tipo: 'entrada',
        valor: 450.00,
        categoria: 'Vendas',
        forma_pagamento: 'Dinheiro',
        data: '2026-01-08',
        responsavel: 'João Silva',
        observacoes: 'Venda de medicamentos diversos',
        empresa_id: empresaPadrao.id
      },
      {
        descricao: 'Venda PDV - Pedido #1235',
        tipo: 'entrada',
        valor: 320.00,
        categoria: 'Vendas',
        forma_pagamento: 'Cartão Crédito',
        data: '2026-01-08',
        responsavel: 'Maria Santos',
        observacoes: 'Venda de produtos de higiene',
        empresa_id: empresaPadrao.id
      },
      {
        descricao: 'Recebimento de Cliente',
        tipo: 'entrada',
        valor: 1500.00,
        categoria: 'Contas a Receber',
        forma_pagamento: 'Transferência',
        data: '2026-01-07',
        responsavel: 'Carlos Oliveira',
        observacoes: 'Pagamento de fatura em atraso',
        empresa_id: empresaPadrao.id
      },
      {
        descricao: 'Compra de Medicamentos',
        tipo: 'saida',
        valor: 1200.00,
        categoria: 'Compras',
        forma_pagamento: 'Transferência',
        data: '2026-01-08',
        responsavel: 'Ana Costa',
        observacoes: 'Compra mensal de estoque',
        empresa_id: empresaPadrao.id
      },
      {
        descricao: 'Pagamento de Aluguel',
        tipo: 'saida',
        valor: 3500.00,
        categoria: 'Despesas Fixas',
        forma_pagamento: 'TED',
        data: '2026-01-08',
        responsavel: 'Carlos Oliveira',
        observacoes: 'Aluguel do mês de janeiro',
        empresa_id: empresaPadrao.id
      },
      {
        descricao: 'Conta de Luz',
        tipo: 'saida',
        valor: 450.00,
        categoria: 'Despesas Fixas',
        forma_pagamento: 'Boleto',
        data: '2026-01-07',
        responsavel: 'Maria Santos',
        observacoes: 'Energia elétrica dezembro/2025',
        empresa_id: empresaPadrao.id
      },
      {
        descricao: 'Salário Funcionários',
        tipo: 'saida',
        valor: 8500.00,
        categoria: 'Folha de Pagamento',
        forma_pagamento: 'Transferência',
        data: '2026-01-05',
        responsavel: 'Administrador',
        observacoes: 'Folha de pagamento janeiro/2026',
        empresa_id: empresaPadrao.id
      }
    ]);
    console.log('✅ Transações de fluxo de caixa criadas');

    console.log('');

    // ========================================
    // CRIAR VENDAS DE TESTE
    // ========================================

    console.log('📊 Criando vendas de teste...');

    // Buscar clientes para associar às vendas
    const clientesDb = await Cliente.findAll({
      where: { empresa_id: empresaPadrao.id },
      limit: 10
    });

    // Criar vendas para os últimos dias
    const vendasTeste = [];
    const diasParaCriar = 7;

    for (let i = 0; i < diasParaCriar; i++) {
      const dataVenda = new Date();
      dataVenda.setDate(dataVenda.getDate() - i);

      // Criar 3 vendas por dia
      for (let j = 0; j < 3; j++) {
        const numeroVenda = `V${String(dataVenda.getDate()).padStart(2, '0')}${String(dataVenda.getMonth() + 1).padStart(2, '0')}${String(dataVenda.getFullYear()).slice(-2)}${String(j + 1).padStart(3, '0')}`;
        
        // Selecionar produtos aleatórios
        const itensVenda = [];
        const numProdutos = Math.floor(Math.random() * 3) + 1; // 1 a 3 produtos
        
        for (let k = 0; k < numProdutos; k++) {
          const produtoAleatorio = produtosCriados[Math.floor(Math.random() * produtosCriados.length)];
          const quantidade = Math.floor(Math.random() * 3) + 1; // 1 a 3 unidades
          const precoUnitario = produtoAleatorio.preco_venda;
          const subtotalItem = precoUnitario * quantidade;
          
          itensVenda.push({
            id: uuidv4(),
            produto_id: produtoAleatorio.id,
            quantidade,
            preco_unitario: precoUnitario,
            subtotal: subtotalItem
          });
        }
        
        const subtotal = itensVenda.reduce((sum, item) => sum + item.subtotal, 0);
        const desconto = Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0;
        const total = subtotal - desconto;

        // Selecionar cliente aleatório ou deixar como consumidor final
        const clienteSelecionado = clientesDb.length > 0 && Math.random() > 0.3 ? 
          clientesDb[Math.floor(Math.random() * clientesDb.length)] : null;

        const venda = await Venda.create({
          empresa_id: empresaPadrao.id,
          usuario_id: admin.id,
          cliente_id: clienteSelecionado?.id || null,
          cliente_nome: clienteSelecionado?.nome || null,
          cliente_cpf: clienteSelecionado?.cpf || clienteSelecionado?.cnpj || null,
          numero_venda: numeroVenda,
          tipo: 'venda',
          status: 'finalizada',
          subtotal,
          desconto,
          total,
          forma_pagamento: ['Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'PIX'][Math.floor(Math.random() * 4)],
          parcelas: 1,
          observacoes: 'Venda de teste gerada automaticamente',
          createdAt: dataVenda,
          updatedAt: dataVenda
        });

        // Criar itens da venda
        await ItemVenda.bulkCreate(
          itensVenda.map(item => ({
            ...item,
            venda_id: venda.id
          }))
        );

        vendasTeste.push(venda);
      }
    }

    console.log(`✅ Criadas ${vendasTeste.length} vendas de teste`);

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

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seed();
