# ⚙️ Configuração Rápida do .env

## 🚨 IMPORTANTE: Criar arquivo .env

O arquivo `.env` NÃO existe ainda. Você precisa criá-lo manualmente.

### Passo 1: Criar o arquivo .env

Na pasta `backend`, crie um arquivo chamado `.env` (sem extensão) com o seguinte conteúdo:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharma_dashboard
DB_USER=postgres
DB_PASSWORD=root

# JWT Configuration
JWT_SECRET=pharma_dashboard_secret_key_2026_change_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Passo 2: Verificar credenciais do PostgreSQL

Certifique-se de que:
- ✅ PostgreSQL está rodando
- ✅ Usuário: `postgres`
- ✅ Senha: `root`
- ✅ Banco `pharma_dashboard` foi criado

### Passo 3: Criar banco de dados

Abra o pgAdmin ou psql e execute:

```sql
CREATE DATABASE pharma_dashboard;
```

### Passo 4: Testar conexão

```bash
npm run dev
```

Você deve ver:
```
✅ Conexão com PostgreSQL estabelecida com sucesso!
🚀 Servidor rodando na porta 5000
```

## 🐛 Problemas Comuns

### Erro: "client password must be a string"
- ✅ RESOLVIDO: Código atualizado para converter senha em string
- Certifique-se de que o arquivo `.env` existe
- Verifique se não há espaços extras nas variáveis

### Erro: "database does not exist"
- Execute: `CREATE DATABASE pharma_dashboard;` no PostgreSQL

### Erro: "password authentication failed"
- Verifique a senha do usuário `postgres`
- Tente: `ALTER USER postgres WITH PASSWORD 'root';`

## ✅ Checklist

- [ ] Arquivo `.env` criado na pasta `backend`
- [ ] Credenciais corretas (postgres/root)
- [ ] PostgreSQL rodando
- [ ] Banco `pharma_dashboard` criado
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm run dev`)
