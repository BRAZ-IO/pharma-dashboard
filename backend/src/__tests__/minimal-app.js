// Teste mínimo para verificar se o app funciona
try {
  const express = require('express');
  console.log('Express loaded successfully');
  
  const app = express();
  console.log('App created successfully');
  console.log('App type:', typeof app);
  
  // Teste básico
  app.get('/test', (req, res) => {
    res.json({ message: 'Test working' });
  });
  
  console.log('Route added successfully');
  console.log('App has listen method:', typeof app.listen);
  console.log('App has use method:', typeof app.use);
  
  module.exports = app;
} catch (error) {
  console.error('Error creating app:', error);
  module.exports = null;
}
