# Pharma Dashboard - Backend API

Backend da aplicação Pharma Dashboard desenvolvido com Node.js, Express e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas

## 📋 Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL 12+ instalado e rodando
- npm ou yarn

## 🔧 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharma_dashboard
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
```

3. **Criar banco de dados no PostgreSQL:**
```sql
CREATE DATABASE pharma_dashboard;
```

4. **Popular banco com dados de exemplo:**
```bash
npm run seed
```

## ▶️ Executar

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor estará rodando em: `http://localhost:5000`

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/refresh` - Renovar token

### Usuários
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/:id` - Buscar usuário
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário
- `PATCH /api/usuarios/:id/status` - Alterar status

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto
- `GET /api/produtos/codigo-barras/:codigo` - Buscar por código de barras
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer {token}
```

## 👥 Credenciais de Teste

Após executar o seed, você pode usar:

**Admin:**
- Email: `admin@pharma.com`
- Senha: `123456`

**Gerente:**
- Email: `joao@pharma.com`
- Senha: `123456`

**Funcionário:**
- Email: `maria@pharma.com`
- Senha: `123456`

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/         # Configurações
│   ├── controllers/    # Controllers
│   ├── models/         # Models do Sequelize
│   ├── routes/         # Rotas da API
│   ├── middlewares/    # Middlewares
│   ├── database/       # Seeds e migrations
│   ├── app.js          # Configuração do Express
│   └── server.js       # Inicialização do servidor
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testes

```bash
npm test
```

## 📝 Licença

MIT
