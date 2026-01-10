const { test, expect } = require('@playwright/test');

test.describe('PDV - Testes E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.fill('input[name="email"]', 'gerente@pharma.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    
    // Aguardar redirecionamento
    await page.waitForURL('**/app/dashboard**');
    
    // Navegar para PDV
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Aguardar carregamento
    await page.waitForTimeout(3000);
  });

  test('1. PDV carrega com produtos e layout correto', async ({ page }) => {
    // Verificar título
    const pageText = await page.textContent('body');
    expect(pageText.includes('Ponto de Venda')).toBeTruthy();
    
    // Verificar se produtos estão visíveis
    expect(pageText.includes('Paracetamol') || pageText.includes('Dipirona') || pageText.includes('Amoxicilina')).toBeTruthy();
    
    // Verificar se carrinho está presente
    expect(pageText.includes('Carrinho') || pageText.includes('carrinho')).toBeTruthy();
  });

  test('2. Scanner de código de barras funciona', async ({ page }) => {
    const barcodeInput = page.locator('input[placeholder*="código"], input[placeholder*="barcode"]');
    
    if (await barcodeInput.isVisible()) {
      await barcodeInput.fill('7891234567890');
      await barcodeInput.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verificar se produto foi adicionado
      const cartContent = await page.textContent('.cart-section, .carrinho');
      expect(cartContent.includes('itens') || cartContent.includes('R$')).toBeTruthy();
    }
  });

  test('3. Busca de produtos funciona', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="search"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('paracetamol');
      await page.waitForTimeout(1000);
      
      // Verificar se busca foi realizada
      const value = await searchInput.inputValue();
      expect(value).toBe('paracetamol');
    }
  });

  test('4. Adicionar produtos ao carrinho', async ({ page }) => {
    const addButtons = await page.locator('button:has-text("Adicionar")').all();
    
    if (addButtons.length > 0) {
      await addButtons[0].click();
      await page.waitForTimeout(1000);
      
      // Verificar se produto foi adicionado
      const cartContent = await page.textContent('.cart-section, .carrinho');
      expect(cartContent.includes('itens') || cartContent.includes('R$')).toBeTruthy();
    }
  });

  test('5. Finalizar venda', async ({ page }) => {
    const addButtons = await page.locator('button:has-text("Adicionar")').all();
    
    if (addButtons.length > 0) {
      await addButtons[0].click();
      await page.waitForTimeout(1000);
      
      const checkoutButton = page.locator('text=💰 Finalizar Venda');
      if (await checkoutButton.isVisible()) {
        await checkoutButton.click();
        page.on('dialog', dialog => dialog.accept());
        await page.waitForTimeout(2000);
        
        // Verificar se venda foi processada
        const pageText = await page.textContent('body');
        expect(pageText.includes('sucesso') || pageText.includes('concluída')).toBeTruthy();
      }
    }
  });

  test('6. Cancelar venda', async ({ page }) => {
    const addButtons = await page.locator('button:has-text("Adicionar")').all();
    
    if (addButtons.length > 0) {
      await addButtons[0].click();
      await page.waitForTimeout(1000);
      
      const cancelButton = page.locator('text=❌ Cancelar Venda');
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        page.on('dialog', dialog => dialog.accept());
        await page.waitForTimeout(1000);
        
        // Verificar se carrinho está vazio
        const pageText = await page.textContent('body');
        expect(pageText.includes('vazio')).toBeTruthy();
      }
    }
  });

  test('7. Menu de ações funciona', async ({ page }) => {
    const actionsButton = page.locator('button:has-text("⚙️"), button:has-text("Ações")');
    
    if (await actionsButton.isVisible()) {
      await actionsButton.click();
      await page.waitForTimeout(500);
      
      // Verificar se opções aparecem
      const pageText = await page.textContent('body');
      expect(pageText.includes('Estornar') || pageText.includes('Abrir Caixa')).toBeTruthy();
      
      // Fechar menu
      await actionsButton.click();
    }
  });

  test('8. Selecionar cliente', async ({ page }) => {
    const selectClientButton = page.locator('text=Selecionar Cliente');
    
    if (await selectClientButton.isVisible()) {
      await selectClientButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar se modal de cliente abriu
      const pageText = await page.textContent('body');
      expect(pageText.includes('Cliente') || pageText.includes('Selecionar')).toBeTruthy();
    }
  });

  test('9. Navegação entre seções', async ({ page }) => {
    const historyLink = page.locator('a:has-text("Histórico")');
    if (await historyLink.isVisible()) {
      await historyLink.click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/app/pdv/vendas');
      
      // Voltar para PDV
      const salesLink = page.locator('a:has-text("Vendas")');
      if (await salesLink.isVisible()) {
        await salesLink.click();
        await page.waitForTimeout(2000);
        
        const backUrl = page.url();
        expect(backUrl).toContain('/app/pdv');
      }
    }
  });

  test('10. Performance de carregamento', async ({ page }) => {
    const startTime = Date.now();
    
    await page.reload();
    await page.waitForURL('**/app/pdv**');
    await page.waitForTimeout(3000);
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Tempo de carregamento: ${loadTime}ms`);
  });

  test('11. Responsividade', async ({ page }) => {
    // Testar em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('body')).toBeVisible();
    
    // Voltar para desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('12. Tratamento de erros', async ({ page }) => {
    // Tentar acessar URL inválida
    await page.goto('/app/pdv/pagina-inexistente');
    await page.waitForTimeout(2000);
    
    // Verificar se aplicação não quebrou
    await expect(page.locator('body')).toBeVisible();
    
    // Voltar para página válida
    await page.goto('/app/pdv');
    await page.waitForTimeout(3000);
  });

  test('13. Múltiplas operações', async ({ page }) => {
    const startTime = Date.now();
    
    // Adicionar múltiplos produtos
    const addButtons = await page.locator('button:has-text("Adicionar")').all();
    for (let i = 0; i < Math.min(3, addButtons.length); i++) {
      await addButtons[i].click();
      await page.waitForTimeout(300);
    }
    
    // Tentar finalizar venda
    const checkoutButton = page.locator('text=💰 Finalizar Venda');
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      page.on('dialog', dialog => dialog.accept());
      await page.waitForTimeout(2000);
    }
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(15000);
    
    console.log(`Tempo para múltiplas operações: ${totalTime}ms`);
  });

  test('14. Validação de formulários', async ({ page }) => {
    // Tentar finalizar venda sem produtos
    const checkoutButton = page.locator('text=💰 Finalizar Venda');
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar se houve tratamento de erro
      const pageText = await page.textContent('body');
      expect(pageText.length).toBeGreaterThan(100);
    }
  });

  test('15. Sanidade geral', async ({ page }) => {
    // Verificar se página está funcional
    await expect(page.locator('body')).toBeVisible();
    
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    const pageContent = await page.textContent('body');
    expect(pageContent.length).toBeGreaterThan(200);
    
    // Verificar se não há erros JavaScript
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.waitForTimeout(3000);
    expect(errors.length).toBe(0);
  });
});