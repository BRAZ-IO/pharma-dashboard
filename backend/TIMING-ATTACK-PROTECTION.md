# 🛡️ Proteção Contra Timing Attacks

## 📋 O que são Timing Attacks?

**Timing attacks** são ataques que exploram diferenças no tempo de resposta do sistema para descobrir informações sensíveis.

### Exemplo de Vulnerabilidade:

```javascript
// ❌ VULNERÁVEL
if (usuario.email === inputEmail) {
  // Verifica senha
  if (usuario.senha === inputSenha) {
    return "Login OK";
  }
}
return "Credenciais inválidas";
```

**Problema:**
- Se o email não existe → Resposta rápida (~1ms)
- Se o email existe mas senha errada → Resposta lenta (~100ms por causa do bcrypt)
- **Atacante pode enumerar emails válidos!**

---

## 🔒 Implementações de Proteção

### 1. **Login com Tempo Constante**

#### Antes (Vulnerável):
```javascript
const usuario = await Usuario.findOne({ where: { email } });

if (!usuario) {
  return res.status(401).json({ error: 'Credenciais inválidas' });
}

const senhaValida = await bcrypt.compare(senha, usuario.senha);
if (!senhaValida) {
  return res.status(401).json({ error: 'Credenciais inválidas' });
}
```

**Problema:** Se usuário não existe, não executa bcrypt (resposta rápida).

#### Depois (Protegido):
```javascript
const usuario = await Usuario.findOne({ where: { email } });

// Hash dummy para manter tempo constante
const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const senhaHash = usuario?.senha || dummyHash;

// SEMPRE executar bcrypt, mesmo se usuário não existir
const senhaValida = await bcrypt.compare(senha, senhaHash);

if (!usuario || !senhaValida) {
  return res.status(401).json({ error: 'Credenciais inválidas' });
}
```

**Proteção:** Tempo de resposta sempre inclui bcrypt (~100ms).

---

### 2. **Comparação Timing-Safe**

#### Biblioteca: `crypto.timingSafeEqual()`

```javascript
const crypto = require('crypto');

function timingSafeEqual(a, b) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    const dummyBuffer = Buffer.alloc(bufferA.length);
    crypto.timingSafeEqual(bufferA, dummyBuffer);
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}
```

**Uso:**
```javascript
// ❌ Vulnerável
if (backupCode === inputCode) { ... }

// ✅ Protegido
if (timingSafeEqual(backupCode, inputCode)) { ... }
```

---

### 3. **Validação 2FA com Tempo Constante**

```javascript
const { constantTimeExecution } = require('../utils/timingSafe');

async validate(req, res) {
  // Executar com tempo mínimo de 200ms
  const result = await constantTimeExecution(async () => {
    const usuario = await Usuario.findByPk(userId);
    
    if (!usuario) {
      return { valid: false };
    }

    // Validar código
    const valid = speakeasy.totp.verify({ ... });
    return { valid };
  }, 200); // Mínimo 200ms

  if (!result.valid) {
    return res.status(401).json({ error: 'Código inválido' });
  }
}
```

**Proteção:** Sempre demora no mínimo 200ms, independente do resultado.

---

### 4. **Códigos de Backup Timing-Safe**

```javascript
// ❌ Vulnerável
const codeIndex = backupCodes.indexOf(token);

// ✅ Protegido
let codeIndex = -1;
for (let i = 0; i < backupCodes.length; i++) {
  if (validateCodeTimingSafe(token, backupCodes[i])) {
    codeIndex = i;
    break;
  }
}
```

---

## 🛠️ Utilitários Implementados

### `src/utils/timingSafe.js`

#### 1. `timingSafeEqual(a, b)`
Compara strings com tempo constante.

```javascript
const { timingSafeEqual } = require('../utils/timingSafe');

if (timingSafeEqual(token, expectedToken)) {
  // Token válido
}
```

#### 2. `constantTimeExecution(fn, minTimeMs)`
Executa função com tempo mínimo.

```javascript
const result = await constantTimeExecution(async () => {
  return await validateUser();
}, 200); // Mínimo 200ms
```

#### 3. `randomDelay(minMs, maxMs)`
Adiciona delay aleatório.

```javascript
await randomDelay(100, 300); // 100-300ms aleatório
```

#### 4. `validateCodeTimingSafe(input, expected)`
Valida códigos 2FA com segurança.

```javascript
if (validateCodeTimingSafe(userCode, backupCode)) {
  // Código válido
}
```

#### 5. `secureHash(value)` / `verifySecureHash(value, hash)`
Hash seguro com PBKDF2.

```javascript
const hash = secureHash('sensitive-token');
// Armazenar hash

const valid = verifySecureHash('sensitive-token', hash);
```

---

## 📊 Comparação de Tempos

### Sem Proteção:
```
Email não existe:     1-5ms    ⚠️ Vazamento de informação
Email existe:         100ms    ⚠️ Vazamento de informação
Código 2FA inválido:  1ms      ⚠️ Vazamento de informação
Código 2FA válido:    50ms     ⚠️ Vazamento de informação
```

### Com Proteção:
```
Email não existe:     100ms    ✅ Tempo constante
Email existe:         100ms    ✅ Tempo constante
Código 2FA inválido:  200ms    ✅ Tempo constante
Código 2FA válido:    200ms    ✅ Tempo constante
```

---

## 🎯 Onde Aplicar

### ✅ Implementado:

1. **Login** (`authController.js`)
   - Sempre executa bcrypt
   - Tempo constante independente de usuário existir

2. **Validação 2FA** (`twoFactorController.js`)
   - Tempo mínimo de 200ms
   - Comparação timing-safe de códigos de backup

3. **Códigos de Backup**
   - Comparação timing-safe
   - Não vaza informação sobre códigos válidos

### 🔄 Recomendado Aplicar:

4. **Reset de Senha**
   - Não revelar se email existe

5. **Verificação de Email**
   - Tempo constante na verificação

6. **API Rate Limiting**
   - Não revelar limites exatos

---

## 🧪 Como Testar

### Teste Manual:

```bash
# 1. Medir tempo com usuário inexistente
time curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"naoexiste@test.com","senha":"123456"}'

# 2. Medir tempo com usuário existente
time curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pharma.com","senha":"senhaerrada"}'

# 3. Comparar tempos - devem ser similares (~100ms)
```

### Teste Automatizado:

```javascript
const { performance } = require('perf_hooks');

async function testTimingAttack() {
  const times = [];

  // Testar 100 vezes
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    await login('naoexiste@test.com', 'senha');
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b) / times.length;
  const stdDev = Math.sqrt(
    times.map(x => Math.pow(x - avg, 2))
         .reduce((a, b) => a + b) / times.length
  );

  console.log(`Média: ${avg}ms`);
  console.log(`Desvio padrão: ${stdDev}ms`);
  
  // Desvio padrão deve ser baixo (<10ms)
  return stdDev < 10;
}
```

---

## 📚 Referências

- [OWASP - Timing Attack](https://owasp.org/www-community/attacks/Timing_attack)
- [Node.js crypto.timingSafeEqual](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b)
- [CWE-208: Observable Timing Discrepancy](https://cwe.mitre.org/data/definitions/208.html)

---

## ⚠️ Avisos Importantes

1. **Não confie apenas em timing-safe**
   - Use também rate limiting
   - Implemente CAPTCHA após várias tentativas

2. **Bcrypt é essencial**
   - Sempre use bcrypt para senhas
   - Nunca compare senhas em texto plano

3. **Monitore tentativas**
   - Log de tentativas de login
   - Alertas para múltiplas falhas

4. **Teste regularmente**
   - Faça testes de timing periodicamente
   - Use ferramentas automatizadas

---

## ✅ Checklist de Segurança

- [x] Login com tempo constante
- [x] Comparação timing-safe de strings
- [x] Validação 2FA com tempo constante
- [x] Códigos de backup timing-safe
- [x] Utilitários de segurança criados
- [ ] Reset de senha com tempo constante
- [ ] Testes automatizados de timing
- [ ] Monitoramento de tentativas

---

**Última atualização:** 07/01/2026  
**Versão:** 1.0.0
