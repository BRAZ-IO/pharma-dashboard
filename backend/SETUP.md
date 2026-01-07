# 🚀 Setup Rápido do Backend

## 1️⃣ Instalar Dependências

```bash
cd backend
npm install
```

## 2️⃣ Criar Banco de Dados

Abra o PostgreSQL (pgAdmin ou terminal) e execute:

```sql
CREATE DATABASE pharma_dashboard;
```

## 3️⃣ Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
copy .env.example .env
```

O arquivo `.env` já está configurado com:
- **Usuário:** root
- **Senha:** root
- **Banco:** pharma_dashboard

## 4️⃣ Popular Banco com Dados de Teste

```bash
npm run seed
```

Isso vai criar:
- 3 usuários (admin, gerente, funcionário)
- 5 produtos de exemplo
- Estoque para cada produto

## 5️⃣ Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:5000**

## ✅ Testar API

Abra o navegador ou Postman e acesse:

```
http://localhost:5000
```

Você deve ver:
```json
{
  "message": "Pharma Dashboard API",
  "version": "1.0.0",
  "status": "running"
}
```

## 🔐 Fazer Login

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Body (JSON):**
```json
{
  "email": "admin@pharma.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "nome": "Administrador",
    "email": "admin@pharma.com",
    "role": "admin"
  }
}
```

## 📝 Credenciais de Teste

| Tipo | Email | Senha | Role |
|------|-------|-------|------|
| Admin | admin@pharma.com | 123456 | admin |
| Gerente | joao@pharma.com | 123456 | gerente |
| Funcionário | maria@pharma.com | 123456 | funcionario |

## 🐛 Problemas Comuns

### Erro de conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme usuário e senha no `.env`
- Verifique se o banco `pharma_dashboard` foi criado

### Porta 5000 já em uso
- Mude a porta no `.env`: `PORT=5001`

### Erro ao instalar dependências
- Use Node.js 16 ou superior
- Tente: `npm install --legacy-peer-deps`

## 📡 Endpoints Principais

- `GET /api/health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/usuarios` - Listar usuários (requer auth)
- `GET /api/produtos` - Listar produtos (requer auth)

## 🔄 Próximos Passos

1. ✅ Backend rodando
2. 🔜 Conectar frontend com backend
3. 🔜 Implementar mais endpoints (vendas, estoque, dashboard)
