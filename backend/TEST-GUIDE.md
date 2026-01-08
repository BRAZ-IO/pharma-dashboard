# 🧪 Guia de Testes Unitários - Pharma Dashboard

## 📋 Visão Geral

Este projeto inclui testes unitários completos para garantir a qualidade e segurança do sistema, com foco especial em:

- ✅ **Autenticação e Autorização**
- ✅ **Isolamento Multi-Tenant**
- ✅ **Segurança (XSS, Rate Limiting, Headers)**
- ✅ **Validação de Inputs**

---

## 🚀 Como Executar os Testes

### **Executar Todos os Testes**
```bash
npm test
```

### **Executar Testes com Coverage**
```bash
npm test -- --coverage
```

### **Executar Testes Específicos**
```bash
# Apenas testes de autenticação
npm test -- auth.test.js

# Apenas testes multi-tenant
npm test -- multi-tenant.test.js

# Apenas testes de segurança
npm test -- security.test.js
```

### **Modo Watch (Desenvolvimento)**
```bash
npm test -- --watch
```

---

## 📁 Estrutura de Testes

```
backend/
├── src/
│   └── __tests__/
│       ├── auth.test.js           # Testes de autenticação
│       ├── multi-tenant.test.js   # Testes de isolamento
│       └── security.test.js       # Testes de segurança
├── jest.config.js                 # Configuração do Jest
└── TEST-GUIDE.md                  # Este arquivo
```

---

## 🧪 Testes Implementados

### **1. Testes de Autenticação** (`auth.test.js`)

#### **Login**
- ✅ Login com credenciais válidas
- ✅ Erro com senha incorreta
- ✅ Erro com email inexistente
- ✅ Validação de campos obrigatórios
- ✅ Inclusão de dados da empresa no login

#### **Registro**
- ✅ Registro de novo usuário
- ✅ Erro ao registrar email duplicado

#### **Proteção de Rotas**
- ✅ Bloqueio de acesso sem token
- ✅ Bloqueio com token inválido
- ✅ Acesso permitido com token válido

**Exemplo de Teste:**
```javascript
test('Deve fazer login com credenciais válidas', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin1@test.com',
      senha: '123456'
    });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
  expect(response.body.usuario.email).toBe('admin1@test.com');
});
```

---

### **2. Testes de Isolamento Multi-Tenant** (`multi-tenant.test.js`)

#### **Isolamento de Produtos**
- ✅ Empresa 1 vê apenas seus produtos
- ✅ Empresa 2 vê apenas seus produtos
- ✅ Empresa 1 NÃO acessa produtos da Empresa 2
- ✅ Empresa 2 NÃO acessa produtos da Empresa 1

#### **Proteção contra Modificação Cruzada**
- ✅ Empresa 1 NÃO atualiza produtos da Empresa 2
- ✅ Empresa 2 NÃO deleta produtos da Empresa 1
- ✅ Empresa pode modificar seus próprios produtos

#### **Criação de Dados**
- ✅ Produtos vinculados à empresa correta
- ✅ Dados criados não são visíveis para outras empresas

#### **Isolamento de Usuários**
- ✅ Cada empresa vê apenas seus usuários

#### **Busca por Código de Barras**
- ✅ Busca isolada por empresa

**Exemplo de Teste:**
```javascript
test('Empresa 1 NÃO deve acessar produto da Empresa 2', async () => {
  const response = await request(app)
    .get(`/api/produtos/${produto3.id}`)
    .set('Authorization', `Bearer ${tokenEmpresa1}`);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('error');
});
```

---

### **3. Testes de Segurança** (`security.test.js`)

#### **Rate Limiting**
- ✅ Bloqueio após muitas tentativas de login

#### **Proteção XSS**
- ✅ Sanitização de scripts maliciosos

#### **Headers de Segurança**
- ✅ Headers do Helmet configurados
- ✅ Content-Security-Policy ativo
- ✅ X-Powered-By removido

#### **Validação de Inputs**
- ✅ Rejeição de email inválido
- ✅ Rejeição de senha muito curta

#### **Proteção de Dados Sensíveis**
- ✅ Senha não retornada nas respostas
- ✅ Dados sensíveis não expostos

#### **CORS**
- ✅ Headers CORS configurados

**Exemplo de Teste:**
```javascript
test('Deve sanitizar input com script malicioso', async () => {
  const response = await request(app)
    .post('/api/produtos')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: '<script>alert("XSS")</script>Produto',
      // ... outros campos
    });

  expect(response.status).toBe(201);
  expect(response.body.produto.nome).not.toContain('<script>');
});
```

---

## 📊 Coverage Report

Após executar `npm test -- --coverage`, você verá um relatório como:

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.23 |    78.45 |   82.11 |   86.34 |
 controllers/       |   88.12 |    81.23 |   85.45 |   89.01 |
  authController.js |   92.34 |    85.67 |   90.12 |   93.45 |
  produtosController|   84.56 |    77.89 |   81.23 |   85.67 |
 middlewares/       |   91.23 |    87.45 |   89.12 |   92.34 |
  auth.js           |   95.67 |    92.34 |   93.45 |   96.78 |
--------------------|---------|----------|---------|---------|
```

---

## 🎯 Metas de Coverage

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

---

## 🔧 Configuração do Jest

O arquivo `jest.config.js` está configurado com:

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/database/seed.js'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  verbose: true,
  forceExit: true,
  testTimeout: 10000
};
```

---

## 🧩 Dependências de Teste

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

- **Jest:** Framework de testes
- **Supertest:** Testes de API HTTP

---

## 📝 Boas Práticas

### **1. Isolamento de Testes**
Cada teste deve ser independente e não depender de outros:

```javascript
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Limpa banco
  // Cria dados de teste
});

afterAll(async () => {
  await sequelize.close(); // Fecha conexão
});
```

### **2. Nomenclatura Clara**
```javascript
describe('Isolamento de Produtos', () => {
  test('Empresa 1 deve ver apenas seus 2 produtos', async () => {
    // ...
  });
});
```

### **3. Assertions Específicas**
```javascript
expect(response.status).toBe(200);
expect(response.body.produtos).toHaveLength(2);
expect(response.body.produtos[0].nome).toBe('Dipirona 500mg');
```

### **4. Testes de Casos de Erro**
```javascript
test('Deve retornar erro com senha incorreta', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@test.com', senha: 'errada' });

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('error');
});
```

---

## 🐛 Debugging de Testes

### **Executar teste específico com logs**
```bash
npm test -- auth.test.js --verbose
```

### **Debugar com Node Inspector**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Depois abra `chrome://inspect` no Chrome.

---

## 🚦 CI/CD Integration

### **GitHub Actions**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
```

---

## 📈 Próximos Passos

### **Testes a Adicionar:**
- [ ] Testes de vendas
- [ ] Testes de estoque
- [ ] Testes de relatórios
- [ ] Testes de 2FA
- [ ] Testes de performance
- [ ] Testes E2E com Playwright

---

## 🎓 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## ✅ Checklist de Testes

Antes de fazer deploy:

- [ ] Todos os testes passando
- [ ] Coverage > 80%
- [ ] Testes de isolamento multi-tenant OK
- [ ] Testes de segurança OK
- [ ] Testes de autenticação OK
- [ ] Sem warnings no console
- [ ] Documentação atualizada

---

**Documentação criada em:** 07/01/2026  
**Versão:** 1.0.0  
**Status:** ✅ Implementado
