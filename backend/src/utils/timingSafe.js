/**
 * Utilitários para proteção contra timing attacks
 */

const crypto = require('crypto');

/**
 * Comparação de strings com tempo constante
 * Previne timing attacks ao comparar tokens, códigos, etc.
 * 
 * @param {string} a - Primeira string
 * @param {string} b - Segunda string
 * @returns {boolean} - true se as strings são iguais
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  // Garantir que ambas as strings tenham o mesmo comprimento
  // Isso previne vazamento de informação sobre o tamanho
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  // Se os tamanhos forem diferentes, usar um buffer dummy
  if (bufferA.length !== bufferB.length) {
    // Comparar com um buffer dummy para manter tempo constante
    const dummyBuffer = Buffer.alloc(bufferA.length);
    crypto.timingSafeEqual(bufferA, dummyBuffer);
    return false;
  }

  // Usar a função nativa do Node.js para comparação segura
  try {
    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch (error) {
    return false;
  }
}

/**
 * Adiciona delay aleatório para dificultar análise de timing
 * Útil em operações sensíveis como login, validação de tokens, etc.
 * 
 * @param {number} minMs - Delay mínimo em milissegundos
 * @param {number} maxMs - Delay máximo em milissegundos
 * @returns {Promise<void>}
 */
async function randomDelay(minMs = 100, maxMs = 300) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Executa uma função com tempo constante
 * Adiciona delay se a execução for muito rápida
 * 
 * @param {Function} fn - Função a ser executada
 * @param {number} minTimeMs - Tempo mínimo de execução em ms
 * @returns {Promise<any>} - Resultado da função
 */
async function constantTimeExecution(fn, minTimeMs = 200) {
  const startTime = Date.now();
  const result = await fn();
  const executionTime = Date.now() - startTime;
  
  if (executionTime < minTimeMs) {
    await new Promise(resolve => 
      setTimeout(resolve, minTimeMs - executionTime)
    );
  }
  
  return result;
}

/**
 * Valida código 2FA com proteção contra timing attacks
 * 
 * @param {string} inputCode - Código fornecido pelo usuário
 * @param {string} expectedCode - Código esperado
 * @returns {boolean}
 */
function validateCodeTimingSafe(inputCode, expectedCode) {
  // Normalizar códigos (remover espaços, converter para maiúsculas)
  const normalizedInput = String(inputCode).replace(/\s/g, '').toUpperCase();
  const normalizedExpected = String(expectedCode).replace(/\s/g, '').toUpperCase();
  
  return timingSafeEqual(normalizedInput, normalizedExpected);
}

/**
 * Gera hash de string com salt aleatório
 * Útil para armazenar tokens de forma segura
 * 
 * @param {string} value - Valor a ser hasheado
 * @returns {string} - Hash em formato hex
 */
function secureHash(value) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(value, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica hash gerado por secureHash
 * 
 * @param {string} value - Valor a ser verificado
 * @param {string} storedHash - Hash armazenado (salt:hash)
 * @returns {boolean}
 */
function verifySecureHash(value, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(value, salt, 10000, 64, 'sha512').toString('hex');
  return timingSafeEqual(hash, verifyHash);
}

module.exports = {
  timingSafeEqual,
  randomDelay,
  constantTimeExecution,
  validateCodeTimingSafe,
  secureHash,
  verifySecureHash
};
