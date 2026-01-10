// Configuração de seletores para testes de responsividade
// Baseado na estrutura real da aplicação

export const SELECTORS = {
  // Login
  login: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button:has-text("Entrar")'
  },

  // Dashboard
  dashboard: {
    title: 'h1:has-text("Dashboard")',
    statsCards: '.stat-card, .dashboard-card, .card',
    charts: '.chart-container, .chart, canvas',
    tables: 'table'
  },

  // PDV
  pdv: {
    // Scanner
    barcodeInput: 'input[placeholder*="Código de barras"], input[placeholder*="barcode"]',
    searchInput: 'input[placeholder*="Buscar produtos"], input[placeholder*="Buscar"]',
    scannerButton: 'button:has-text("Scanner"), button:has-text("Escanear")',
    
    // Carrinho
    cartSection: '.cart-section',
    cartHeader: '.cart-header',
    cartItems: '.cart-items',
    cartFooter: '.cart-footer',
    cartTotal: '.cart-total',
    
    // Botões
    cancelButton: '.btn-cancel, button:has-text("Cancelar")',
    checkoutButton: '.btn-checkout, button:has-text("Finalizar")',
    
    // Cliente
    clientSection: '.client-section, .client-area',
    clientName: '.client-name',
    selectClientButton: 'button:has-text("Selecionar Cliente")',
    newClientButton: 'button:has-text("Novo Cliente")'
  },

  // Produtos
  produtos: {
    header: '.produtos-header h1',
    navLinks: '.produtos-nav .nav-link',
    listaTab: 'a:has-text("Lista")',
    cadastrarTab: 'a:has-text("Cadastrar")',
    productGrid: '.products-grid, .product-grid, .grid',
    productCard: '.product-card, .card',
    searchInput: 'input[placeholder*="Buscar"]',
    addButton: 'button:has-text("Adicionar"), button:has-text("Novo")'
  },

  // Clientes
  clientes: {
    header: 'h1:has-text("Clientes")',
    searchInput: 'input[placeholder*="Buscar"]',
    newClientButton: 'button:has-text("Novo Cliente"), button:has-text("Adicionar")',
    clientTable: 'table',
    clientGrid: '.client-grid, .grid',
    clientCard: '.client-card, .card'
  },

  // Relatórios (Fluxo de Caixa)
  relatorios: {
    header: 'h2:has-text("Relatórios")',
    reportList: '.relatorio-item, .report-item',
    filters: '.relatorios-filtros, .filters',
    generateButton: 'button:has-text("Gerar")',
    exportButton: 'button:has-text("Exportar")'
  },

  // Navegação
  navigation: {
    sidebar: '.sidebar, .sidebar-bootstrap',
    navItems: '.nav-item, .nav-link',
    dashboardLink: 'a:has-text("Dashboard")',
    pdvLink: 'a:has-text("PDV")',
    produtosLink: 'a:has-text("Produtos")',
    clientesLink: 'a:has-text("Clientes")',
    estoqueLink: 'a:has-text("Estoque")',
    usuariosLink: 'a:has-text("Usuários")',
    fornecedoresLink: 'a:has-text("Fornecedores")',
    menuToggle: '.menu-toggle, .hamburger, button:has-text("☰")'
  },

  // Formulários
  forms: {
    nomeInput: 'input[name="nome"]',
    cpfInput: 'input[name="cpf"], input[name="cpf_cnpj"]',
    emailInput: 'input[name="email"]',
    telefoneInput: 'input[name="telefone"]',
    saveButton: 'button:has-text("Salvar"), button:has-text("Cadastrar")',
    cancelButton: 'button:has-text("Cancelar")'
  },

  // Modais
  modals: {
    modal: '.modal, .modal-dialog',
    modalContent: '.modal-content',
    modalHeader: '.modal-header',
    modalBody: '.modal-body',
    modalFooter: '.modal-footer',
    closeButton: '.btn-close, button:has-text("Fechar")'
  },

  // Tabelas
  tables: {
    table: 'table',
    tableResponsive: '.table-responsive, .table-wrapper',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    th: 'th',
    td: 'td'
  },

  // Elementos genéricos
  generic: {
    loading: '.loading, .spinner',
    error: '.error, .alert-danger',
    success: '.success, .alert-success',
    warning: '.warning, .alert-warning',
    button: 'button',
    input: 'input',
    select: 'select',
    textarea: 'textarea'
  }
};

// Textos esperados nas páginas
export const TEXTS = {
  dashboard: [
    'Dashboard',
    'Resumo de Vendas',
    'Produtos em Baixa',
    'Vendas Recentes'
  ],
  
  pdv: [
    'Ponto de Venda',
    'Scanner',
    'Carrinho',
    'Total'
  ],
  
  produtos: [
    'Produtos',
    'Lista',
    'Cadastrar'
  ],
  
  clientes: [
    'Clientes',
    'Novo Cliente',
    'Buscar'
  ],
  
  relatorios: [
    'Relatórios',
    'Fluxo de Caixa'
  ],
  
  navigation: [
    'Dashboard',
    'PDV',
    'Produtos',
    'Clientes',
    'Estoque',
    'Usuários',
    'Fornecedores'
  ]
};

// Configurações de timeout por viewport
export const TIMEOUTS = {
  mobile: 8000,
  tablet: 6000,
  desktop: 4000,
  default: 5000
};

// Configurações de espera por página
export const WAITS = {
  login: 2000,
  dashboard: 3000,
  pdv: 4000,
  produtos: 2000,
  clientes: 2000,
  relatorios: 2000,
  default: 2000
};

// Viewports configurados
export const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 667, type: 'mobile' },
  { name: 'Mobile Large', width: 414, height: 896, type: 'mobile' },
  { name: 'Tablet', width: 768, height: 1024, type: 'tablet' },
  { name: 'Tablet Large', width: 1024, height: 768, type: 'tablet' },
  { name: 'Desktop Small', width: 1280, height: 720, type: 'desktop' },
  { name: 'Desktop', width: 1920, height: 1080, type: 'desktop' },
  { name: 'Desktop Large', width: 2560, height: 1440, type: 'desktop' }
];

// Páginas para testar
export const PAGES = [
  { 
    name: 'Dashboard', 
    path: '/app/dashboard',
    selectors: SELECTORS.dashboard,
    texts: TEXTS.dashboard,
    wait: WAITS.dashboard
  },
  { 
    name: 'PDV', 
    path: '/app/pdv',
    selectors: SELECTORS.pdv,
    texts: TEXTS.pdv,
    wait: WAITS.pdv
  },
  { 
    name: 'Produtos', 
    path: '/app/produtos',
    selectors: SELECTORS.produtos,
    texts: TEXTS.produtos,
    wait: WAITS.produtos
  },
  { 
    name: 'Clientes', 
    path: '/app/clientes',
    selectors: SELECTORS.clientes,
    texts: TEXTS.clientes,
    wait: WAITS.clientes
  },
  { 
    name: 'Relatórios', 
    path: '/app/fluxo-caixa/relatorios',
    selectors: SELECTORS.relatorios,
    texts: TEXTS.relatorios,
    wait: WAITS.relatorios
  }
];

// Credenciais de teste
export const CREDENTIALS = {
  email: 'gerente@pharma.com',
  password: '123456'
};

// Funções utilitárias
export const utils = {
  // Obter timeout baseado no viewport
  getTimeout: (viewport) => {
    if (viewport.width <= 414) return TIMEOUTS.mobile;
    if (viewport.width <= 1024) return TIMEOUTS.tablet;
    return TIMEOUTS.desktop;
  },

  // Verificar se é mobile
  isMobile: (viewport) => viewport.width <= 768,

  // Verificar se é tablet
  isTablet: (viewport) => viewport.width > 768 && viewport.width <= 1024,

  // Verificar se é desktop
  isDesktop: (viewport) => viewport.width > 1024,

  // Gerar nome de arquivo para screenshot
  getScreenshotName: (pageName, viewport) => {
    return `${pageName.toLowerCase()}-${viewport.name.toLowerCase().replace(' ', '-')}.png`;
  },

  // Verificar se elemento está visível com retry
  checkVisibility: async (page, selector, timeout = 5000) => {
    try {
      await page.locator(selector).first().waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Esperar carregamento da página
  waitForPageLoad: async (page, timeout = 10000) => {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForTimeout(1000); // Tempo adicional para renderização
  },

  // Verificar overflow horizontal
  checkHorizontalOverflow: async (page, viewportWidth, margin = 50) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    return bodyWidth <= viewportWidth + margin;
  },

  // Tirar screenshot com tratamento de erro
  takeScreenshot: async (page, path, fullPage = true) => {
    try {
      await page.screenshot({ path, fullPage });
      return true;
    } catch (error) {
      console.error(`Erro ao tirar screenshot: ${path}`, error);
      return false;
    }
  }
};

export default {
  SELECTORS,
  TEXTS,
  TIMEOUTS,
  WAITS,
  VIEWPORTS,
  PAGES,
  CREDENTIALS,
  utils
};
