// Teste com try-catch detalhado
console.log('=== DEBUG APP.JS ===');

try {
  console.log('1. Loading modules...');
  const express = require('express');
  console.log('✓ Express loaded');
  
  console.log('2. Creating app...');
  const app = express();
  console.log('✓ App created');
  
  console.log('3. Loading config/env.js...');
  const envConfig = require('./config/env.js');
  console.log('✓ Config loaded');
  
  console.log('4. Loading middlewares...');
  const { errorHandler, notFound } = require('./middlewares/errorHandler');
  console.log('✓ Error handler loaded');
  
  const { sanitizeAll } = require('./middlewares/sanitize');
  console.log('✓ Sanitize loaded');
  
  console.log('5. Loading dosProtection...');
  const dosProtection = require('./middlewares/dosProtection');
  console.log('✓ DosProtection loaded');
  
  console.log('6. Loading routes...');
  const routes = require('./routes');
  console.log('✓ Routes loaded');
  
  console.log('7. Setting up middlewares...');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log('✓ Basic middlewares added');
  
  console.log('8. Adding routes...');
  app.use('/api', routes);
  console.log('✓ Routes added');
  
  console.log('9. Adding test route...');
  app.get('/test', (req, res) => {
    res.json({ message: 'App working!' });
  });
  console.log('✓ Test route added');
  
  console.log('10. Exporting app...');
  module.exports = app;
  console.log('✓ App exported successfully');
  
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('Stack:', error.stack);
  module.exports = null;
}
