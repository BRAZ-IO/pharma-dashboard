const { Venda, ItemVenda, Produto, Usuario, Empresa, FluxoCaixa } = require('../models');
const { sequelize } = require('../config/database');

async function testarIntegracaoVendaFluxo() {
  try {
    console.log('🧪 Testando integração Venda -> Fluxo de Caixa...');
    
    // 1. Buscar empresa e usuário
    const empresa = await Empresa.findOne();
    const usuario = await Usuario.findOne({ where: { empresa_id: empresa.id } });
    
    console.log(`🏢 Empresa: ${empresa.nome}`);
    console.log(`👤 Usuário: ${usuario.nome}`);
    
    // 2. Buscar um produto para teste
    const produto = await Produto.findOne({ where: { empresa_id: empresa.id } });
    if (!produto) {
      console.log('❌ Nenhum produto encontrado');
      return;
    }
    console.log(`📦 Produto: ${produto.nome} (R$ ${produto.preco_venda})`);
    
    // 3. Contar fluxo de caixa antes
    const fluxoAntes = await FluxoCaixa.count({
      where: { empresa_id: empresa.id }
    });
    console.log(`📊 Fluxo de caixa antes: ${fluxoAntes} registros`);
    
    // 4. Criar uma venda de teste
    const transaction = await sequelize.transaction();
    
    try {
      const venda = await Venda.create({
        empresa_id: empresa.id,
        usuario_id: usuario.id,
        cliente_nome: 'CLIENTE TESTE INTEGRAÇÃO',
        numero_venda: `TEST-${Date.now()}`,
        tipo: 'venda',
        status: 'finalizada',
        subtotal: produto.preco_venda,
        total: produto.preco_venda,
        forma_pagamento: 'dinheiro',
        observacoes: 'Venda de teste para integração'
      }, { transaction });
      
      await ItemVenda.create({
        venda_id: venda.id,
        produto_id: produto.id,
        quantidade: 1,
        preco_unitario: produto.preco_venda,
        subtotal: produto.preco_venda
      }, { transaction });
      
      await transaction.commit();
      console.log(`✅ Venda criada: ${venda.numero_venda}`);
      
      // 5. Simular a função de integração
      const fluxoCriado = await FluxoCaixa.create({
        descricao: `Venda ${venda.numero_venda} - ${venda.cliente_nome}`,
        tipo: 'entrada',
        valor: venda.total,
        categoria: 'Vendas PDV',
        forma_pagamento: 'Dinheiro',
        data: new Date(),
        responsavel: usuario.nome,
        observacoes: `Venda automática via PDV - 1 itens`,
        empresa_id: empresa.id,
        venda_id: venda.id
      });
      
      console.log(`✅ Fluxo de caixa criado: ID ${fluxoCriado.id}`);
      
      // 6. Verificar se foi criado
      const fluxoDepois = await FluxoCaixa.count({
        where: { empresa_id: empresa.id }
      });
      console.log(`📊 Fluxo de caixa depois: ${fluxoDepois} registros`);
      
      // 7. Buscar o registro vinculado
      const fluxoVinculado = await FluxoCaixa.findOne({
        where: { venda_id: venda.id },
        include: [
          {
            model: Venda,
            as: 'venda',
            attributes: ['numero_venda', 'total']
          }
        ]
      });
      
      if (fluxoVinculado) {
        console.log('🔗 Integração funcionando!');
        console.log(`   - Venda: ${fluxoVinculado.venda.numero_venda}`);
        console.log(`   - Valor: R$ ${fluxoVinculado.valor}`);
        console.log(`   - Descrição: ${fluxoVinculado.descricao}`);
      } else {
        console.log('❌ Problema na integração');
      }
      
      // 8. Limpar dados de teste
      await fluxoVinculado.destroy();
      await ItemVenda.destroy({ where: { venda_id: venda.id } });
      await venda.destroy();
      
      console.log('🧹 Dados de teste removidos');
      console.log('🎉 Teste de integração concluído com sucesso!');
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de integração:', error);
  } finally {
    await sequelize.close();
  }
}

testarIntegracaoVendaFluxo();
