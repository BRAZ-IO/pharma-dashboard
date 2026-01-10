// Teste simples para verificar API
const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Testando API...');
    
    // Testar health
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health:', health.data);
    
    // Testar login
    const loginData = {
      email: 'admin@pharma.com',
      senha: '123456'
    };
    console.log('📤 Enviando login:', loginData);
    
    const login = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Login successful');
    console.log('📋 Resposta login:', JSON.stringify(login.data, null, 2));
    
    // Testar vendas com token
    const token = login.data.accessToken || login.data.token;
    if (!token) {
      throw new Error('Token não encontrado na resposta');
    }
    console.log('🔑 Token obtido:', token.substring(0, 20) + '...');
    
    const vendas = await axios.get('http://localhost:5000/api/vendas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Vendas acessadas:', vendas.data.vendas?.length || 0, 'vendas encontradas');
    
    // Testar POST de venda
    const testData = {
      items: [{
        produto_id: 'test-id',
        quantidade: 1,
        preco_unitario: 10.0,
        subtotal: 10.0
      }],
      forma_pagamento: 'dinheiro',
      total: 10.0,
      subtotal: 10.0,
      cliente_id: null,
      cliente_nome: 'Consumidor Final',
      cliente_cpf: null
    };
    
    console.log('📦 Enviando dados de teste:', testData);
    const novaVenda = await axios.post('http://localhost:5000/api/vendas', testData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Venda criada:', novaVenda.data.id);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
