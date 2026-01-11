const axios = require('axios');

async function testarVendaAPI() {
  try {
    console.log('🧪 Testando criação de venda via API...');
    
    // 1. Fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pharma.com',
      senha: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Criar venda de teste
    const vendaData = {
      items: [{
        produto_id: '289c7c32-afae-4011-b98a-3ba75dd59de3', // ID de um produto do seed
        quantidade: 1,
        preco_unitario: 12.90,
        subtotal: 12.90
      }],
      forma_pagamento: 'dinheiro',
      total: 12.90,
      subtotal: 12.90,
      cliente_nome: 'CLIENTE TESTE API',
      cliente_cpf: null
    };
    
    console.log('📦 Enviando venda:', JSON.stringify(vendaData, null, 2));
    
    const vendaResponse = await axios.post('http://localhost:3001/api/vendas', vendaData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Venda criada:', vendaResponse.data.numero_venda);
    console.log('📊 ID da venda:', vendaResponse.data.id);
    
    // 3. Verificar se foi criado no fluxo de caixa
    setTimeout(async () => {
      try {
        const fluxoResponse = await axios.get('http://localhost:3001/api/fluxo-caixa', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const transacoes = fluxoResponse.data.transacoes || [];
        const transacaoVenda = transacoes.find(t => t.descricao.includes(vendaResponse.data.numero_venda));
        
        if (transacaoVenda) {
          console.log('✅ Integração funcionou!');
          console.log(`📋 Transação: ${transacaoVenda.descricao}`);
          console.log(`💰 Valor: R$ ${transacaoVenda.valor}`);
        } else {
          console.log('❌ Integração NÃO funcionou!');
          console.log('📋 Transações encontradas:', transacoes.map(t => t.descricao));
        }
      } catch (error) {
        console.error('❌ Erro ao verificar fluxo de caixa:', error.message);
      }
    }, 2000); // Esperar 2 segundos para processar
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testarVendaAPI();
