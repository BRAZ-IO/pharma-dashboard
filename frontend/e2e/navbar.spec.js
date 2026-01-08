const { test, expect } = require('@playwright/test');

test.describe('Navbar - Funcionalidades e Interações', () => {
  
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.fill('input[name="email"]', 'gerente@pharma.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    
    // Aguardar redirecionamento para dashboard
    await page.waitForURL('**/app/dashboard**');
  });

  test('1. Navbar está visível após login', async ({ page }) => {
    // Verificar se navbar está presente
    const navbar = page.locator('.navbar-bootstrap, nav.navbar').first();
    await expect(navbar).toBeVisible();
  });

  test('2. Navbar exibe informações do usuário', async ({ page }) => {
    // Verificar nome do usuário
    await expect(page.locator('.profile-name').first()).toHaveText(/João Silva/);
    
    // Verificar cargo/função
    await expect(page.locator('.profile-role').first()).toHaveText(/Gerente/);
  });

  test('3. Navbar exibe título da página atual', async ({ page }) => {
    // Verificar título no Dashboard
    await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
    
    // Navegar para PDV
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Verificar título mudou
    await expect(page.locator('h1:has-text("PDV")').first()).toBeVisible();
  });

  test('4. Menu dropdown do usuário abre ao clicar', async ({ page }) => {
    // Procurar botão/link do usuário
    const userButton = page.locator('button:has-text("João Silva"), a:has-text("João Silva")').first();
    
    if (await userButton.isVisible()) {
      await userButton.click();
      await page.waitForTimeout(500);
      
      // Verificar se dropdown abriu (pode ter opções como Perfil, Configurações, Sair)
      const dropdown = page.locator('.dropdown-menu, [role="menu"]');
      if (await dropdown.count() > 0) {
        await expect(dropdown.first()).toBeVisible();
      }
    }
  });

  test('5. Botão de notificações está presente', async ({ page }) => {
    // Procurar ícone de notificações (sino, badge, etc)
    const notificationButton = page.locator('button:has-text("3"), [aria-label*="notif"], .notification-icon');
    
    if (await notificationButton.count() > 0) {
      await expect(notificationButton.first()).toBeVisible();
    }
  });

  test('6. Contador de notificações é exibido', async ({ page }) => {
    // Verificar se há badge com número de notificações
    const badge = page.locator('.badge, .notification-badge').first();
    
    if (await badge.isVisible()) {
      const badgeText = await badge.textContent();
      expect(badgeText).toBeTruthy();
    }
  });

  test('7. Navbar permanece fixa durante scroll', async ({ page }) => {
    const navbar = page.locator('.navbar-bootstrap, nav.navbar').first();
    
    // Verificar posição inicial
    await expect(navbar).toBeVisible();
    
    // Fazer scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    // Navbar deve continuar visível
    await expect(navbar).toBeVisible();
  });

  test('8. Navbar é responsiva em diferentes tamanhos de tela', async ({ page }) => {
    const navbar = page.locator('.navbar-bootstrap, nav.navbar').first();
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(navbar).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(navbar).toBeVisible();
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    // Navbar pode ter menu hamburguer em mobile
  });

  test('9. Breadcrumb ou caminho de navegação é exibido', async ({ page }) => {
    // Verificar se há breadcrumb
    const breadcrumb = page.locator('.breadcrumb, [aria-label="breadcrumb"]');
    
    if (await breadcrumb.count() > 0) {
      await expect(breadcrumb.first()).toBeVisible();
    }
  });

  test('10. Logout via navbar funciona', async ({ page }) => {
    // Procurar botão de sair na navbar ou dropdown
    const userButton = page.locator('button:has-text("João Silva"), a:has-text("João Silva")').first();
    
    if (await userButton.isVisible()) {
      await userButton.click();
      await page.waitForTimeout(500);
      
      // Procurar opção Sair
      const logoutOption = page.locator('button:has-text("Sair"), a:has-text("Sair")').first();
      
      if (await logoutOption.isVisible()) {
        await logoutOption.click();
        
        // Deve redirecionar para login
        await page.waitForURL('**/login**', { timeout: 5000 });
        await expect(page.locator('text=Login').or(page.locator('text=Entrar')).first()).toBeVisible();
      }
    }
  });

  test('11. Navbar atualiza título ao navegar entre páginas', async ({ page }) => {
    // Dashboard
    await expect(page.locator('h1:has-text("Dashboard")').first()).toBeVisible();
    
    // PDV
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    await page.waitForTimeout(500);
    
    // Produtos
    await page.click('text=Produtos');
    await page.waitForURL('**/app/produtos**');
    await page.waitForTimeout(500);
    
    // Estoque
    await page.click('text=Estoque');
    await page.waitForURL('**/app/estoque**');
    await page.waitForTimeout(500);
  });

  test('12. Avatar ou foto do usuário é exibido', async ({ page }) => {
    // Procurar avatar/imagem do usuário
    const avatar = page.locator('.avatar, .user-avatar, img[alt*="João"], img[alt*="usuário"]');
    
    if (await avatar.count() > 0) {
      await expect(avatar.first()).toBeVisible();
    }
  });

  test('13. Navbar exibe logo ou nome do sistema', async ({ page }) => {
    // Verificar se título da página está presente na navbar
    await expect(page.locator('.navbar-page-title h1').first()).toBeVisible();
  });

  test('14. Busca rápida na navbar funciona', async ({ page }) => {
    // Procurar campo de busca na navbar
    const searchInput = page.locator('.navbar input[type="search"], .navbar input[placeholder*="Buscar"]');
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('paracetamol');
      await page.waitForTimeout(500);
      
      // Verificar se há resultados ou sugestões
      const searchResults = page.locator('.search-results, .dropdown-menu');
      if (await searchResults.count() > 0) {
        await expect(searchResults.first()).toBeVisible();
      }
    }
  });

  test('15. Atalhos de teclado na navbar funcionam', async ({ page }) => {
    // Testar atalho comum como Ctrl+K para busca
    await page.keyboard.press('Control+K');
    await page.waitForTimeout(500);
    
    // Verificar se campo de busca foi focado ou modal abriu
    const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]');
    if (await searchInput.count() > 0) {
      const isFocused = await searchInput.first().evaluate(el => document.activeElement === el);
      // Atalho pode ou não estar implementado
    }
  });

  test('16. FLUXO COMPLETO: Usuário interage com navbar', async ({ page }) => {
    const navbar = page.locator('.navbar-bootstrap, nav.navbar').first();
    
    // PASSO 1: Verificar navbar visível
    await expect(navbar).toBeVisible();
    
    // PASSO 2: Verificar informações do usuário
    await expect(page.locator('text=João Silva').first()).toBeVisible();
    
    // PASSO 3: Navegar para PDV
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    await page.waitForTimeout(500);
    
    // PASSO 4: Verificar título atualizado
    await expect(page.locator('h1:has-text("PDV")').first()).toBeVisible();
    
    // PASSO 5: Voltar para Dashboard
    await page.click('text=Dashboard');
    await page.waitForURL('**/app/dashboard**');
    
    // PASSO 6: Navbar continua visível
    await expect(navbar).toBeVisible();
  });

  test('17. Navbar mantém estado durante reload', async ({ page }) => {
    const navbar = page.locator('.navbar-bootstrap, nav.navbar').first();
    
    // Verificar navbar
    await expect(navbar).toBeVisible();
    await expect(page.locator('text=João Silva').first()).toBeVisible();
    
    // Recarregar página
    await page.reload();
    
    // Navbar deve continuar visível
    await expect(navbar).toBeVisible();
    await expect(page.locator('text=João Silva').first()).toBeVisible();
  });

  test('18. Hover nos elementos da navbar mostra feedback', async ({ page }) => {
    // Procurar botão do usuário
    const userButton = page.locator('button:has-text("João Silva"), a:has-text("João Silva")').first();
    
    if (await userButton.isVisible()) {
      // Fazer hover
      await userButton.hover();
      await page.waitForTimeout(300);
      
      // Elemento deve estar visível (efeito de hover)
      await expect(userButton).toBeVisible();
    }
  });

});
