// Teste simples para verificar API
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testando API...');
    
    // Testar health
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health:', health.data);
    
    // Testar login
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@pharma.com',
      password: '123456'
    });
    console.log('✅ Login:', login.data);
    
    // Testar vendas com token
    const token = login.data.accessToken;
    const vendas = await axios.get('http://localhost:5000/api/vendas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Vendas:', vendas.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
