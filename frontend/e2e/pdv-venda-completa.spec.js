const { test, expect } = require('@playwright/test');

test.describe('PDV - Fluxo Completo de Venda', () => {
  
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.fill('input[name="email"]', 'gerente@pharma.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button:has-text("Entrar")');
    
    // Aguardar redirecionamento
    await page.waitForURL('**/app/dashboard**');
  });

  test('1. Operador abre PDV e vê produtos disponíveis', async ({ page }) => {
    // Navegar para PDV
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Verificar se produtos estão visíveis (usar first() para evitar strict mode)
    await expect(page.locator('text=Paracetamol 750mg').first()).toBeVisible();
    await expect(page.locator('text=Dipirona 500mg').first()).toBeVisible();
    await expect(page.locator('text=Amoxicilina 500mg').first()).toBeVisible();
    
    // Verificar carrinho vazio
    await expect(page.locator('text=Carrinho vazio')).toBeVisible();
  });

  test('2. Operador busca produto específico', async ({ page }) => {
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Buscar paracetamol - tentar múltiplos seletores
    const searchInput = page.locator('input[placeholder*="Buscar"], input[type="text"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await searchInput.fill('paracetamol');
    await page.waitForTimeout(800);
    
    // Deve mostrar Paracetamol (usar first() para evitar strict mode)
    await expect(page.locator('text=Paracetamol 750mg').first()).toBeVisible();
  });

  test('3. Operador adiciona produto ao carrinho', async ({ page }) => {
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Adicionar primeiro produto
    await page.locator('button:has-text("Adicionar")').first().click();
    
    // Verificar se apareceu no carrinho
    const carrinho = page.locator('.cart-section');
    await expect(carrinho.locator('text=Paracetamol 750mg')).toBeVisible();
    
    // Verificar total no carrinho
    await expect(carrinho.locator('text=Total: R$ 12,50')).toBeVisible();
  });

  test('4. Operador adiciona múltiplos produtos', async ({ page }) => {
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Adicionar 3 produtos diferentes
    const addButtons = page.locator('button:has-text("Adicionar")');
    await addButtons.nth(0).click(); // Paracetamol
    await addButtons.nth(1).click(); // Dipirona
    await addButtons.nth(4).click(); // Vitamina D3
    
    // Verificar todos no carrinho
    const carrinho = page.locator('.cart-section');
    await expect(carrinho.locator('text=Paracetamol')).toBeVisible();
    await expect(carrinho.locator('text=Dipirona')).toBeVisible();
    await expect(carrinho.locator('text=Vitamina D3')).toBeVisible();
    
    // Verificar total: 12.50 + 8.90 + 35.90 = 57.30
    await expect(carrinho.locator('text=Total: R$ 57,30')).toBeVisible();
  });

  test('5. Operador aumenta quantidade de produto', async ({ page }) => {
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Adicionar produto
    await page.locator('button:has-text("Adicionar")').first().click();
    
    // Aumentar quantidade
    const carrinho = page.locator('.cart-section');
    await carrinho.locator('button:has-text("+")').click();
    
    // Verificar total: 12.50 * 2 = 25.00
    await expect(carrinho.locator('text=Total: R$ 25,00')).toBeVisible();
  });

  test('6. Operador remove produto do carrinho', async ({ page }) => {
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // Adicionar dois produtos
    const addButtons = page.locator('button:has-text("Adicionar")');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    
    // Remover primeiro produto
    const carrinho = page.locator('.cart-section');
    await carrinho.locator('button:has-text("×")').first().click();
    
    // Paracetamol não deve estar mais no carrinho
    await expect(carrinho.locator('text=Paracetamol')).not.toBeVisible();
    
    // Dipirona ainda deve estar
    await expect(carrinho.locator('text=Dipirona')).toBeVisible();
  });

  test.skip('7. FLUXO COMPLETO: Cliente compra e paga', async ({ page }) => {
    // Teste desabilitado - botão "Finalizar Venda" não implementado ainda
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
    
    // PASSO 1: Adicionar produtos ao carrinho
    await page.locator('button:has-text("Adicionar")').first().click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Adicionar")').nth(1).click();
    await page.waitForTimeout(500);
    
    // PASSO 2: Aumentar quantidade
    const carrinho = page.locator('.cart-section');
    await carrinho.locator('button:has-text("+")').first().click();
    await page.waitForTimeout(500);
  });

  test.skip('8. Operador tenta finalizar com carrinho vazio', async ({ page }) => {
    // Teste desabilitado - botão "Finalizar Venda" não implementado ainda
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
  });

  test.skip('9. Operador limpa carrinho', async ({ page }) => {
    // Teste desabilitado - funcionalidade não implementada ainda
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
  });

  test.skip('10. Operador cancela pagamento', async ({ page }) => {
    // Teste desabilitado - botão "Finalizar Venda" não implementado ainda
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
  });

});
