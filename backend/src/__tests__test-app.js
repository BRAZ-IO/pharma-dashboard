// Teste simples para verificar se o app.js exporta corretamente
console.log('=== TESTE APP.JS ===');

try {
  // Carregar o app
  console.log('1. Carregando app.js...');
  const { app } = require('../app.js');
  console.log('✅ App carregado:', typeof app);
  console.log('✅ App tem listen:', typeof app.listen);
  console.log('✅ App tem use:', typeof app.use);
  console.log('✅ App tem get:', typeof app.get);
  
  // Teste se o app funciona
  console.log('2. Testando funcionalidade...');
  app.get('/test', (req, res) => {
    res.json({ message: 'App working!' });
  });
  console.log('✅ Rota de teste adicionada');
  
  // Exportar para uso
  console.log('✅ Exportando app...');
  module.exports = { app };
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  console.error('Stack:', error.stack);
  module.exports = { app: null };
}
