# 📚 Documentação da API com Swagger

## 🎯 O que é Swagger?

Swagger é uma ferramenta que gera **documentação interativa** da sua API automaticamente. Com ela você pode:

- ✅ Ver todos os endpoints disponíveis
- ✅ Testar as rotas diretamente no navegador
- ✅ Ver exemplos de requisições e respostas
- ✅ Entender os parâmetros necessários
- ✅ Testar autenticação JWT

## 🚀 Como Acessar

Com o servidor rodando, acesse:

```
http://localhost:5000/api/docs
```

## 🔐 Como Usar Autenticação

### 1. Fazer Login

1. Abra o Swagger: `http://localhost:5000/api/docs`
2. Encontre o endpoint `POST /api/auth/login`
3. Clique em **"Try it out"**
4. Preencha o body:
   ```json
   {
     "email": "admin@pharma.com",
     "senha": "123456"
   }
   ```
5. Clique em **"Execute"**
6. Copie o **token** da resposta

### 2. Autenticar no Swagger

1. Clique no botão **"Authorize"** (cadeado) no topo da página
2. Cole o token no campo **"Value"**
3. Clique em **"Authorize"**
4. Agora você pode testar todas as rotas protegidas!

## 📋 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar usuário
- `GET /api/auth/me` - Dados do usuário logado 🔒
- `POST /api/auth/refresh` - Renovar token 🔒

### Usuários
- `GET /api/usuarios` - Listar usuários 🔒
- `GET /api/usuarios/:id` - Buscar usuário 🔒
- `POST /api/usuarios` - Criar usuário 🔒
- `PUT /api/usuarios/:id` - Atualizar usuário 🔒
- `DELETE /api/usuarios/:id` - Deletar usuário 🔒
- `PATCH /api/usuarios/:id/status` - Alterar status 🔒

### Produtos
- `GET /api/produtos` - Listar produtos 🔒
- `GET /api/produtos/:id` - Buscar produto 🔒
- `GET /api/produtos/codigo-barras/:codigo` - Buscar por código 🔒
- `POST /api/produtos` - Criar produto 🔒
- `PUT /api/produtos/:id` - Atualizar produto 🔒
- `DELETE /api/produtos/:id` - Deletar produto 🔒

🔒 = Requer autenticação

## 🧪 Exemplo de Teste Completo

### 1. Login
```bash
POST /api/auth/login
Body: {
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
    "id": "uuid-aqui",
    "nome": "Administrador",
    "email": "admin@pharma.com",
    "role": "admin"
  }
}
```

### 2. Listar Produtos (com token)
```bash
GET /api/produtos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
{
  "produtos": [
    {
      "id": "uuid",
      "nome": "Dipirona 500mg",
      "preco_venda": "12.90",
      "categoria": "Medicamento"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## 💡 Dicas

### Filtros e Paginação
```
GET /api/produtos?page=1&limit=10&search=dipirona&categoria=Medicamento
```

### Testar Diferentes Usuários
- **Admin:** admin@pharma.com / 123456
- **Gerente:** joao@pharma.com / 123456
- **Funcionário:** maria@pharma.com / 123456

### Ver JSON do Swagger
```
http://localhost:5000/api/docs/json
```

## 🎨 Recursos do Swagger UI

- **Try it out** - Testar endpoint diretamente
- **Authorize** - Adicionar token JWT
- **Schemas** - Ver estrutura dos objetos
- **Responses** - Ver exemplos de respostas
- **Parameters** - Ver parâmetros obrigatórios/opcionais

## 🔧 Personalização

O Swagger está configurado em:
- `src/config/swagger.js` - Configuração geral
- `src/routes/*.js` - Documentação dos endpoints

Para adicionar documentação a um novo endpoint:

```javascript
/**
 * @swagger
 * /api/seu-endpoint:
 *   get:
 *     summary: Descrição do endpoint
 *     tags: [Nome da Tag]
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/seu-endpoint', controller.metodo);
```

## 📱 Alternativas ao Swagger

Se preferir, você também pode usar:
- **Postman** - Importar coleção
- **Insomnia** - Cliente REST
- **Thunder Client** - Extensão do VS Code
- **cURL** - Linha de comando

## 🌐 Exportar Documentação

Para compartilhar a documentação:

1. Acesse: `http://localhost:5000/api/docs/json`
2. Copie o JSON
3. Importe em: https://editor.swagger.io

---

**Pronto! Agora você tem documentação profissional da sua API! 🚀**
