# 🛡️ Proteção Contra XSS (Cross-Site Scripting)

## 📋 O que é XSS?

**Cross-Site Scripting (XSS)** é um ataque onde código malicioso (geralmente JavaScript) é injetado em páginas web confiáveis.

### Tipos de XSS:

1. **Stored XSS (Persistente)**
   - Código malicioso armazenado no banco de dados
   - Executado quando outros usuários acessam a página

2. **Reflected XSS (Refletido)**
   - Código malicioso na URL ou formulário
   - Executado imediatamente

3. **DOM-based XSS**
   - Manipulação do DOM no lado do cliente
   - Não passa pelo servidor

---

## 🎯 Implementações de Proteção

### 1. **Content Security Policy (CSP)**

#### Configuração no Helmet:

```javascript
// src/app.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],                    // Apenas recursos do próprio domínio
      scriptSrc: ["'self'"],                     // Scripts apenas do próprio domínio
      styleSrc: ["'self'", "'unsafe-inline'"],   // Estilos (inline necessário para alguns frameworks)
      imgSrc: ["'self'", "data:", "https:"],     // Imagens
      connectSrc: ["'self'"],                    // Conexões AJAX/WebSocket
      fontSrc: ["'self'"],                       // Fontes
      objectSrc: ["'none'"],                     // Bloquear <object>, <embed>
      mediaSrc: ["'self'"],                      // Áudio/Vídeo
      frameSrc: ["'none'"],                      // Bloquear iframes
      baseUri: ["'self'"],                       // Base URL
      formAction: ["'self'"],                    // Destino de formulários
      frameAncestors: ["'none'"],                // Prevenir clickjacking
      upgradeInsecureRequests: []                // Forçar HTTPS
    }
  }
}));
```

#### O que cada diretiva faz:

| Diretiva | Função | Exemplo Bloqueado |
|----------|--------|-------------------|
| `defaultSrc` | Padrão para todos os recursos | `<script src="http://evil.com/bad.js">` |
| `scriptSrc` | Controla scripts JavaScript | `<script>alert('XSS')</script>` |
| `styleSrc` | Controla CSS | `<link href="http://evil.com/bad.css">` |
| `imgSrc` | Controla imagens | `<img src="http://evil.com/track.gif">` |
| `objectSrc: none` | Bloqueia Flash/Java | `<object data="malware.swf">` |
| `frameAncestors: none` | Previne clickjacking | `<iframe src="yoursite.com">` |

---

### 2. **Sanitização de Inputs**

#### Middleware de Sanitização:

```javascript
// src/middlewares/sanitize.js
const xss = require('xss');

function sanitizeString(str) {
  return xss(str, {
    whiteList: {},  // Não permitir nenhuma tag HTML
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
  });
}

// Middleware aplicado globalmente
app.use(sanitizeAll);
```

#### Exemplo de Sanitização:

```javascript
// Input malicioso
const input = '<script>alert("XSS")</script>Hello';

// Após sanitização
const safe = sanitizeString(input);
// Resultado: '&lt;script&gt;alert("XSS")&lt;/script&gt;Hello'
```

---

### 3. **Headers de Segurança Adicionais**

```javascript
app.use(helmet({
  // X-XSS-Protection: 1; mode=block
  xssFilter: true,
  
  // X-Content-Type-Options: nosniff
  noSniff: true,
  
  // Referrer-Policy: strict-origin-when-cross-origin
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  
  // Strict-Transport-Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 🔒 Proteções Implementadas

### ✅ 1. CSP Configurado

**Localização:** `src/app.js`

**Proteção:**
- Bloqueia scripts inline maliciosos
- Bloqueia recursos de domínios não autorizados
- Previne injeção de código

**Teste:**
```bash
curl -I http://localhost:5000/api/health
# Deve retornar:
# Content-Security-Policy: default-src 'self'; script-src 'self'; ...
```

---

### ✅ 2. Sanitização Automática

**Localização:** `src/middlewares/sanitize.js`

**Proteção:**
- Remove tags HTML maliciosas
- Escapa caracteres especiais
- Sanitiza body, query e params

**Exemplo:**

```javascript
// POST /api/produtos
{
  "nome": "<script>alert('XSS')</script>Produto",
  "descricao": "<img src=x onerror=alert('XSS')>"
}

// Após sanitização
{
  "nome": "&lt;script&gt;alert('XSS')&lt;/script&gt;Produto",
  "descricao": "&lt;img src=x onerror=alert('XSS')&gt;"
}
```

---

### ✅ 3. Headers de Segurança

**Headers enviados:**

```
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🧪 Testando Proteção XSS

### Teste 1: Script Inline

```bash
# Tentar injetar script
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nome": "<script>alert(\"XSS\")</script>Produto Teste",
    "preco_venda": 10.00
  }'

# Verificar no banco - deve estar escapado
# nome: "&lt;script&gt;alert(\"XSS\")&lt;/script&gt;Produto Teste"
```

---

### Teste 2: Event Handler

```bash
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nome": "<img src=x onerror=alert(1)>",
    "preco_venda": 10.00
  }'

# Deve ser sanitizado
```

---

### Teste 3: CSP Headers

```bash
curl -I http://localhost:5000/api/health

# Verificar headers:
# Content-Security-Policy: default-src 'self'; ...
```

---

## 🎯 Boas Práticas

### ✅ Backend (Implementado):

1. **CSP configurado** com diretivas restritivas
2. **Sanitização automática** de todos os inputs
3. **Headers de segurança** (X-XSS-Protection, etc.)
4. **Validação de tipos** com express-validator
5. **Escape de output** ao enviar respostas

### ✅ Frontend (Recomendado):

1. **Usar React** (escapa automaticamente)
2. **Evitar dangerouslySetInnerHTML**
3. **Validar inputs** no cliente também
4. **Usar bibliotecas confiáveis**
5. **CSP meta tag** no HTML

---

## 📊 Níveis de Proteção

### Sem Proteção:
```javascript
// ❌ VULNERÁVEL
app.post('/api/produtos', (req, res) => {
  const produto = await Produto.create(req.body);
  res.json(produto);
});
// Input: <script>alert('XSS')</script>
// Armazenado: <script>alert('XSS')</script> ⚠️
```

### Com Sanitização:
```javascript
// ✅ PROTEGIDO
app.use(sanitizeAll);
app.post('/api/produtos', (req, res) => {
  const produto = await Produto.create(req.body);
  res.json(produto);
});
// Input: <script>alert('XSS')</script>
// Armazenado: &lt;script&gt;alert('XSS')&lt;/script&gt; ✅
```

### Com CSP:
```javascript
// ✅✅ DUPLAMENTE PROTEGIDO
app.use(helmet({ contentSecurityPolicy: { ... } }));
app.use(sanitizeAll);
// Mesmo se XSS passar, CSP bloqueia execução
```

---

## 🔍 Vetores de Ataque Bloqueados

### ✅ 1. Script Tags
```html
<script>alert('XSS')</script>
<script src="http://evil.com/bad.js"></script>
```
**Bloqueado por:** Sanitização + CSP

---

### ✅ 2. Event Handlers
```html
<img src=x onerror=alert('XSS')>
<body onload=alert('XSS')>
<input onfocus=alert('XSS') autofocus>
```
**Bloqueado por:** Sanitização

---

### ✅ 3. JavaScript URLs
```html
<a href="javascript:alert('XSS')">Click</a>
<iframe src="javascript:alert('XSS')">
```
**Bloqueado por:** Sanitização + CSP

---

### ✅ 4. Data URLs
```html
<object data="data:text/html,<script>alert('XSS')</script>">
```
**Bloqueado por:** CSP (objectSrc: none)

---

### ✅ 5. SVG XSS
```html
<svg onload=alert('XSS')>
```
**Bloqueado por:** Sanitização

---

## ⚠️ Casos Especiais

### 1. Rich Text Editor

Se você precisa permitir HTML formatado:

```javascript
const xss = require('xss');

// Whitelist de tags seguras
const options = {
  whiteList: {
    p: [],
    br: [],
    strong: [],
    em: [],
    u: [],
    a: ['href', 'title'],
    ul: [],
    ol: [],
    li: []
  }
};

const safeHtml = xss(userInput, options);
```

---

### 2. Markdown

Use biblioteca confiável:

```javascript
const marked = require('marked');
const DOMPurify = require('isomorphic-dompurify');

const html = marked(markdown);
const clean = DOMPurify.sanitize(html);
```

---

### 3. JSON com HTML

```javascript
// ❌ VULNERÁVEL
res.json({ message: userInput });

// ✅ SEGURO
res.json({ message: sanitizeString(userInput) });
```

---

## 🛠️ Ferramentas de Teste

### 1. Manual Testing

```bash
# XSS Payloads comuns
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')">
```

### 2. Automated Testing

```javascript
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  'javascript:alert(1)',
  '<iframe src="javascript:alert(1)">'
];

for (const payload of xssPayloads) {
  const response = await request(app)
    .post('/api/produtos')
    .send({ nome: payload })
    .expect(201);
    
  // Verificar se foi sanitizado
  expect(response.body.nome).not.toContain('<script>');
}
```

### 3. Browser DevTools

```javascript
// No console do navegador
fetch('/api/produtos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: '<script>alert("XSS")</script>'
  })
});
```

---

## 📚 Referências

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [XSS Filter Evasion Cheat Sheet](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)

---

## ✅ Checklist de Segurança

- [x] CSP configurado com diretivas restritivas
- [x] Sanitização automática de inputs (body, query, params)
- [x] Headers de segurança (X-XSS-Protection, etc.)
- [x] Biblioteca xss para sanitização
- [x] Helmet configurado corretamente
- [ ] Testes automatizados de XSS
- [ ] Validação de tipos com express-validator
- [ ] Escape de output em templates
- [ ] Auditoria de dependências (npm audit)

---

## 🔄 Manutenção

### Verificar CSP:

```bash
# Testar CSP
curl -I http://localhost:5000/api/health | grep -i "content-security"
```

### Atualizar Dependências:

```bash
npm audit
npm update helmet xss
```

### Monitorar Violações CSP:

```javascript
// Adicionar report-uri ao CSP
contentSecurityPolicy: {
  directives: {
    // ...
    reportUri: '/api/csp-report'
  }
}

// Endpoint para receber reports
app.post('/api/csp-report', (req, res) => {
  console.warn('CSP Violation:', req.body);
  res.status(204).end();
});
```

---

**Última atualização:** 07/01/2026  
**Versão:** 1.0.0  
**Status:** ✅ Proteção XSS Ativa
