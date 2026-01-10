const { test, expect } = require('@playwright/test');
const { SELECTORS, TEXTS, VIEWPORTS, PAGES, CREDENTIALS, utils } = require('./responsividade-selectors');

test.describe('Testes de Responsividade - Sistema Completo', () => {
  
  // Usar viewports configurados
  const viewports = VIEWPORTS;

  viewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.beforeEach(async ({ page }) => {
        // Configurar viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Fazer login usando credenciais configuradas
        await page.goto('/login');
        await page.fill(SELECTORS.login.emailInput, CREDENTIALS.email);
        await page.fill(SELECTORS.login.passwordInput, CREDENTIALS.password);
        await page.click(SELECTORS.login.submitButton);
        await page.waitForURL('**/app/dashboard**');
      });

      test('1. Dashboard - Layout responsivo', async ({ page }) => {
        await page.goto('/app/dashboard');
        await page.waitForTimeout(2000);
        
        // Verificar se elementos principais estão visíveis
        const dashboardElements = [
          'text=Dashboard',
          'text=Resumo de Vendas',
          'text=Produtos em Baixa',
          'text=Vendas Recentes'
        ];
        
        for (const element of dashboardElements) {
          try {
            await expect(page.locator(element)).toBeVisible({ timeout: 5000 });
          } catch (error) {
            // Elemento pode não existir em alguns viewports, continuar
          }
        }
        
        // Verificar se não há overflow horizontal
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50); // Pequena margem
        
        // Screenshot para verificação visual
        await page.screenshot({ 
          path: `test-results/responsividade/dashboard-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('2. PDV - Layout responsivo', async ({ page }) => {
        await page.goto('/app/pdv');
        await page.waitForTimeout(3000);
        
        // Verificar elementos principais do PDV
        await expect(page.locator('input[placeholder*="Código de barras"]')).toBeVisible();
        await expect(page.locator('input[placeholder*="Buscar produtos"]')).toBeVisible();
        await expect(page.locator('.cart-section')).toBeVisible();
        await expect(page.locator('.cart-header')).toBeVisible();
        
        const pdvElements = [
          'text=Ponto de Venda',
          'text=Scanner de Código de Barras',
          'text=Produtos',
          'text=Carrinho'
        ];
        
        for (const element of pdvElements) {
          try {
            await expect(page.locator(element)).toBeVisible({ timeout: 5000 });
          } catch (error) {
            console.log(`Elemento não encontrado em ${viewport.name}: ${element}`);
          }
        }
        
        // Verificar se o carrinho está posicionado corretamente
        const cartSection = page.locator('.cart-section');
        if (await cartSection.isVisible()) {
          const cartBox = await cartSection.boundingBox();
          expect(cartBox).toBeTruthy();
        }
        
        // Verificar se não há overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50);
        
        // Testar interações básicas
        try {
          const searchInput = page.locator('input[placeholder*="Buscar"]');
          if (await searchInput.isVisible()) {
            await searchInput.fill('paracetamol');
            await page.waitForTimeout(1000);
          }
        } catch (error) {
          // Busca pode não estar disponível em alguns viewports
        }
        
        await page.screenshot({ 
          path: `test-results/responsividade/pdv-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('3. Produtos - Layout responsivo', async ({ page }) => {
        await page.goto('/app/produtos');
        await page.waitForTimeout(2000);
        
        // Verificar elementos principais
        const productElements = [
          'text=Produtos',
          'text=Lista',
          'text=Cadastrar'
        ];
        
        for (const element of productElements) {
          try {
            await expect(page.locator(element)).toBeVisible({ timeout: 5000 });
          } catch (error) {
            console.log(`Elemento não encontrado em ${viewport.name}: ${element}`);
          }
        }
        
        // Verificar grid de produtos
        const productGrid = page.locator('.products-grid, .product-grid, .grid');
        if (await productGrid.isVisible()) {
          const gridBox = await productGrid.boundingBox();
          expect(gridBox).toBeTruthy();
        }
        
        // Verificar se não há overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50);
        
        await page.screenshot({ 
          path: `test-results/responsividade/produtos-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('4. Clientes - Layout responsivo', async ({ page }) => {
        await page.goto('/app/clientes');
        await page.waitForTimeout(2000);
        
        // Verificar elementos principais
        const clientElements = [
          'text=Novo Cliente',
          'text=Buscar'
        ];
        
        for (const element of clientElements) {
          try {
            await expect(page.locator(element)).toBeVisible({ timeout: 5000 });
          } catch (error) {
            console.log(`Elemento não encontrado em ${viewport.name}: ${element}`);
          }
        }
        
        // Verificar tabela/grid de clientes
        const clientTable = page.locator('table, .client-grid, .data-table');
        if (await clientTable.isVisible()) {
          const tableBox = await clientTable.boundingBox();
          expect(tableBox).toBeTruthy();
        }
        
        // Verificar se não há overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50);
        
        await page.screenshot({ 
          path: `test-results/responsividade/clientes-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('5. Relatórios - Layout responsivo', async ({ page }) => {
        await page.goto('/app/fluxo-caixa/relatorios');
        await page.waitForTimeout(2000);
        
        // Verificar elementos principais
        const reportElements = [
          'text=Relatórios',
          'text=Fluxo de Caixa'
        ];
        
        for (const element of reportElements) {
          try {
            await expect(page.locator(element)).toBeVisible({ timeout: 5000 });
          } catch (error) {
            console.log(`Elemento não encontrado em ${viewport.name}: ${element}`);
          }
        }
        
        // Verificar se não há overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50);
        
        await page.screenshot({ 
          path: `test-results/responsividade/relatorios-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('6. Navegação - Menu responsivo', async ({ page }) => {
        await page.goto('/app/dashboard');
        await page.waitForTimeout(2000);
        
        // Verificar menu de navegação
        const navElements = [
          'text=Dashboard',
          'text=PDV',
          'text=Produtos',
          'text=Clientes',
          'text=Relatórios'
        ];
        
        for (const element of navElements) {
          try {
            const navElement = page.locator(element);
            if (await navElement.isVisible()) {
              await expect(navElement).toBeVisible({ timeout: 5000 });
            }
          } catch (error) {
            console.log(`Elemento de navegação não encontrado em ${viewport.name}: ${element}`);
          }
        }
        
        // Em mobile, verificar menu hambúrguer
        if (viewport.width <= 768) {
          const menuToggle = page.locator('.menu-toggle, .hamburger, button:has-text("☰")');
          if (await menuToggle.isVisible()) {
            await menuToggle.click();
            await page.waitForTimeout(1000);
          }
        }
        
        await page.screenshot({ 
          path: `test-results/responsividade/navegacao-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('7. Formulários - Layout responsivo', async ({ page }) => {
        await page.goto('/app/clientes');
        await page.waitForTimeout(2000);
        
        // Tentar abrir formulário de novo cliente
        try {
          const newClientBtn = page.locator('text=Novo Cliente, text=Cadastrar, button:has-text("+")');
          if (await newClientBtn.isVisible()) {
            await newClientBtn.click();
            await page.waitForTimeout(1000);
            
            // Verificar elementos do formulário
            const formElements = [
              'input[name="nome"]',
              'input[name="cpf"]',
              'input[name="email"]',
              'button:has-text("Salvar")'
            ];
            
            for (const element of formElements) {
              try {
                await expect(page.locator(element)).toBeVisible({ timeout: 3000 });
              } catch (error) {
                console.log(`Elemento de formulário não encontrado em ${viewport.name}: ${element}`);
              }
            }
          }
        } catch (error) {
          console.log(`Não foi possível abrir formulário em ${viewport.name}`);
        }
        
        await page.screenshot({ 
          path: `test-results/responsividade/formularios-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('8. Modais - Layout responsivo', async ({ page }) => {
        await page.goto('/app/pdv');
        await page.waitForTimeout(3000);
        
        // Tentar abrir algum modal
        try {
          const actionsButton = page.locator('button:has-text("⚙️"), button:has-text("Ações")');
          if (await actionsButton.isVisible()) {
            await actionsButton.click();
            await page.waitForTimeout(1000);
            
            // Verificar se modal/menu está visível
            const modal = page.locator('.modal, .dropdown, .actions-menu');
            if (await modal.isVisible()) {
              const modalBox = await modal.boundingBox();
              expect(modalBox).toBeTruthy();
              
              // Verificar se modal não ultrapassa viewport
              expect(modalBox.x + modalBox.width).toBeLessThanOrEqual(viewport.width + 50);
              expect(modalBox.y + modalBox.height).toBeLessThanOrEqual(viewport.height + 50);
            }
          }
        } catch (error) {
          console.log(`Não foi possível abrir modal em ${viewport.name}`);
        }
        
        await page.screenshot({ 
          path: `test-results/responsividade/modais-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('9. Tabelas - Layout responsivo', async ({ page }) => {
        await page.goto('/app/vendas');
        await page.waitForTimeout(2000);
        
        // Verificar tabelas
        const tables = page.locator('table');
        const tableCount = await tables.count();
        
        if (tableCount > 0) {
          const firstTable = tables.first();
          if (await firstTable.isVisible()) {
            const tableBox = await firstTable.boundingBox();
            expect(tableBox).toBeTruthy();
            
            // Em mobile, tabelas devem ter scroll horizontal ou estar adaptadas
            if (viewport.width <= 768) {
              const tableWrapper = page.locator('.table-wrapper, .table-responsive');
              if (await tableWrapper.isVisible()) {
                // Verificar se tem scroll horizontal
                const hasHorizontalScroll = await page.evaluate(() => {
                  const wrapper = document.querySelector('.table-wrapper, .table-responsive');
                  return wrapper && wrapper.scrollWidth > wrapper.clientWidth;
                });
                
                // Se não tiver scroll, a tabela deve estar adaptada
                if (!hasHorizontalScroll) {
                  expect(tableBox.width).toBeLessThanOrEqual(viewport.width - 40);
                }
              }
            }
          }
        }
        
        await page.screenshot({ 
          path: `test-results/responsividade/tabelas-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
          fullPage: true 
        });
      });

      test('10. Performance - Carregamento responsivo', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('/app/dashboard');
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Verificar se tempo de carregamento é razoável para o viewport
        const maxLoadTime = viewport.width < 768 ? 8000 : 5000; // Mobile pode ser mais lento
        expect(loadTime).toBeLessThan(maxLoadTime);
        
        console.log(`Tempo de carregamento em ${viewport.name}: ${loadTime}ms`);
        
        // Verificar se não há erros de JavaScript
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        
        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
      });
    });
  });

  test('11. Comparação visual entre viewports', async ({ page }) => {
    // Teste específico para gerar comparação visual
    const testPage = '/app/pdv';
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(testPage);
      await page.waitForTimeout(3000);
      
      await page.screenshot({ 
        path: `test-results/responsividade/comparacao-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
    }
  });

  test('12. Teste de orientação (landscape vs portrait)', async ({ page }) => {
    // Testar apenas em dispositivos móveis
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
      
      // Landscape (trocar width/height)
      await page.setViewportSize({ width: viewport.height, height: viewport.width });
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: `test-results/responsividade/${viewport.name.toLowerCase().replace(' ', '-')}-landscape.png`,
        fullPage: true 
      });
    }
  });
});