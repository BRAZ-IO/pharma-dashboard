# 🔐 Configuração do Bcrypt

## 📋 O que é Bcrypt?

**Bcrypt** é um algoritmo de hashing de senhas projetado para ser lento e resistente a ataques de força bruta.

### Características:

- **Adaptativo:** Pode aumentar o custo computacional ao longo do tempo
- **Salt automático:** Cada hash tem um salt único
- **Resistente a GPU:** Dificulta ataques com hardware especializado

---

## ⚙️ Configuração de Rounds

### O que são "rounds"?

Rounds (ou cost factor) determinam quantas iterações o algoritmo executa:

```
Iterações = 2^rounds

10 rounds = 2^10 = 1.024 iterações
12 rounds = 2^12 = 4.096 iterações
14 rounds = 2^14 = 16.384 iterações
```

**Mais rounds = Mais seguro, mas mais lento**

---

## 🎯 Configuração Atual

### Implementação no Projeto:

```javascript
// src/models/Usuario.js
hooks: {
  beforeCreate: async (usuario) => {
    if (usuario.senha) {
      usuario.senha = await bcrypt.hash(usuario.senha, 12); // ✅ 12 rounds
    }
  },
  beforeUpdate: async (usuario) => {
    if (usuario.changed('senha')) {
      usuario.senha = await bcrypt.hash(usuario.senha, 12); // ✅ 12 rounds
    }
  }
}
```

---

## 📊 Comparação de Performance

### Tempo de Hash por Rounds:

| Rounds | Iterações | Tempo Aproximado | Segurança |
|--------|-----------|------------------|-----------|
| 8      | 256       | ~40ms           | ⚠️ Fraco (não recomendado) |
| 10     | 1.024     | ~100ms          | 🟡 Mínimo aceitável |
| 12     | 4.096     | ~250ms          | ✅ **Recomendado (2024+)** |
| 14     | 16.384    | ~1000ms         | 🔒 Muito seguro |
| 16     | 65.536    | ~4000ms         | 🔐 Extremamente seguro |

**Nota:** Tempos variam conforme hardware.

---

## 🎯 Por que 12 Rounds?

### Recomendações Atuais (2024-2026):

1. **OWASP:** Recomenda 12+ rounds
2. **NIST:** Sugere ajustar conforme hardware
3. **Indústria:** Padrão de 12 rounds

### Balanceamento:

```
10 rounds: Rápido mas menos seguro
12 rounds: ✅ Equilíbrio ideal
14 rounds: Muito lento para UX
```

### Cálculo de Segurança:

Com **12 rounds** e hardware moderno:
- **~250ms** por tentativa
- **4.000 tentativas/segundo** (máximo)
- **Senha de 8 caracteres:** Anos para quebrar por força bruta

---

## 🔄 Quando Aumentar Rounds?

### Sinais para Aumentar:

1. **Hardware mais rápido disponível**
   - CPUs mais potentes
   - Tempo de hash < 100ms

2. **Requisitos de segurança aumentaram**
   - Dados mais sensíveis
   - Conformidade regulatória

3. **Ataques mais sofisticados**
   - GPUs mais poderosas
   - Botnets maiores

### Como Aumentar:

```javascript
// Aumentar gradualmente
usuario.senha = await bcrypt.hash(usuario.senha, 13); // De 12 para 13

// Testar performance
const start = Date.now();
await bcrypt.hash('test', 13);
console.log(`Tempo: ${Date.now() - start}ms`);
```

**Regra:** Tempo de hash deve ser **200-500ms** para boa UX.

---

## 🧪 Testando Performance

### Script de Teste:

```javascript
const bcrypt = require('bcryptjs');

async function testBcryptPerformance() {
  const senha = 'senha_teste_123';
  const rounds = [10, 11, 12, 13, 14];

  console.log('🧪 Testando performance do bcrypt\n');

  for (const round of rounds) {
    const start = Date.now();
    await bcrypt.hash(senha, round);
    const time = Date.now() - start;

    console.log(`${round} rounds: ${time}ms (${Math.pow(2, round).toLocaleString()} iterações)`);
  }
}

testBcryptPerformance();
```

**Resultado esperado:**
```
🧪 Testando performance do bcrypt

10 rounds: 95ms (1,024 iterações)
11 rounds: 180ms (2,048 iterações)
12 rounds: 350ms (4,096 iterações)
13 rounds: 700ms (8,192 iterações)
14 rounds: 1400ms (16,384 iterações)
```

---

## 🔒 Migração de Rounds

### Cenário: Aumentar de 10 para 12 rounds

**Problema:** Senhas antigas com 10 rounds, novas com 12 rounds.

**Solução:** Rehash progressivo

```javascript
// Middleware de login
async login(req, res) {
  const usuario = await Usuario.findOne({ where: { email } });
  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (senhaValida) {
    // Verificar rounds do hash atual
    const currentRounds = parseInt(usuario.senha.split('$')[2]);
    
    if (currentRounds < 12) {
      // Rehash com 12 rounds
      await usuario.update({
        senha: senha // Trigger beforeUpdate hook com 12 rounds
      });
      console.log(`✅ Senha rehashed para 12 rounds: ${usuario.email}`);
    }

    // Login bem-sucedido
    return res.json({ token: gerarToken(usuario) });
  }
}
```

**Vantagens:**
- ✅ Migração transparente
- ✅ Sem impacto no usuário
- ✅ Gradual e segura

---

## 📚 Formato do Hash

### Estrutura do Bcrypt Hash:

```
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7RvzVvUoBC
│  │  │  │                                                    │
│  │  │  │                                                    └─ Hash (31 chars)
│  │  │  └─ Salt (22 chars)
│  │  └─ Rounds (cost factor)
│  └─ Minor version
└─ Algorithm identifier
```

### Exemplo:

```javascript
const hash = await bcrypt.hash('minhaSenha123', 12);
// $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7RvzVvUoBC

// Extrair rounds
const rounds = parseInt(hash.split('$')[2]); // 12
```

---

## ⚠️ Erros Comuns

### 1. Rounds muito baixos

```javascript
// ❌ INSEGURO
await bcrypt.hash(senha, 8); // Apenas 256 iterações!

// ✅ SEGURO
await bcrypt.hash(senha, 12); // 4.096 iterações
```

### 2. Rounds muito altos

```javascript
// ❌ UX RUIM
await bcrypt.hash(senha, 16); // ~4 segundos!

// ✅ BALANCEADO
await bcrypt.hash(senha, 12); // ~250ms
```

### 3. Comparação errada

```javascript
// ❌ NUNCA FAÇA ISSO
if (senha === usuario.senha) { ... }

// ✅ SEMPRE USE bcrypt.compare
if (await bcrypt.compare(senha, usuario.senha)) { ... }
```

### 4. Salt manual

```javascript
// ❌ DESNECESSÁRIO
const salt = await bcrypt.genSalt(12);
const hash = await bcrypt.hash(senha, salt);

// ✅ AUTOMÁTICO
const hash = await bcrypt.hash(senha, 12);
```

---

## 🎯 Boas Práticas

### ✅ Fazer:

1. **Use 12+ rounds** em produção
2. **Teste performance** no seu hardware
3. **Monitore tempo de hash** em produção
4. **Aumente rounds** conforme hardware evolui
5. **Use bcrypt.compare** sempre

### ❌ Não Fazer:

1. **Não use rounds < 10**
2. **Não compare hashes diretamente**
3. **Não armazene senhas em texto plano**
4. **Não use MD5/SHA1** para senhas
5. **Não implemente bcrypt manualmente**

---

## 📊 Monitoramento

### Métricas Importantes:

```javascript
// Middleware de monitoramento
async function monitorBcryptPerformance(req, res, next) {
  if (req.path === '/api/auth/login') {
    const start = Date.now();
    
    // Executar login
    await next();
    
    const time = Date.now() - start;
    
    // Log se muito lento
    if (time > 500) {
      console.warn(`⚠️ Login lento: ${time}ms`);
    }
  }
}
```

### Alertas:

- ⚠️ Tempo médio > 500ms → Considerar otimização
- 🔴 Tempo médio > 1000ms → Problema de performance
- ✅ Tempo médio 200-400ms → Ideal

---

## 🔄 Roadmap de Segurança

### Curto Prazo (Implementado):
- [x] 12 rounds configurados
- [x] Hash dummy atualizado
- [x] Documentação criada

### Médio Prazo:
- [ ] Monitoramento de performance
- [ ] Rehash progressivo de senhas antigas
- [ ] Testes automatizados

### Longo Prazo:
- [ ] Avaliar Argon2 (sucessor do bcrypt)
- [ ] Aumentar para 13 rounds (quando hardware permitir)
- [ ] Implementar pepper (secret adicional)

---

## 📚 Referências

- [Bcrypt NPM Package](https://www.npmjs.com/package/bcryptjs)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Bcrypt Calculator](https://www.bcrypt-calculator.com/)
- [How to safely store passwords](https://codahale.com/how-to-safely-store-a-password/)

---

## ✅ Checklist de Segurança

- [x] Bcrypt com 12+ rounds
- [x] Salt automático
- [x] Hash dummy atualizado
- [x] Comparação com bcrypt.compare
- [x] Tempo de hash monitorado
- [ ] Rehash progressivo implementado
- [ ] Testes de performance
- [ ] Alertas de performance lenta

---

**Última atualização:** 07/01/2026  
**Versão:** 1.0.0  
**Rounds atuais:** 12 (4.096 iterações)
