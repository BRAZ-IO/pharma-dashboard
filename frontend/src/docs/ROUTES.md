# Estrutura de Rotas - Pharma Dashboard

## Visão Geral

Este projeto utiliza uma estrutura de rotas centralizada e bem organizada para facilitar a manutenção e escalabilidade.

## Arquitetura

### 1. Configuração Centralizada (`src/routes/routeConfig.js`)

Todas as rotas são definidas em um arquivo central:

```javascript
export const ROUTES = {
  // Rotas Públicas
  LOGIN: '/login',
  SOBRE: '/sobre',
  HOME: '/',
  
  // Rotas Protegidas (sob /app)
  APP: '/app',
  DASHBOARD: '/app/dashboard',
  PDV: '/app/pdv',
  // ... outras rotas
};
```

### 2. Componente de Rotas (`src/routes/AppRoutes.js`)

Gerencia o roteamento da aplicação com:
- Rotas públicas (login, sobre)
- Rotas protegidas com autenticação
- Redirecionamentos padrão

### 3. Hook Personalizado (`src/hooks/useAppNavigation.js`)

Fornece funções de navegação semânticas:

```javascript
const { goToDashboard, goToLogin, goToProdutos } = useAppNavigation();
```

## Estrutura de URLs

- **Públicas:**
  - `/` → Redireciona para `/sobre`
  - `/login` → Página de login
  - `/sobre` → Página sobre (página inicial)

- **Protegidas:**
  - `/app/dashboard` → Dashboard principal
  - `/app/pdv` → Ponto de Venda
  - `/app/produtos` → Gestão de Produtos
  - `/app/estoque` → Controle de Estoque
  - `/app/usuarios` → Gestão de Usuários
  - `/app/configuracoes` → Configurações

## Fluxo de Autenticação

1. Usuário acessa `/` → Redirecionado para `/sobre`
2. Usuário clica em login → Navega para `/login`
3. Após login → Redirecionado para `/app/dashboard`
4. Rotas protegidas exigem autenticação via `ProtectedRoute`

## Benefícios

✅ **Manutenibilidade**: Rotas centralizadas facilitam alterações
✅ **Type Safety**: Constantes evitam erros de digitação
✅ **Semântica**: Funções de navegação descritivas
✅ **Escalabilidade**: Fácil adicionar novas rotas
✅ **Consistência**: Padrão uniforme em toda aplicação

## Adicionando Nova Rota

1. Adicione em `routeConfig.js`:
```javascript
NOVA_ROTA: '/app/nova-rota',
```

2. Adicione metadados em `ROUTE_METADATA`:
```javascript
{
  path: ROUTES.NOVA_ROTA,
  name: 'Nova Rota',
  icon: '🆕',
  description: 'Descrição da rota',
  section: 'Sistema'
}
```

3. Importe e adicione em `AppRoutes.js`:
```javascript
import NovaRota from '../pages/NovaRota';
// ...
<Route path="nova-rota" element={<NovaRota />} />
```

4. Use o hook de navegação:
```javascript
const { goToNovaRota } = useAppNavigation();
```
