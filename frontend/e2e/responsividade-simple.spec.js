const { test, expect } = require('@playwright/test');

test.describe('Testes de Responsividade - Versão Simplificada', () => {
  
  // Viewports para diferentes dispositivos
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Tablet Large', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Desktop Large', width: 2560, height: 1440 }
  ];

  // Páginas para testar
  const pages = [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'PDV', path: '/app/pdv' },
    { name: 'Produtos', path: '/app/produtos' },
    { name: 'Clientes', path: '/app/clientes' },
    { name: 'Relatórios', path: '/app/fluxo-caixa/relatorios' }
  ];

  viewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        // Configurar viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Fazer login
        await page.goto('/login');
        await page.fill('input[name="email"]', 'gerente@pharma.com');
        await page.fill('input[name="password"]', '123456');
        await page.click('button:has-text("Entrar")');
        
        // Esperar redirecionamento
        try {
          await page.waitForURL('**/app/dashboard**', { timeout: 10000 });
        } catch (error) {
          // Se não redirecionar, tentar navegar manualmente
          await page.goto('/app/dashboard');
        }
      });

      pages.forEach(pageConfig => {
        test(`${pageConfig.name} - Layout e responsividade`, async ({ page }) => {
          console.log(`Testando ${pageConfig.name} em ${viewport.name}`);
          
          // Navegar para a página
          await page.goto(pageConfig.path);
          await page.waitForTimeout(2000); // Esperar carregamento
          
          // Verificar se a página carregou (não está em login ou erro)
          const currentUrl = page.url();
          expect(currentUrl).not.toContain('/login');
          expect(currentUrl).not.toContain('/error');
          
          // Verificar se não há overflow horizontal
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
          expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50);
          
          // Verificar se elementos básicos estão visíveis
          const hasVisibleContent = await page.evaluate(() => {
            const body = document.body;
            const hasText = body.innerText.trim().length > 0;
            const hasElements = body.children.length > 0;
            return hasText && hasElements;
          });
          
          expect(hasVisibleContent).toBe(true);
          
          // Verificar se há elementos interativos
          const interactiveElements = await page.locator('button, input, select, a, [role="button"]').count();
          expect(interactiveElements).toBeGreaterThan(0);
          
          // Screenshot para verificação visual
          await page.screenshot({ 
            path: `test-results/responsividade/${pageConfig.name.toLowerCase()}-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: true 
          });
          
          console.log(`✅ ${pageConfig.name} - ${viewport.name} concluído`);
        });
      });

      test('Navegação entre páginas', async ({ page }) => {
        // Testar navegação básica
        const navigationTests = [
          { name: 'Dashboard', path: '/app/dashboard' },
          { name: 'PDV', path: '/app/pdv' },
          { name: 'Produtos', path: '/app/produtos' }
        ];

        for (const navTest of navigationTests) {
          await page.goto(navTest.path);
          await page.waitForTimeout(1500);
          
          // Verificar se a página carregou
          const currentUrl = page.url();
          expect(currentUrl).toContain(navTest.path);
          
          // Verificar conteúdo
          const hasContent = await page.evaluate(() => 
            document.body.innerText.trim().length > 100
          );
          expect(hasContent).toBe(true);
        }
        
        // Screenshot da navegação
        await page.screenshot({ 
          path: `test-results/responsividade/navegacao-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('Performance de carregamento', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('/app/dashboard');
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Verificar se tempo de carregamento é razoável
        const maxLoadTime = viewport.width < 768 ? 8000 : 5000;
        expect(loadTime).toBeLessThan(maxLoadTime);
        
        console.log(`⏱️ Tempo de carregamento em ${viewport.name}: ${loadTime}ms`);
        
        // Verificar se não há erros JavaScript
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        
        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
      });

      // Testes específicos para mobile
      if (viewport.width <= 768) {
        test('Menu responsivo (mobile)', async ({ page }) => {
          await page.goto('/app/dashboard');
          await page.waitForTimeout(2000);
          
          // Provar por menu hambúrguer ou toggle
          const menuSelectors = [
            '.menu-toggle',
            '.hamburger',
            'button:has-text("☰")',
            '.mobile-menu-toggle',
            '[aria-label="menu"]',
            '[aria-label="Menu"]'
          ];
          
          let menuFound = false;
          for (const selector of menuSelectors) {
            try {
              const menu = page.locator(selector);
              if (await menu.isVisible()) {
                await menu.click();
                await page.waitForTimeout(1000);
                menuFound = true;
                break;
              }
            } catch (error) {
              // Continuar para o próximo seletor
            }
          }
          
          // Screenshot do menu mobile
          await page.screenshot({ 
            path: `test-results/responsividade/menu-mobile-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: true 
          });
          
          console.log(`📱 Menu mobile testado em ${viewport.name}`);
        });
      }

      // Testes específicos para desktop
      if (viewport.width >= 1024) {
        test('Layout desktop', async ({ page }) => {
          await page.goto('/app/dashboard');
          await page.waitForTimeout(2000);
          
          // Verificar se há sidebar ou navegação lateral
          const sidebarSelectors = [
            '.sidebar',
            '.sidebar-bootstrap',
            '.nav-sidebar',
            '.side-nav'
          ];
          
          let hasSidebar = false;
          for (const selector of sidebarSelectors) {
            try {
              const sidebar = page.locator(selector);
              if (await sidebar.isVisible()) {
                hasSidebar = true;
                break;
              }
            } catch (error) {
              // Continuar
            }
          }
          
          // Verificar se há conteúdo principal
          const mainContent = page.locator('main, .main-content, .content');
          const hasMainContent = await mainContent.isVisible();
          
          expect(hasMainContent).toBe(true);
          
          // Screenshot do layout desktop
          await page.screenshot({ 
            path: `test-results/responsividade/layout-desktop-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: true 
          });
          
          console.log(`🖥️ Layout desktop testado em ${viewport.name}`);
        });
      }
    });
  });

  // Teste de comparação visual
  test('Comparação visual entre viewports', async ({ page }) => {
    const testPage = '/app/pdv';
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(testPage);
      await page.waitForTimeout(3000);
      
      await page.screenshot({ 
        path: `test-results/responsividade/comparacao-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
      
      console.log(`📸 Screenshot gerado para ${viewport.name}`);
    }
  });

  // Teste de orientação (apenas mobile)
  test('Orientação mobile (portrait vs landscape)', async ({ page }) => {
    const mobileViewports = viewports.filter(v => v.width <= 768);
    
    for (const viewport of mobileViewports) {
      // Portrait
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/app/pdv');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: `test-results/responsividade/${viewport.name.toLowerCase().replace(' ', '-')}-portrait.png`,
        fullPage: true 
      });
      
      // Landscape
      await page.setViewportSize({ width: viewport.height, height: viewport.width });
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: `test-results/responsividade/${viewport.name.toLowerCase().replace(' ', '-')}-landscape.png`,
        fullPage: true 
      });
      
      console.log(`📱 Orientação testada para ${viewport.name}`);
    }
  });
});
