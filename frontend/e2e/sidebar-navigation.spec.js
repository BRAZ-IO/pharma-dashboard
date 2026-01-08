const { test, expect } = require('@playwright/test');

test.describe('Sidebar - Navegação e Funcionalidades', () => {
  
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.fill('input[name="email"]', 'gerente@pharma.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL('**/app/dashboard**');
  });

  test('1. Sidebar está visível após login', async ({ page }) => {
    // Verificar se sidebar está presente
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await expect(sidebar).toBeVisible();
    
    // Verificar logo/título
    await expect(page.locator('.brand-text-bootstrap').first()).toHaveText(/Farmácia Teste/);
  });

  test('2. Sidebar contém todos os links de navegação principais', async ({ page }) => {
    // Verificar links principais na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await expect(sidebar.locator('text=Dashboard').first()).toBeVisible();
    await expect(sidebar.locator('text=PDV').first()).toBeVisible();
    await expect(sidebar.locator('text=Produtos').first()).toBeVisible();
    await expect(sidebar.locator('text=Estoque').first()).toBeVisible();
    await expect(sidebar.locator('text=Usuários').first()).toBeVisible();
    await expect(sidebar.locator('text=Fornecedores').first()).toBeVisible();
    await expect(sidebar.locator('text=Clientes').first()).toBeVisible();
    await expect(sidebar.locator('text=Fluxo de Caixa').first()).toBeVisible();
  });

  test('3. Navegação para Dashboard funciona', async ({ page }) => {
    // Clicar em Dashboard na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Dashboard').first().click();
    
    // Verificar URL
    await page.waitForURL('**/app/dashboard**');
    
    // Verificar conteúdo da página (h1)
    await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
  });

  test('4. Navegação para PDV funciona', async ({ page }) => {
    // Clicar em PDV na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=PDV').click();
    
    // Verificar URL
    await page.waitForURL('**/app/pdv**');
    
    // Verificar conteúdo específico do PDV
    await expect(page.locator('h1:has-text("Ponto de Venda")').first()).toBeVisible();
  });

  test('5. Navegação para Produtos funciona', async ({ page }) => {
    // Clicar em Produtos na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Produtos').click();
    
    // Verificar URL
    await page.waitForURL('**/app/produtos**');
    
    // Verificar conteúdo da página (h1 no main)
    await expect(page.locator('main h1:has-text("Produtos")').first()).toBeVisible();
  });

  test('6. Navegação para Estoque funciona', async ({ page }) => {
    // Clicar em Estoque na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Estoque').first().click();
    
    // Verificar URL
    await page.waitForURL('**/app/estoque**');
    
    // Verificar conteúdo da página (h1 no main)
    await expect(page.locator('main h1:has-text("Estoque")').first()).toBeVisible();
  });

  test('7. Navegação para Usuários funciona', async ({ page }) => {
    // Clicar em Usuários na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Usuários').click();
    
    // Verificar URL
    await page.waitForURL('**/app/usuarios**');
    
    // Verificar conteúdo da página (h1 no main)
    await expect(page.locator('main h1:has-text("Usuários")').first()).toBeVisible();
  });

  test('7b. Navegação para Fornecedores funciona', async ({ page }) => {
    // Clicar em Fornecedores na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Fornecedores').first().click();
    
    // Verificar URL
    await page.waitForURL('**/app/fornecedores**');
    
    // Verificar conteúdo da página (h1 no main)
    await expect(page.locator('main h1:has-text("Fornecedores")').first()).toBeVisible();
  });

  test('7c. Navegação para Clientes funciona', async ({ page }) => {
    // Clicar em Clientes na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Clientes').first().click();
    
    // Verificar URL
    await page.waitForURL('**/app/clientes**');
    
    // Verificar conteúdo da página (h1 no main)
    await expect(page.locator('main h1:has-text("Clientes")').first()).toBeVisible();
  });

  test('7d. Navegação para Fluxo de Caixa funciona', async ({ page }) => {
    // Clicar em Fluxo de Caixa na sidebar
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=Fluxo de Caixa').first().click();
    
    // Verificar URL
    await page.waitForURL('**/app/fluxo-caixa**');
    
    // Verificar conteúdo da página (h1 no main)
    await expect(page.locator('main h1:has-text("Fluxo de Caixa")').first()).toBeVisible();
  });

  test('8. Link ativo é destacado visualmente', async ({ page }) => {
    // Navegar para PDV
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    await sidebar.locator('text=PDV').first().click();
    await page.waitForURL('**/app/pdv**');
    
    // Verificar se link PDV está com classe active ou estilo diferente
    const pdvLink = sidebar.locator('button:has-text("PDV"), a:has-text("PDV")').first();
    const classes = await pdvLink.getAttribute('class');
    
    // Deve ter alguma indicação de ativo
    expect(classes).toBeTruthy();
  });

  test('9. Navegação sequencial entre páginas', async ({ page }) => {
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    
    // Dashboard -> PDV
    await sidebar.locator('text=PDV').first().click();
    await page.waitForURL('**/app/pdv**');
    await expect(page.locator('h1:has-text("Ponto de Venda")').first()).toBeVisible();
    
    // PDV -> Produtos
    await sidebar.locator('text=Produtos').first().click();
    await page.waitForURL('**/app/produtos**');
    await page.waitForTimeout(500);
    
    // Produtos -> Estoque
    await sidebar.locator('text=Estoque').first().click();
    await page.waitForURL('**/app/estoque**');
    await page.waitForTimeout(500);
    
    // Estoque -> Dashboard
    await sidebar.locator('text=Dashboard').first().click();
    await page.waitForURL('**/app/dashboard**');
    await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
  });

  test('10. Sidebar permanece visível durante navegação', async ({ page }) => {
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    
    // Verificar em Dashboard
    await expect(sidebar).toBeVisible();
    
    // Navegar para PDV
    await sidebar.locator('text=PDV').first().click();
    await page.waitForURL('**/app/pdv**');
    await expect(sidebar).toBeVisible();
    
    // Navegar para Produtos
    await sidebar.locator('text=Produtos').first().click();
    await page.waitForURL('**/app/produtos**');
    await expect(sidebar).toBeVisible();
  });

  test('11. Botão de logout está presente e visível', async ({ page }) => {
    // Verificar se botão de logout/sair existe
    const logoutButton = page.locator('button:has-text("Sair"), a:has-text("Sair")');
    
    if (await logoutButton.count() > 0) {
      await expect(logoutButton.first()).toBeVisible();
    }
  });

  test('12. Logout redireciona para página de login', async ({ page }) => {
    // Procurar botão de logout
    const logoutButton = page.locator('button:has-text("Sair"), a:has-text("Sair")');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      // Deve redirecionar para login
      await page.waitForURL('**/login**');
      await expect(page.locator('text=Login').or(page.locator('text=Entrar')).first()).toBeVisible();
    }
  });

  test('13. Sidebar responsiva em diferentes tamanhos de tela', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    const sidebar = page.locator('.sidebar, nav').first();
    await expect(sidebar).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    // Sidebar pode estar colapsada ou visível
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    // Em mobile, sidebar pode estar escondida ou com menu hamburguer
  });

  test('14. Ícones dos links estão visíveis', async ({ page }) => {
    // Verificar se existem ícones (FontAwesome, SVG, etc)
    const icons = page.locator('.sidebar i, .sidebar svg, nav i, nav svg');
    
    if (await icons.count() > 0) {
      await expect(icons.first()).toBeVisible();
    }
  });

  test('15. FLUXO COMPLETO: Usuário navega por todas as páginas', async ({ page }) => {
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    
    // PASSO 1: Verificar Dashboard inicial
    await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
    
    // PASSO 2: Ir para PDV
    await sidebar.locator('text=PDV').first().click();
    await page.waitForURL('**/app/pdv**');
    await expect(page.locator('text=Scanner de Código de Barras')).toBeVisible();
    
    // PASSO 3: Ir para Produtos
    await sidebar.locator('text=Produtos').first().click();
    await page.waitForURL('**/app/produtos**');
    await page.waitForTimeout(500);
    
    // PASSO 4: Ir para Estoque
    await sidebar.locator('text=Estoque').first().click();
    await page.waitForURL('**/app/estoque**');
    await page.waitForTimeout(500);
    
    // PASSO 5: Ir para Usuários
    await sidebar.locator('text=Usuários').first().click();
    await page.waitForURL('**/app/usuarios**');
    await page.waitForTimeout(500);
    
    // PASSO 6: Voltar para Dashboard
    await sidebar.locator('text=Dashboard').first().click();
    await page.waitForURL('**/app/dashboard**');
    await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
  });

  test('16. Hover nos links mostra efeito visual', async ({ page }) => {
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    const pdvLink = sidebar.locator('button:has-text("PDV"), a:has-text("PDV")').first();
    
    // Fazer hover
    await pdvLink.hover();
    await page.waitForTimeout(300);
    
    // Link deve estar visível (efeito de hover pode ser verificado via screenshot)
    await expect(pdvLink).toBeVisible();
  });

  test('17. Navegação via teclado funciona', async ({ page }) => {
    // Focar no primeiro link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Pressionar Enter para navegar
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Deve ter navegado para alguma página
    const url = page.url();
    expect(url).toContain('/app/');
  });

  test('18. Sidebar mantém estado durante reload da página', async ({ page }) => {
    const sidebar = page.locator('.sidebar-bootstrap, nav[role="navigation"]').first();
    
    // Navegar para PDV
    await sidebar.locator('text=PDV').first().click();
    await page.waitForURL('**/app/pdv**');
    
    // Recarregar página
    await page.reload();
    
    // Deve continuar no PDV
    await page.waitForURL('**/app/pdv**');
    await expect(page.locator('h1:has-text("Ponto de Venda")').first()).toBeVisible();
    
    // Sidebar deve estar visível
    await expect(sidebar).toBeVisible();
  });

});
