// Route configuration constants
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  HOME: '/',
  
  // Protected routes (under /app)
  APP: '/app',
  DASHBOARD: '/app/dashboard',
  PDV: '/app/pdv',
  PRODUTOS: '/app/produtos',
  ESTOQUE: '/app/estoque',
  USUARIOS: '/app/usuarios',
  CONFIGURACOES: '/app/configuracoes',
  CLIENTES: '/app/clientes',
  FORNECEDORES: '/app/fornecedores',
  FLUXO_CAIXA: '/app/fluxo-caixa',
};

// Route metadata for navigation
export const ROUTE_METADATA = [
  {
    path: ROUTES.DASHBOARD,
    name: 'Dashboard',
    icon: '📊',
    description: 'Visão geral',
    section: 'Principal'
  },
  {
    path: ROUTES.PDV,
    name: 'PDV',
    icon: '🧾',
    description: 'Ponto de Venda',
    section: 'Principal'
  },
  {
    path: ROUTES.PRODUTOS,
    name: 'Produtos',
    icon: '💊',
    badge: '1.2k',
    description: 'Catálogo de medicamentos',
    section: 'Gestão'
  },
  {
    path: ROUTES.ESTOQUE,
    name: 'Estoque',
    icon: '📦',
    badge: '23',
    badgeType: 'warning',
    description: 'Controle de inventário',
    section: 'Gestão'
  },
  {
    path: ROUTES.USUARIOS,
    name: 'Usuários',
    icon: '👥',
    badge: '12',
    description: 'Gerenciar usuários',
    section: 'Sistema'
  },
  {
    path: ROUTES.CONFIGURACOES,
    name: 'Configurações',
    icon: '⚙️',
    description: 'Configurações do sistema',
    section: 'Sistema'
  },
  {
    path: ROUTES.CLIENTES,
    name: 'Clientes',
    icon: '👤',
    description: 'Gestão de clientes',
    section: 'Gestão'
  },
  {
    path: ROUTES.FORNECEDORES,
    name: 'Fornecedores',
    icon: '🏢',
    description: 'Gestão de fornecedores',
    section: 'Gestão'
  },
  {
    path: ROUTES.FLUXO_CAIXA,
    name: 'Fluxo de Caixa',
    icon: '💰',
    description: 'Controle financeiro',
    section: 'Financeiro'
  }
];

export default ROUTES;
