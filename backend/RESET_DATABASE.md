# 🔄 Resetar Banco de Dados

## Problema
Após adicionar o sistema multi-tenant, o banco precisa ser recriado do zero.

## Solução Rápida

### 1. Deletar e Recriar o Banco

Abra o **pgAdmin** ou **psql** e execute:

```sql
-- Desconectar todos os usuários
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'pharma_dashboard'
  AND pid <> pg_backend_pid();

-- Deletar banco
DROP DATABASE IF EXISTS pharma_dashboard;

-- Recriar banco
CREATE DATABASE pharma_dashboard;
```

### 2. Executar Seed Novamente

```bash
npm run seed
```

### 3. Iniciar Servidor

```bash
npm run dev
```

---

## ✅ O que o Seed vai Criar

### **2 Empresas (Farmácias):**
1. **Drogasil** - CNPJ: 12.345.678/0001-90
2. **Pague Menos** - CNPJ: 98.765.432/0001-10

### **Usuários por Empresa:**

**Drogasil:**
- admin@drogasil.com / 123456 (Admin)
- gerente@drogasil.com / 123456 (Gerente)

**Pague Menos:**
- admin@paguemenos.com / 123456 (Admin)
- gerente@paguemenos.com / 123456 (Gerente)

### **Produtos por Empresa:**
- Cada farmácia terá seus próprios produtos
- Mesmo código de barras pode existir em empresas diferentes

---

## 🧪 Testar Isolamento

### 1. Login como Drogasil
```bash
POST /api/auth/login
{
  "email": "admin@drogasil.com",
  "senha": "123456"
}
```

### 2. Listar Produtos
```bash
GET /api/produtos
Authorization: Bearer {token_drogasil}
```
**Resultado:** Vê apenas produtos da Drogasil

### 3. Login como Pague Menos
```bash
POST /api/auth/login
{
  "email": "admin@paguemenos.com",
  "senha": "123456"
}
```

### 4. Listar Produtos
```bash
GET /api/produtos
Authorization: Bearer {token_paguemenos}
```
**Resultado:** Vê apenas produtos da Pague Menos

---

## 🔒 Garantia de Isolamento

- ✅ Cada farmácia vê apenas seus dados
- ✅ Impossível acessar dados de outra farmácia
- ✅ Filtro automático por empresa_id em todas as queries
