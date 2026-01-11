const axios = require('axios');

async function testarIntegracaoCompleta() {
  try {
    console.log('🧪 Testando integração completa PDV -> Fluxo de Caixa...');
    
    // 1. Fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pharma.com',
      senha: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Verificar fluxo de caixa antes da venda
    const fluxoAntes = await axios.get('http://localhost:3001/api/fluxo-caixa/resumo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📊 Fluxo de caixa ANTES:');
    console.log(`   - Total entradas: R$ ${fluxoAntes.data.totalEntradas || 0}`);
    console.log(`   - Total saídas: R$ ${fluxoAntes.data.totalSaidas || 0}`);
    console.log(`   - Transações: ${fluxoAntes.data.transacoesRecentes?.length || 0}`);
    
    // 3. Criar uma venda de teste
    const vendaData = {
      items: [{
        produto_id: '289c7c32-afae-4011-b98a-3ba75dd59de3',
        quantidade: 1,
        preco_unitario: 12.90,
        subtotal: 12.90
      }],
      forma_pagamento: 'dinheiro',
      total: 12.90,
      subtotal: 12.90,
      cliente_nome: 'CLIENTE TESTE INTEGRAÇÃO'
    };
    
    console.log('🛒 Criando venda de teste...');
    const vendaResponse = await axios.post('http://localhost:3001/api/vendas', vendaData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Venda criada: ${vendaResponse.data.numero_venda}`);
    
    // 4. Verificar fluxo de caixa depois da venda
    setTimeout(async () => {
      try {
        const fluxoDepois = await axios.get('http://localhost:3001/api/fluxo-caixa/resumo', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('📊 Fluxo de caixa DEPOIS:');
        console.log(`   - Total entradas: R$ ${fluxoDepois.data.totalEntradas || 0}`);
        console.log(`   - Total saídas: R$ ${fluxoDepois.data.totalSaidas || 0}`);
        console.log(`   - Transações: ${fluxoDepois.data.transacoesRecentes?.length || 0}`);
        
        // 5. Verificar se a venda aparece no fluxo
        const transacoes = fluxoDepois.data.transacoesRecentes || [];
        const vendaNoFluxo = transacoes.find(t => 
          t.descricao.includes(vendaResponse.data.numero_venda) || 
          t.venda_id === vendaResponse.data.id
        );
        
        if (vendaNoFluxo) {
          console.log('🎉 INTEGRAÇÃO FUNCIONANDO!');
          console.log(`   - Venda encontrada no fluxo: ${vendaNoFluxo.descricao}`);
          console.log(`   - Valor: R$ ${vendaNoFluxo.valor}`);
          console.log(`   - Categoria: ${vendaNoFluxo.categoria}`);
        } else {
          console.log('❌ INTEGRAÇÃO NÃO FUNCIONANDO!');
          console.log('   - Venda não encontrada no fluxo de caixa');
          console.log('   - Transações disponíveis:');
          transacoes.forEach((t, i) => {
            console.log(`     ${i + 1}. ${t.descricao} - R$ ${t.valor}`);
          });
        }
        
        // 6. Verificar endpoint específico do PDV
        const fluxoPDV = await axios.get('http://localhost:3001/api/fluxo-caixa/pdv', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('📋 Endpoint /fluxo-caixa/pdv:');
        console.log(`   - Transações PDV: ${fluxoPDV.data.transacoes?.length || 0}`);
        console.log(`   - Total vendas: ${fluxoPDV.data.totais?.total_vendas || 0}`);
        
      } catch (error) {
        console.error('❌ Erro ao verificar fluxo depois:', error.message);
      }
    }, 3000); // Esperar 3 segundos para processar
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testarIntegracaoCompleta();
