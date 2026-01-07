# 💊 Pharma Dashboard

Sistema completo de gestão para farmácias com arquitetura multi-tenant, desenvolvido com React e Node.js.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Fluxo do Sistema](#fluxo-do-sistema)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Multi-Tenant](#multi-tenant)
- [Segurança](#segurança)
- [Contribuindo](#contribuindo)

---

## 🎯 Sobre o Projeto

O **Pharma Dashboard** é um sistema de gestão completo para farmácias que permite:

- ✅ Gestão de produtos e medicamentos
- ✅ Controle de estoque com alertas
- ✅ Sistema de vendas (PDV)
- ✅ Gestão de usuários e permissões
- ✅ Isolamento multi-tenant (múltiplas farmácias)
- ✅ Autenticação JWT
- ✅ Documentação interativa com Swagger
- ✅ Interface moderna com tema dark

---

## 🚀 Tecnologias

### Frontend
- **React** 18.x - Biblioteca JavaScript
- **React Router** - Navegação SPA
- **CSS3** - Estilização customizada
- **Axios** - Cliente HTTP

### Backend
- **Node.js** 16+ - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Swagger** - Documentação da API

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │Dashboard │  │Produtos  │  │Estoque   │  │Usuários ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │   PDV    │  │  Perfil  │  │  Ajuda   │  │  Login  ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js/Express)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Middlewares                          │  │
│  │  • Auth (JWT)  • Tenant  • Validation  • CORS   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Routes & Controllers                 │  │
│  │  • Auth  • Usuarios  • Produtos  • Vendas       │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Models (Sequelize ORM)              │  │
│  │  • Empresa  • Usuario  • Produto  • Estoque     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │empresas  │  │usuarios  │  │produtos  │  │estoque  ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│  ┌──────────┐  ┌──────────┐                            │
│  │vendas    │  │itens_venda│                           │
│  └──────────┘  └──────────┘                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo do Sistema

### 1️⃣ **Fluxo de Autenticação**

```
┌─────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│ Usuário │─────▶│  Login  │─────▶│  Backend │─────▶│PostgreSQL│
└─────────┘      └─────────┘      └──────────┘      └──────────┘
     │                                   │
     │           ◀─────────────────────  │
     │           Token JWT + User Data   │
     │                                   │
     ▼                                   ▼
┌─────────────────────────────────────────────────────┐
│  Token armazenado no localStorage                   │
│  Todas as requisições incluem: Authorization Bearer │
└─────────────────────────────────────────────────────┘
```

**Passos:**
1. Usuário envia email e senha
2. Backend valida credenciais no banco
3. Backend gera token JWT com `empresa_id`, `user_id`, `role`
4. Frontend armazena token no `localStorage`
5. Todas as requisições incluem o token no header

---

### 2️⃣ **Fluxo Multi-Tenant (Isolamento de Dados)**

```
┌──────────────────────────────────────────────────────┐
│              Requisição com Token JWT                 │
│  Authorization: Bearer eyJhbGc...                    │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│          Middleware de Autenticação                   │
│  1. Valida token JWT                                 │
│  2. Extrai empresa_id do token                       │
│  3. Adiciona req.empresaId ao request                │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│              Controller (ex: Produtos)                │
│  WHERE empresa_id = req.empresaId  ← FILTRO AUTOMÁTICO│
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│              Banco de Dados                           │
│  SELECT * FROM produtos                              │
│  WHERE empresa_id = 'uuid-farmacia-a'                │
│  ✅ Retorna apenas produtos da Farmácia A            │
└──────────────────────────────────────────────────────┘
```

**Garantia de Isolamento:**
- ✅ Cada empresa vê apenas seus dados
- ✅ Filtro automático por `empresa_id` em todas as queries
- ✅ Impossível acessar dados de outra empresa

---

### 3️⃣ **Fluxo de Cadastro de Produto**

```
Frontend                Backend              Database
   │                       │                     │
   │  POST /api/produtos   │                     │
   │  + Token JWT          │                     │
   ├──────────────────────▶│                     │
   │                       │                     │
   │                       │ 1. Valida token     │
   │                       │ 2. Extrai empresa_id│
   │                       │                     │
   │                       │ INSERT INTO produtos│
   │                       │ (empresa_id, ...)   │
   │                       ├────────────────────▶│
   │                       │                     │
   │                       │◀────────────────────│
   │                       │ Produto criado      │
   │                       │                     │
   │                       │ INSERT INTO estoque │
   │                       │ (empresa_id, ...)   │
   │                       ├────────────────────▶│
   │                       │                     │
   │◀──────────────────────│                     │
   │ { produto, estoque }  │                     │
   │                       │                     │
```

**Passos:**
1. Frontend envia dados do produto + token JWT
2. Backend valida token e extrai `empresa_id`
3. Backend cria produto com `empresa_id` automático
4. Backend cria registro de estoque inicial
5. Frontend recebe confirmação

---

### 4️⃣ **Fluxo de Venda (PDV)**

```
1. Buscar Produto
   ├─ Escanear código de barras
   ├─ Backend busca produto WHERE empresa_id = req.empresaId
   └─ Retorna produto + estoque disponível

2. Adicionar ao Carrinho
   ├─ Validar estoque disponível
   ├─ Calcular subtotal
   └─ Atualizar carrinho (frontend)

3. Finalizar Venda
   ├─ POST /api/vendas
   ├─ Backend cria registro de venda
   ├─ Backend cria itens_venda
   ├─ Backend atualiza estoque (subtrai quantidade)
   └─ Retorna confirmação + número da venda

4. Emitir NFC-e (Futuro)
   └─ Integração com SEFAZ
```

---

### 5️⃣ **Fluxo de Permissões (RBAC)**

```
┌─────────────────────────────────────────────────────┐
│                  Roles (Papéis)                      │
├─────────────────────────────────────────────────────┤
│  admin      → Acesso total                          │
│  gerente    → Gerenciar produtos, vendas, usuários  │
│  funcionario→ Apenas vendas e consultas             │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│          Middleware checkRole([roles])               │
│  if (!roles.includes(req.userRole))                 │
│    return 403 Forbidden                             │
└─────────────────────────────────────────────────────┘
```

**Exemplo:**
```javascript
// Apenas admin e gerente podem criar produtos
router.post('/produtos', 
  authMiddleware, 
  checkRole('admin', 'gerente'), 
  produtosController.criar
);
```

---

## 📦 Instalação

### Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL 12+ instalado
- Git

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/pharma-dashboard.git
cd pharma-dashboard
```

### 2. Instalar Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## ⚙️ Configuração

### 1. Configurar Banco de Dados

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE pharma_dashboard;
```

### 2. Configurar Variáveis de Ambiente

**Backend:** Copie `.env.example` para `.env`

```bash
cd backend
copy .env.example .env
```

Edite o `.env`:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=pharma_dashboard
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

### 3. Popular Banco com Dados de Teste

```bash
cd backend
npm run seed
```

---

## 🎮 Uso

### Iniciar Backend

```bash
cd backend
npm run dev
```

Servidor rodando em: `http://localhost:5000`

### Iniciar Frontend

```bash
cd frontend
npm start
```

Aplicação rodando em: `http://localhost:3000`

### Acessar Documentação da API (Swagger)

```
http://localhost:5000/api/docs
```

### Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@pharma.com | 123456 |
| Gerente | gerente@pharma.com | 123456 |
| Funcionário | funcionario@pharma.com | 123456 |

---

## 📁 Estrutura do Projeto

```
pharma-dashboard/
├── frontend/                 # Aplicação React
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   └── NavbarBootstrap.js
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Produtos.js
│   │   │   ├── Estoque.js
│   │   │   ├── PDV.js
│   │   │   ├── Usuarios.js
│   │   │   ├── Perfil.js
│   │   │   └── Ajuda.js
│   │   ├── routes/          # Configuração de rotas
│   │   │   ├── AppRoutes.js
│   │   │   └── routeConfig.js
│   │   ├── styles/          # Estilos globais
│   │   └── App.js
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── config/          # Configurações
│   │   │   ├── database.js
│   │   │   ├── env.js
│   │   │   └── swagger.js
│   │   ├── controllers/     # Lógica de negócio
│   │   │   ├── authController.js
│   │   │   ├── usuariosController.js
│   │   │   └── produtosController.js
│   │   ├── models/          # Models do Sequelize
│   │   │   ├── Empresa.js
│   │   │   ├── Usuario.js
│   │   │   ├── Produto.js
│   │   │   ├── Estoque.js
│   │   │   ├── Venda.js
│   │   │   ├── ItemVenda.js
│   │   │   └── index.js
│   │   ├── routes/          # Rotas da API
│   │   │   ├── auth.js
│   │   │   ├── usuarios.js
│   │   │   ├── produtos.js
│   │   │   ├── swagger.js
│   │   │   └── index.js
│   │   ├── middlewares/     # Middlewares
│   │   │   ├── auth.js
│   │   │   ├── tenant.js
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── database/        # Scripts de banco
│   │   │   ├── seed.js
│   │   │   └── reset.js
│   │   ├── app.js           # Configuração Express
│   │   └── server.js        # Inicialização
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
├── README.md
└── SECURITY.md
```

---

## 🔌 API Endpoints

### Autenticação

```
POST   /api/auth/login       # Login
POST   /api/auth/register    # Registro
GET    /api/auth/me          # Dados do usuário logado 🔒
POST   /api/auth/refresh     # Renovar token 🔒
```

### Usuários

```
GET    /api/usuarios         # Listar usuários 🔒
GET    /api/usuarios/:id     # Buscar usuário 🔒
POST   /api/usuarios         # Criar usuário 🔒 (admin/gerente)
PUT    /api/usuarios/:id     # Atualizar usuário 🔒 (admin/gerente)
DELETE /api/usuarios/:id     # Deletar usuário 🔒 (admin)
PATCH  /api/usuarios/:id/status  # Alterar status 🔒 (admin/gerente)
```

### Produtos

```
GET    /api/produtos         # Listar produtos 🔒
GET    /api/produtos/:id     # Buscar produto 🔒
GET    /api/produtos/codigo-barras/:codigo  # Buscar por código 🔒
POST   /api/produtos         # Criar produto 🔒 (admin/gerente)
PUT    /api/produtos/:id     # Atualizar produto 🔒 (admin/gerente)
DELETE /api/produtos/:id     # Deletar produto 🔒 (admin)
```

🔒 = Requer autenticação

---

## 🏢 Multi-Tenant

O sistema implementa isolamento completo entre empresas:

### Como Funciona

1. **Cada empresa tem um `empresa_id` único**
2. **Todos os dados incluem `empresa_id`**
3. **Filtro automático em todas as queries**

```javascript
// Exemplo: Listar produtos
const produtos = await Produto.findAll({
  where: {
    empresa_id: req.empresaId  // ← Filtro automático
  }
});
```

### Garantias

- ✅ Farmácia A **nunca** vê dados da Farmácia B
- ✅ Mesmo código de barras pode existir em empresas diferentes
- ✅ Isolamento em nível de banco de dados

---

## 🔒 Segurança

### Implementações

- ✅ **Senhas criptografadas** com bcrypt (10 rounds)
- ✅ **JWT** para autenticação stateless
- ✅ **CORS** configurado
- ✅ **Helmet** para headers de segurança
- ✅ **Rate Limiting** (100 req/15min)
- ✅ **Validação de inputs** com express-validator
- ✅ **SQL Injection** protegido (Sequelize ORM)
- ✅ **XSS** protegido
- ✅ **.env** no .gitignore

### Boas Práticas

```javascript
// ❌ NUNCA faça isso
const senha = '123456';

// ✅ SEMPRE use variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET;
```

---

## 🧪 Testes

### Testar API com Swagger

1. Acesse: `http://localhost:5000/api/docs`
2. Faça login em `POST /api/auth/login`
3. Copie o token
4. Clique em **"Authorize"** e cole o token
5. Teste os endpoints

### Resetar Banco de Dados

```bash
cd backend
npm run reset
npm run seed
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para gestão de farmácias

---

## 📞 Suporte

- **Documentação:** `http://localhost:5000/api/docs`
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/pharma-dashboard/issues)

---

## 🎯 Roadmap

- [ ] Integração com NFC-e (SEFAZ)
- [ ] Relatórios avançados
- [ ] Dashboard com gráficos
- [ ] App mobile
- [ ] Integração com distribuidoras
- [ ] Sistema de fidelidade
- [ ] Controle de validade com alertas
- [ ] Backup automático

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**
