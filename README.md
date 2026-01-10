# 🏥 Pharma Dashboard - Sistema de Gestão Farmacêutica

Um dashboard completo para gestão de farmácias com análise de vendas, controle de estoque e métricas em tempo real.

## 📋 Visão Geral

O Pharma Dashboard é uma aplicação web full-stack desenvolvida para ajudar farmácias a gerenciar suas operações diárias, incluindo vendas, produtos, clientes e fornecedores, com visualizações de dados intuitivas e relatórios detalhados.

## 🏗️ Arquitetura do Sistema

### Estrutura do Projeto
```
pharma-dashboard/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── models/         # Modelos Sequelize (PostgreSQL)
│   │   ├── routes/         # Endpoints da API
│   │   ├── middlewares/    # Autenticação e validação
│   │   └── database/       # Configuração e seeds
│   └── package.json
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── pages/         # Páginas principais
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── services/      # Clientes HTTP
│   │   └── styles/        # CSS e estilização
│   └── package.json
└── README.md
```

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de senhas

### Frontend
- **React** - Biblioteca de componentes UI
- **JavaScript ES6+** - Linguagem de programação
- **CSS3** - Estilização
- **Axios** - Cliente HTTP para requisições API

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL 13+ instalado e rodando
- Git para controle de versão

### 1. Configuração do Banco de Dados
```bash
# Criar banco de dados
createdb pharma_dashboard

# Configurar variáveis de ambiente no backend
cd backend
cp .env.example .env
# Editar .env com suas credenciais do PostgreSQL
```

### 2. Instalação e Execução do Backend
```bash
cd backend
npm install
npm run seed      # Popular banco com dados de teste
npm start         # Iniciar servidor (porta 5000)
```

### 3. Instalação e Execução do Frontend
```bash
cd frontend
npm install
npm start         # Iniciar aplicação (porta 3000)
```

### 4. Acesso à Aplicação
Abra `http://localhost:3000` no navegador e faça login com:
- **Email:** admin@pharma.com
- **Senha:** 123456

## 📊 Funcionalidades Principais

### Dashboard Principal
- **Estatísticas em tempo real**: Total de vendas, produtos, clientes ativos
- **Gráfico de análise de vendas**: Visualização por 7 dias, 30 dias ou 12 meses
- **Vendas recentes**: Lista das últimas transações
- **Alertas de estoque**: Produtos com baixo estoque

### Gestão de Vendas
- **Registro de vendas**: Criar novas vendas com múltiplos itens
- **Histórico completo**: Consultar vendas anteriores
- **Análise por período**: Relatórios detalhados por data
- **Formas de pagamento**: Suporte a múltiplos métodos

### Controle de Estoque
- **Cadastro de produtos**: Informações detalhadas e preços
- **Controle de níveis**: Estoque mínimo e máximo
- **Alertas automáticos**: Avisos de produtos com estoque baixo
- **Integração com vendas**: Atualização automática do estoque

### Gestão de Clientes e Fornecedores
- **Cadastro completo**: Dados pessoais e informações de contato
- **Histórico de compras**: Registro de transações anteriores
- **Gestão de fornecedores**: Controle de produtos e pedidos

## 🔐 Sistema de Autenticação

### Fluxo de Login
1. **Usuário insere email e senha**
2. **Backend valida credenciais** no banco de dados
3. **Geração de token JWT** com dados do usuário
4. **Armazenamento no frontend** para requisições futuras
5. **Middleware de autenticação** valida token a cada requisição

### Níveis de Acesso
- **Admin**: Acesso completo a todas as funcionalidades
- **Gerente**: Gestão de vendas e produtos
- **Funcionário**: Registro de vendas básico

## 📡 Arquitetura da API

### Endpoints Principais

#### Autenticação
```
POST /api/auth/login      - Login de usuários
POST /api/auth/logout     - Logout
```

#### Dashboard
```
GET /api/usuarios         - Estatísticas de usuários
GET /api/produtos        - Estatísticas de produtos
GET /api/clientes         - Estatísticas de clientes
GET /api/fornecedores    - Estatísticas de fornecedores
```

#### Vendas
```
GET /api/vendas                    - Listar vendas
POST /api/vendas                   - Criar nova venda
GET /api/vendas/analise/periodo    - Análise por período
GET /api/vendas/recentes           - Vendas recentes
GET /api/vendas/:id                - Buscar venda específica
```

#### Produtos
```
GET /api/produtos        - Listar produtos
POST /api/produtos       - Criar produto
PUT /api/produtos/:id    - Atualizar produto
DELETE /api/produtos/:id - Excluir produto
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### Empresa
- Informações da farmácia
- Configurações do sistema
- Multi-tenant (múltiplas empresas)

#### Usuários
- Dados pessoais e credenciais
- Níveis de permissão
- Vinculação com empresa

#### Produtos
- Informações básicas (nome, código, descrição)
- Precificação (custo, venda, margem)
- Controle de estoque (mínimo, máximo, atual)

#### Vendas
- Dados da transação (data, valor, forma pagamento)
- Vinculação com cliente e vendedor
- Múltiplos itens por venda

#### Itens de Venda
- Produto específico
- Quantidade e preço unitário
- Descontos e subtotal

## 🔄 Fluxo de Dados

### 1. Carregamento do Dashboard
```
Frontend → Backend → Database
    ↓
1. Verificar token JWT
2. Buscar estatísticas (usuários, produtos, clientes)
3. Buscar análise de vendas (período selecionado)
4. Buscar vendas recentes
5. Retornar dados formatados
6. Renderizar gráficos e cards
```

### 2. Registro de Venda
```
Frontend → Backend → Database
    ↓
1. Validar dados da venda
2. Verificar estoque disponível
3. Criar registro principal (Venda)
4. Criar itens da venda (ItemVenda)
5. Atualizar estoque dos produtos
6. Retornar venda completa
```

### 3. Análise de Vendas
```
Frontend → Backend → Database
    ↓
1. Definir período (7/30 dias ou 12 meses)
2. Buscar vendas do período
3. Agrupar por data (JavaScript)
4. Calcular totais e médias
5. Formatar para gráfico
6. Retornar dados estruturados
```

## 🎯 Padrões e Boas Práticas

### Backend
- **Middleware de autenticação** em todas as rotas protegidas
- **Validação de dados** de entrada
- **Tratamento de erros** centralizado
- **Separação de responsabilidades** (routes, controllers, models)
- **Multi-tenant** com empresa_id em todas as tabelas

### Frontend
- **Componentização** reutilizável
- **Gerenciamento de estado** local
- **Tratamento de erros** amigável
- **Loading states** para melhor UX
- **Responsive design** para múltiplos dispositivos

### Banco de Dados
- **Relacionamentos** bem definidos
- **Índices** para performance
- **Constraints** para integridade
- **Migrations** para versionamento
- **Seeds** para ambiente de desenvolvimento

## 🐛 Solução de Problemas Comuns

### Erros Frequentes

#### 1. "Token não fornecido"
- **Causa**: Token JWT ausente ou inválido
- **Solução**: Fazer login novamente

#### 2. "Erro de conexão com banco"
- **Causa**: PostgreSQL não rodando ou credenciais incorretas
- **Solução**: Verificar serviço PostgreSQL e arquivo .env

#### 3. "Gráfico não carrega"
- **Causa**: Dados insuficientes ou erro na API
- **Solução**: Verificar console e executar `npm run seed`

#### 4. "Estoque não atualiza"
- **Causa**: Falha na transação de venda
- **Solução**: Verificar logs e retry da operação

## 🚀 Implantação (Deploy)

### Produção
1. **Configurar variáveis de ambiente**
2. **Build do frontend**: `npm run build`
3. **Configurar servidor web** (Nginx/Apache)
4. **Configurar SSL** (HTTPS)
5. **Monitoramento e logs**

### Docker (Opcional)
```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

## 📈 Métricas e Monitoramento

### KPIs Principais
- **Faturamento total** por período
- **Ticket médio** das vendas
- **Produtos mais vendidos**
- **Taxa de conversão**
- **Nível de estoque**

### Logs Importantes
- **Acessos e autenticações**
- **Transações de vendas**
- **Erros da API**
- **Performance das queries**

## 🔄 Futuras Melhorias

### Curto Prazo
- [ ] Relatórios PDF exportáveis
- [ ] Notificações por email
- [ ] Integração com sistemas de pagamento
- [ ] Backup automático

### Médio Prazo
- [ ] Aplicação mobile (React Native)
- [ ] Integração com balanças
- [ ] Sistema de comissões
- [ ] Chat interno

### Longo Prazo
- [ ] Inteligência artificial para previsões
- [ ] Multi-lojas
- [ ] API pública para integrações
- [ ] Sistema de assinaturas

## 📞 Suporte e Contato

### Documentação
- **API Docs**: `/api/docs` (quando disponível)
- **Database Schema**: Ver models/ para detalhes

### Comunidade
- **Issues**: Reportar bugs no GitHub
- **Features**: Solicitar novas funcionalidades
- **Contribuições**: Pull requests bem-vindos

---

## 📝 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 🙏 Agradecimentos

Agradecimentos especiais a toda equipe que contribuiu para o desenvolvimento deste projeto de gestão farmacêutica.

---

**Desenvolvido com ❤️ para a saúde da comunidade**