// Teste para identificar qual middleware está causando o problema
console.log('Starting app debug...');

try {
  console.log('1. Loading express...');
  const express = require('express');
  
  console.log('2. Creating app...');
  const app = express();
  
  console.log('3. Loading config/env...');
  const { FRONTEND_URL, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('./config/env');
  console.log('Config loaded:', { FRONTEND_URL, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS });
  
  console.log('4. Loading errorHandler...');
  const { errorHandler, notFound } = require('./middlewares/errorHandler');
  console.log('Error handler loaded');
  
  console.log('5. Loading sanitize...');
  const { sanitizeAll } = require('./middlewares/sanitize');
  console.log('Sanitize loaded');
  
  console.log('6. Loading dosProtection...');
  const { 
    requestTimeout, 
    concurrentRequestLimiter, 
    suspiciousActivityDetector,
    arrayLimiter,
    resourceMonitor
  } = require('./middlewares/dosProtection');
  console.log('DosProtection loaded');
  
  console.log('7. Loading routes...');
  const routes = require('./routes');
  console.log('Routes loaded');
  
  console.log('8. App created successfully!');
  module.exports = app;
  
} catch (error) {
  console.error('Error during app creation:', error);
  console.error('Stack trace:', error.stack);
  module.exports = null;
}
