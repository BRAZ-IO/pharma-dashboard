#!/usr/bin/env node

/**
 * Script para gerar JWT secrets seguros
 * Uso: node scripts/generate-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Gerador de JWT Secrets Seguros\n');
console.log('═'.repeat(60));

// Gerar JWT_SECRET (256 bits = 32 bytes)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('\n✅ JWT_SECRET (256 bits):');
console.log(jwtSecret);

// Gerar REFRESH_SECRET (256 bits = 32 bytes)
const refreshSecret = crypto.randomBytes(32).toString('hex');
console.log('\n✅ REFRESH_SECRET (256 bits):');
console.log(refreshSecret);

// Gerar ENCRYPTION_KEY para dados sensíveis (256 bits)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('\n✅ ENCRYPTION_KEY (256 bits):');
console.log(encryptionKey);

console.log('\n' + '═'.repeat(60));
console.log('\n📝 Instruções:');
console.log('1. Copie os secrets acima');
console.log('2. Cole no arquivo .env:');
console.log('   JWT_SECRET=<cole aqui>');
console.log('   REFRESH_SECRET=<cole aqui>');
console.log('   ENCRYPTION_KEY=<cole aqui>');
console.log('\n⚠️  NUNCA compartilhe estes secrets!');
console.log('⚠️  Use secrets diferentes em cada ambiente!\n');
