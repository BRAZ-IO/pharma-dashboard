# 🛡️ Proteção Contra DoS (Denial of Service)

## 📋 O que é DoS?

**Denial of Service (DoS)** é um ataque que visa tornar um serviço indisponível, sobrecarregando-o com requisições ou consumindo seus recursos.

### Tipos de Ataques DoS:

1. **Volume-based** - Inundar com tráfego
2. **Protocol-based** - Explorar fraquezas de protocolo
3. **Application-layer** - Atacar a aplicação específica
4. **Slowloris** - Conexões lentas que esgotam recursos
5. **DDoS** - Ataque distribuído de múltiplas fontes

---

## 🎯 Proteções Implementadas

### 1. **Rate Limiting Diferenciado**

#### Rate Limiting Geral (API):
```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // 100 requisições por IP
  message: 'Muitas requisições. Tente novamente em 15 minutos.'
});
```

**Proteção:**
- Limita requisições por IP
- Previne flood de requisições
- Janela deslizante de 15 minutos

---

#### Rate Limiting Severo (Login):
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                      // Apenas 5 tentativas
  skipSuccessfulRequests: true // Não conta logins bem-sucedidos
});
```

**Proteção:**
- Previne brute force em login
- Apenas 5 tentativas a cada 15 minutos
- Logins válidos não contam

---

### 2. **Slowdown Progressivo**

```javascript
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,      // Começar a atrasar após 50 requisições
  delayMs: 500,        // +500ms por requisição extra
  maxDelayMs: 20000    // Máximo 20 segundos de delay
});
```

**Como funciona:**
```
Requisição 1-50:   Sem delay
Requisição 51:     +500ms delay
Requisição 52:     +1000ms delay
Requisição 53:     +1500ms delay
...
Requisição 90+:    +20000ms delay (máximo)
```

**Proteção:**
- Desacelera atacantes gradualmente
- Não bloqueia completamente (melhor UX)
- Torna ataques inviáveis

---

### 3. **Limites de Payload**

```javascript
app.use(express.json({ 
  limit: '10mb',  // Máximo 10MB
  verify: (req, res, buf) => {
    if (buf.length > 10 * 1024 * 1024) {
      throw new Error('Payload muito grande');
    }
  }
}));
```

**Proteção:**
- Previne payloads gigantes
- Limite de 10MB por requisição
- Máximo de 1000 parâmetros

---

### 4. **Timeout de Requisições**

```javascript
const requestTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeoutMs);
    res.setTimeout(timeoutMs);
    next();
  };
};
```

**Proteção:**
- Requisições não podem demorar mais de 30 segundos
- Libera recursos automaticamente
- Previne Slowloris

---

### 5. **Limitar Requisições Simultâneas**

```javascript
const MAX_CONCURRENT = 10; // Por IP

if (current >= MAX_CONCURRENT) {
  return res.status(429).json({
    error: 'Muitas requisições simultâneas'
  });
}
```

**Proteção:**
- Máximo 10 requisições simultâneas por IP
- Previne esgotamento de conexões
- Libera recursos após conclusão

---

### 6. **Detector de Atividade Suspeita**

```javascript
const suspiciousPatterns = [
  /(\.\.|\/\/|\\\\)/g,           // Path traversal
  /(union|select|insert)/gi,     // SQL Injection
  /(<script|javascript:)/gi,     // XSS
  /(eval\(|exec\()/gi            // Code injection
];
```

**Proteção:**
- Detecta padrões de ataque
- Bloqueia requisições maliciosas
- Log de atividades suspeitas

---

### 7. **Limitar Tamanho de Arrays**

```javascript
const arrayLimiter = (maxItems = 100) => {
  // Verifica arrays em body, query, params
  if (array.length > maxItems) {
    throw new Error('Array muito grande');
  }
};
```

**Proteção:**
- Arrays limitados a 100 itens
- Previne processamento excessivo
- Valida recursivamente

---

### 8. **Monitoramento de Recursos**

```javascript
const resourceMonitor = () => {
  // Monitora tempo e memória
  if (duration > 5000) {
    console.warn('Requisição lenta');
  }
  if (memoryDelta > 50MB) {
    console.warn('Alto consumo de memória');
  }
};
```

**Proteção:**
- Detecta requisições lentas
- Monitora consumo de memória
- Alertas automáticos

---

## 📊 Camadas de Proteção

```
┌─────────────────────────────────────────┐
│  1. Rate Limiting (100 req/15min)      │
│     ↓ Bloqueia após limite              │
├─────────────────────────────────────────┤
│  2. Slowdown (delay progressivo)       │
│     ↓ Desacelera após 50 req           │
├─────────────────────────────────────────┤
│  3. Concurrent Limiter (10 simultâneas)│
│     ↓ Bloqueia excesso de conexões     │
├─────────────────────────────────────────┤
│  4. Payload Limiter (10MB máx)         │
│     ↓ Rejeita payloads grandes         │
├─────────────────────────────────────────┤
│  5. Request Timeout (30s)              │
│     ↓ Cancela requisições lentas       │
├─────────────────────────────────────────┤
│  6. Array Limiter (100 itens)          │
│     ↓ Limita processamento             │
├─────────────────────────────────────────┤
│  7. Suspicious Activity Detector       │
│     ↓ Bloqueia padrões maliciosos      │
├─────────────────────────────────────────┤
│  8. Resource Monitor                   │
│     ↓ Alerta sobre anomalias           │
└─────────────────────────────────────────┘
```

---

## 🧪 Testando Proteção DoS

### Teste 1: Rate Limiting

```bash
# Fazer 101 requisições em 1 minuto
for i in {1..101}; do
  curl http://localhost:5000/api/health
  echo "Requisição $i"
done

# Requisição 101 deve retornar 429 (Too Many Requests)
```

---

### Teste 2: Login Brute Force

```bash
# Tentar 6 logins em sequência
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","senha":"wrong"}'
done

# 6ª tentativa deve retornar 429
```

---

### Teste 3: Payload Grande

```bash
# Tentar enviar payload > 10MB
dd if=/dev/zero bs=1M count=11 | \
  curl -X POST http://localhost:5000/api/produtos \
    -H "Content-Type: application/json" \
    --data-binary @-

# Deve retornar 413 (Payload Too Large)
```

---

### Teste 4: Requisições Simultâneas

```javascript
// Fazer 15 requisições simultâneas
const promises = Array.from({ length: 15 }, () =>
  fetch('http://localhost:5000/api/produtos')
);

await Promise.all(promises);
// Algumas devem retornar 429
```

---

### Teste 5: Array Grande

```bash
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ['$(for i in {1..101}; do echo "\"tag$i\","; done)']
  }'

# Deve retornar 400 (Array muito grande)
```

---

## 📈 Métricas e Monitoramento

### Logs Automáticos:

```
⚠️ Requisição lenta: POST /api/produtos - 5234ms
⚠️ Alto consumo de memória: GET /api/usuarios - 52.34MB
⚠️ Atividade suspeita detectada de 192.168.1.100: /(\.\.|\/\/|\\\\)/g
⚠️ Rate limit atingido: 192.168.1.100 - /api/produtos
```

### Métricas Importantes:

1. **Requisições por segundo**
2. **Taxa de rejeição (429)**
3. **Tempo médio de resposta**
4. **Uso de memória**
5. **Requisições simultâneas**

---

## 🎯 Configurações Recomendadas

### Desenvolvimento:
```javascript
apiLimiter: { max: 1000 }      // Mais permissivo
loginLimiter: { max: 10 }      // Mais tentativas
requestTimeout: 60000          // 60 segundos
```

### Produção:
```javascript
apiLimiter: { max: 100 }       // Restritivo
loginLimiter: { max: 5 }       // Poucas tentativas
requestTimeout: 30000          // 30 segundos
```

### Alta Carga:
```javascript
apiLimiter: { max: 50 }        // Muito restritivo
loginLimiter: { max: 3 }       // Mínimo
requestTimeout: 15000          // 15 segundos
```

---

## 🔧 Melhorias Futuras

### 1. Redis para Rate Limiting

```javascript
const RedisStore = require('rate-limit-redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient
  })
});
```

**Vantagens:**
- Compartilhado entre instâncias
- Persistente
- Mais rápido

---

### 2. IP Whitelist/Blacklist

```javascript
const ipBlacklist = new Set(['192.168.1.100']);

app.use((req, res, next) => {
  if (ipBlacklist.has(req.ip)) {
    return res.status(403).json({ error: 'IP bloqueado' });
  }
  next();
});
```

---

### 3. CAPTCHA após Múltiplas Falhas

```javascript
if (failedAttempts > 3) {
  return res.json({
    requiresCaptcha: true,
    message: 'Complete o CAPTCHA para continuar'
  });
}
```

---

### 4. WAF (Web Application Firewall)

Considerar soluções como:
- **Cloudflare**
- **AWS WAF**
- **ModSecurity**

---

## ⚠️ Avisos Importantes

### 1. Rate Limiting em Produção

```javascript
// ❌ Não use memória em produção com múltiplas instâncias
const limiter = rateLimit({ ... });

// ✅ Use Redis ou similar
const limiter = rateLimit({
  store: new RedisStore({ ... })
});
```

### 2. Logs Sensíveis

```javascript
// ❌ Não logue dados sensíveis
console.log('Login falhou:', req.body);

// ✅ Logue apenas informações necessárias
console.log('Login falhou:', req.ip, req.body.email);
```

### 3. Balanceamento de Carga

Com load balancer, use:
- `trust proxy: true` no Express
- Header `X-Forwarded-For` para IP real

```javascript
app.set('trust proxy', 1);
```

---

## 📚 Referências

- [OWASP DoS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- [Express Slow Down](https://www.npmjs.com/package/express-slow-down)
- [Node.js Best Practices - DoS](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

---

## ✅ Checklist de Proteção DoS

- [x] Rate limiting geral (100 req/15min)
- [x] Rate limiting de login (5 tentativas/15min)
- [x] Slowdown progressivo
- [x] Limite de payload (10MB)
- [x] Timeout de requisições (30s)
- [x] Limite de requisições simultâneas (10)
- [x] Detector de atividade suspeita
- [x] Limiter de arrays (100 itens)
- [x] Monitoramento de recursos
- [ ] Redis para rate limiting distribuído
- [ ] IP blacklist/whitelist
- [ ] CAPTCHA após falhas
- [ ] WAF (Cloudflare/AWS)

---

## 🔄 Manutenção

### Verificar Limites:

```bash
# Testar rate limit
ab -n 150 -c 10 http://localhost:5000/api/health

# Verificar logs
tail -f logs/access.log | grep "429"
```

### Ajustar Limites:

```javascript
// Aumentar limite temporariamente
apiLimiter.resetKey(req.ip);
```

### Monitorar Performance:

```javascript
// Adicionar métricas
const prometheus = require('prom-client');
const requestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP'
});
```

---

**Última atualização:** 07/01/2026  
**Versão:** 1.0.0  
**Status:** ✅ Proteção DoS Ativa
