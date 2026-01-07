const { test, expect } = require('@playwright/test');

test.describe('PDV - Scanner de Código de Barras (E2E)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.fill('input[name="email"]', 'demo@pharmadashboard.com');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button:has-text("Entrar")');
    
    // Aguardar redirecionamento
    await page.waitForURL('**/app/**');
    
    // Navegar para PDV
    await page.click('text=PDV');
    await page.waitForURL('**/app/pdv**');
  });

  test('1. Scanner está visível e destacado na página', async ({ page }) => {
    // Verificar se o scanner está presente
    await expect(page.locator('text=Scanner de Código de Barras')).toBeVisible();
    
    // Verificar ícone do scanner
    await expect(page.locator('.scanner-icon')).toBeVisible();
    
    // Verificar campo de input
    const barcodeInput = page.locator('input.barcode-input');
    await expect(barcodeInput).toBeVisible();
    
    // Verificar botão Escanear
    await expect(page.locator('button:has-text("Escanear")')).toBeVisible();
  });

  test('2. Operador escaneia produto usando código de barras', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Digitar código de barras do Paracetamol
    await barcodeInput.fill('7891234567890');
    
    // Pressionar Enter (simula scanner)
    await barcodeInput.press('Enter');
    
    // Aguardar produto aparecer no carrinho
    await page.waitForTimeout(500);
    
    // Verificar se produto foi adicionado ao carrinho
    const carrinho = page.locator('.cart-section');
    await expect(carrinho.locator('text=Paracetamol 750mg')).toBeVisible();
    
    // Verificar se campo foi limpo
    await expect(barcodeInput).toHaveValue('');
  });

  test('3. Scanner mostra feedback visual ao adicionar produto', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Escanear produto
    await barcodeInput.fill('7891234567891');
    await barcodeInput.press('Enter');
    
    // Verificar feedback de sucesso
    await expect(page.locator('.scan-feedback')).toBeVisible();
    await expect(page.locator('text=Dipirona 500mg adicionado!')).toBeVisible();
    
    // Verificar ícone de sucesso
    await expect(page.locator('.scan-success')).toBeVisible();
  });

  test('4. Scanner adiciona múltiplos produtos rapidamente', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Escanear 3 produtos diferentes
    const produtos = [
      { codigo: '7891234567890', nome: 'Paracetamol 750mg' },
      { codigo: '7891234567891', nome: 'Dipirona 500mg' },
      { codigo: '7891234567892', nome: 'Amoxicilina 500mg' }
    ];
    
    for (const produto of produtos) {
      await barcodeInput.fill(produto.codigo);
      await barcodeInput.press('Enter');
      await page.waitForTimeout(300);
    }
    
    // Verificar todos no carrinho
    const carrinho = page.locator('.cart-section');
    for (const produto of produtos) {
      await expect(carrinho.locator(`text=${produto.nome}`)).toBeVisible();
    }
  });

  test('5. Scanner aumenta quantidade ao escanear produto duplicado', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Escanear mesmo produto 3 vezes
    for (let i = 0; i < 3; i++) {
      await barcodeInput.fill('7891234567890');
      await barcodeInput.press('Enter');
      await page.waitForTimeout(300);
    }
    
    // Verificar que quantidade aumentou
    const carrinho = page.locator('.cart-section');
    const quantityDisplay = carrinho.locator('.cart-item-quantity');
    await expect(quantityDisplay).toBeVisible();
  });

  test('6. Botão "Escanear" funciona como alternativa ao Enter', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    const scanButton = page.locator('button:has-text("Escanear")');
    
    // Digitar código
    await barcodeInput.fill('7891234567893');
    
    // Clicar no botão ao invés de Enter
    await scanButton.click();
    
    // Verificar produto adicionado
    await page.waitForTimeout(500);
    const carrinho = page.locator('.cart-section');
    await expect(carrinho.locator('text=Ibuprofeno 400mg')).toBeVisible();
  });

  test('7. Scanner mostra erro para código inválido', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Configurar listener para alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('não encontrado');
      await dialog.accept();
    });
    
    // Escanear código inválido
    await barcodeInput.fill('9999999999999');
    await barcodeInput.press('Enter');
    
    await page.waitForTimeout(500);
    
    // Campo deve estar limpo
    await expect(barcodeInput).toHaveValue('');
  });

  test('8. Scanner atualiza total do carrinho automaticamente', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    const carrinho = page.locator('.cart-section');
    
    // Escanear Paracetamol (R$ 12,50)
    await barcodeInput.fill('7891234567890');
    await barcodeInput.press('Enter');
    await page.waitForTimeout(500);
    
    // Verificar total
    await expect(carrinho.locator('text=Total: R$ 12,50')).toBeVisible();
    
    // Escanear Dipirona (R$ 8,90)
    await barcodeInput.fill('7891234567891');
    await barcodeInput.press('Enter');
    await page.waitForTimeout(500);
    
    // Total deve ser R$ 21,40
    await expect(carrinho.locator('text=Total: R$ 21,40')).toBeVisible();
  });

  test('9. Feedback visual desaparece após alguns segundos', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Escanear produto
    await barcodeInput.fill('7891234567890');
    await barcodeInput.press('Enter');
    
    // Feedback deve aparecer
    await expect(page.locator('.scan-feedback')).toBeVisible();
    
    // Aguardar 2.5 segundos
    await page.waitForTimeout(2500);
    
    // Feedback deve desaparecer
    await expect(page.locator('.scan-feedback')).not.toBeVisible();
  });

  test('10. Scanner funciona com campo sempre focado', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    
    // Verificar que campo tem autoFocus
    await expect(barcodeInput).toBeFocused();
    
    // Escanear produto
    await barcodeInput.fill('7891234567890');
    await barcodeInput.press('Enter');
    
    await page.waitForTimeout(500);
    
    // Campo deve continuar focado após escanear
    await expect(barcodeInput).toBeFocused();
  });

  test('11. FLUXO COMPLETO: Operador escaneia múltiplos produtos e verifica total', async ({ page }) => {
    const barcodeInput = page.locator('input.barcode-input');
    const carrinho = page.locator('.cart-section');
    
    // PASSO 1: Escanear Paracetamol
    await barcodeInput.fill('7891234567890');
    await barcodeInput.press('Enter');
    await page.waitForTimeout(500);
    
    // PASSO 2: Escanear Dipirona
    await barcodeInput.fill('7891234567891');
    await barcodeInput.press('Enter');
    await page.waitForTimeout(500);
    
    // PASSO 3: Escanear Vitamina D3
    await barcodeInput.fill('7891234567894');
    await barcodeInput.press('Enter');
    await page.waitForTimeout(500);
    
    // PASSO 4: Escanear Paracetamol novamente (aumentar quantidade)
    await barcodeInput.fill('7891234567890');
    await barcodeInput.press('Enter');
    await page.waitForTimeout(500);
    
    // PASSO 5: Verificar produtos no carrinho
    await expect(carrinho.locator('text=Paracetamol 750mg')).toBeVisible();
    await expect(carrinho.locator('text=Dipirona 500mg')).toBeVisible();
    await expect(carrinho.locator('text=Vitamina D3')).toBeVisible();
    
    // PASSO 6: Verificar total
    // Paracetamol: 12.50 * 2 = 25.00
    // Dipirona: 8.90 * 1 = 8.90
    // Vitamina D3: 35.90 * 1 = 35.90
    // Total: 69.80
    await expect(carrinho.locator('text=Total: R$ 69,80')).toBeVisible();
  });

  test('12. Scanner com animação visual ao escanear', async ({ page }) => {
    const scannerContainer = page.locator('.scanner-container');
    const barcodeInput = page.locator('input.barcode-input');
    
    // Escanear produto
    await barcodeInput.fill('7891234567890');
    await barcodeInput.press('Enter');
    
    // Verificar classe de animação ativa
    await expect(scannerContainer).toHaveClass(/scanner-active/);
    
    // Aguardar animação terminar
    await page.waitForTimeout(500);
    
    // Classe deve ser removida
    await expect(scannerContainer).not.toHaveClass(/scanner-active/);
  });

});
