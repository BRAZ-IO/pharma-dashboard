const axios = require('axios');

async function testarSimples() {
  try {
    console.log('🧪 Testando conexão com backend...');
    
    // 1. Testar se backend está online
    try {
      await axios.get('http://localhost:3001/api/health');
      console.log('✅ Backend está online');
    } catch (error) {
      console.log('❌ Backend não está online');
      console.log('   Inicie o backend com: npm start');
      return;
    }
    
    // 2. Tentar login
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@pharma.com',
        senha: '123456'
      });
      
      const token = loginResponse.data.token;
      console.log('✅ Login realizado');
      
      // 3. Verificar fluxo de caixa
      const fluxoResponse = await axios.get('http://localhost:3001/api/fluxo-caixa/resumo', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📊 Dados do fluxo de caixa:');
      console.log(`   - Total entradas: R$ ${fluxoResponse.data.totalEntradas || 0}`);
      console.log(`   - Total saídas: R$ ${fluxoResponse.data.totalSaidas || 0}`);
      console.log(`   - Transações: ${fluxoResponse.data.transacoesRecentes?.length || 0}`);
      
      if (fluxoResponse.data.transacoesRecentes?.length > 0) {
        console.log('📋 Transações encontradas:');
        fluxoResponse.data.transacoesRecentes.forEach((t, i) => {
          console.log(`   ${i + 1}. ${t.descricao} - R$ ${t.valor}`);
        });
      }
      
    } catch (error) {
      console.log('❌ Erro no login:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarSimples();
