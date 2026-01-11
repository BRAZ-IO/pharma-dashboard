const axios = require('axios');

async function testarEndpointFluxoPDV() {
  try {
    console.log('🧪 Testando endpoint /fluxo-caixa/pdv...');
    
    // 1. Fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@pharma.com',
      senha: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Testar endpoint /fluxo-caixa/pdv
    const response = await axios.get('http://localhost:3001/api/fluxo-caixa/pdv', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📋 Resposta do endpoint:', JSON.stringify(response.data, null, 2));
    
    // 3. Testar endpoint /fluxo-caixa (geral)
    const responseGeral = await axios.get('http://localhost:3001/api/fluxo-caixa', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📋 Resposta do endpoint geral:', {
      total: responseGeral.data.total,
      transacoes: responseGeral.data.transacoes?.length || 0
    });
    
    // 4. Listar todas as transações
    if (responseGeral.data.transacoes) {
      console.log('📊 Transações encontradas:');
      responseGeral.data.transacoes.forEach((t, i) => {
        console.log(`   ${i + 1}. ${t.descricao} - R$ ${t.valor} - venda_id: ${t.venda_id || 'NULL'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testarEndpointFluxoPDV();
