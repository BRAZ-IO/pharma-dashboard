const { FluxoCaixa, Venda, Usuario, Empresa } = require('../models');
const { sequelize } = require('../config/database');

async function testarFluxoCaixa() {
  try {
    console.log('🧪 Iniciando teste manual do Fluxo de Caixa...');
    
    // 1. Verificar conexão com banco
    await sequelize.authenticate();
    console.log('✅ Conexão com banco OK');
    
    // 2. Verificar se modelos existem
    console.log('📋 Modelos carregados:', {
      FluxoCaixa: !!FluxoCaixa,
      Venda: !!Venda,
      Usuario: !!Usuario,
      Empresa: !!Empresa
    });
    
    // 3. Contar registros existentes
    const totalFluxo = await FluxoCaixa.count();
    const totalVendas = await Venda.count();
    console.log(`📊 Registros existentes - FluxoCaixa: ${totalFluxo}, Vendas: ${totalVendas}`);
    
    // 4. Buscar primeira empresa para teste
    const empresa = await Empresa.findOne();
    if (!empresa) {
      console.log('❌ Nenhuma empresa encontrada');
      return;
    }
    console.log(`🏢 Usando empresa: ${empresa.nome}`);
    
    // 5. Buscar primeiro usuário para teste
    const usuario = await Usuario.findOne({ where: { empresa_id: empresa.id } });
    if (!usuario) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }
    console.log(`👤 Usando usuário: ${usuario.nome}`);
    
    // 6. Criar registro de teste no fluxo de caixa
    const testeFluxo = await FluxoCaixa.create({
      descricao: 'TESTE MANUAL - Fluxo de Caixa',
      tipo: 'entrada',
      valor: 100.00,
      categoria: 'Teste Manual',
      forma_pagamento: 'Dinheiro',
      data: new Date(),
      responsavel: usuario.nome,
      observacoes: 'Registro de teste criado manualmente',
      empresa_id: empresa.id
    });
    console.log(`✅ Registro criado: ID ${testeFluxo.id}`);
    
    // 7. Buscar o registro criado
    const registroBuscado = await FluxoCaixa.findByPk(testeFluxo.id);
    console.log(`🔍 Registro encontrado: ${registroBuscado ? 'SIM' : 'NÃO'}`);
    
    // 8. Listar todos os registros da empresa
    const registrosEmpresa = await FluxoCaixa.findAll({
      where: { empresa_id: empresa.id },
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    console.log(`📋 Registros da empresa (${registrosEmpresa.length}):`);
    registrosEmpresa.forEach(r => {
      console.log(`   - ${r.descricao}: R$ ${r.valor}`);
    });
    
    // 9. Limpar registro de teste
    await registroBuscado.destroy();
    console.log('🧹 Registro de teste removido');
    
    console.log('🎉 Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

// Executar teste
testarFluxoCaixa();
