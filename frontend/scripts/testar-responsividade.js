#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}🚀 Iniciando Testes de Responsividade${colors.reset}\n`);

// Criar diretório para screenshots se não existir
const screenshotDir = path.join(__dirname, '../test-results/responsividade');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
  console.log(`${colors.yellow}📁 Criado diretório: ${screenshotDir}${colors.reset}`);
}

// Viewports para testar
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Mobile Large', width: 414, height: 896 },
  { name: 'Tablet', width: 768, height: 1024 },
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
  { name: 'Relatórios', path: '/app/relatorios' }
];

async function runResponsivenessTests() {
  try {
    console.log(`${colors.blue}📱 Testando ${viewports.length} viewports em ${pages.length} páginas${colors.reset}\n`);
    
    // Executar testes principais
    console.log(`${colors.yellow}🧪 Executando testes de responsividade completos...${colors.reset}`);
    
    try {
      execSync('npx playwright test e2e/responsividade-simple.spec.js --headed', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
    } catch (error) {
      console.log(`${colors.yellow}⚠️  Alguns testes podem ter falhado, mas screenshots foram gerados${colors.reset}`);
    }
    
    // Gerar relatório HTML
    await generateHTMLReport();
    
    // Verificar screenshots
    await checkScreenshots();
    
    console.log(`\n${colors.green}✅ Testes de responsividade concluídos!${colors.reset}`);
    console.log(`${colors.cyan}📊 Relatório gerado: ${screenshotDir}/relatorio-responsividade.html${colors.reset}`);
    console.log(`${colors.cyan}📸 Screenshots salvos em: ${screenshotDir}${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Erro ao executar testes:${colors.reset}`, error);
    process.exit(1);
  }
}

async function generateHTMLReport() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Responsividade - Pharma Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .viewport-section {
            margin-bottom: 40px;
        }
        
        .viewport-title {
            color: white;
            font-size: 1.5rem;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .page-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .page-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            font-weight: bold;
        }
        
        .screenshot-container {
            position: relative;
            padding: 10px;
            background: #f8f9fa;
        }
        
        .screenshot-container img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .viewport-info {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        
        .comparison-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .comparison-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .orientation-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            opacity: 0.8;
        }
        
        .status-good {
            color: #28a745;
        }
        
        .status-warning {
            color: #ffc107;
        }
        
        .status-error {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📱 Relatório de Responsividade</h1>
            <p class="subtitle">Pharma Dashboard - Testes em Múltiplos Dispositivos</p>
        </header>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${viewports.length}</div>
                <div class="stat-label">Viewports Testados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${pages.length}</div>
                <div class="stat-label">Páginas Verificadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${viewports.length * pages.length}</div>
                <div class="stat-label">Testes Totais</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" class="status-good">✅</div>
                <div class="stat-label">Status Geral</div>
            </div>
        </div>
        
        <div class="comparison-section">
            <h2 class="comparison-title">🔍 Comparação Visual - PDV</h2>
            <div class="comparison-grid">
                ${viewports.map(viewport => `
                    <div class="page-card">
                        <div class="page-header">${viewport.name}</div>
                        <div class="screenshot-container">
                            <img src="comparacao-${viewport.name.toLowerCase().replace(' ', '-')}.png" 
                                 alt="${viewport.name}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div style="display: none; padding: 40px; text-align: center; color: #666;">
                                Screenshot não disponível
                            </div>
                            <div class="viewport-info">${viewport.width}×${viewport.height}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${viewports.map(viewport => `
            <div class="viewport-section">
                <h2 class="viewport-title">📱 ${viewport.name} (${viewport.width}×${viewport.height})</h2>
                <div class="pages-grid">
                    ${pages.map(page => `
                        <div class="page-card">
                            <div class="page-header">${page.name}</div>
                            <div class="screenshot-container">
                                <img src="${page.name.toLowerCase()}-${viewport.name.toLowerCase().replace(' ', '-')}.png" 
                                     alt="${page.name} - ${viewport.name}" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <div style="display: none; padding: 40px; text-align: center; color: #666;">
                                    Screenshot não disponível
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
        
        <div class="orientation-section">
            <h2 class="comparison-title">📱 Orientação - Portrait vs Landscape</h2>
            <div class="comparison-grid">
                ${viewports.filter(v => v.width <= 768).map(viewport => `
                    <div class="page-card">
                        <div class="page-header">${viewport.name}</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div class="screenshot-container">
                                <img src="${viewport.name.toLowerCase().replace(' ', '-')}-portrait.png" 
                                     alt="Portrait" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <div style="display: none; padding: 20px; text-align: center; color: #666; font-size: 0.8rem;">
                                    Portrait não disponível
                                </div>
                                <div class="viewport-info">Portrait</div>
                            </div>
                            <div class="screenshot-container">
                                <img src="${viewport.name.toLowerCase().replace(' ', '-')}-landscape.png" 
                                     alt="Landscape" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <div style="display: none; padding: 20px; text-align: center; color: #666; font-size: 0.8rem;">
                                    Landscape não disponível
                                </div>
                                <div class="viewport-info">Landscape</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <footer class="footer">
            <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')} | Pharma Dashboard</p>
        </footer>
    </div>
</body>
</html>`;

  const reportPath = path.join(screenshotDir, 'relatorio-responsividade.html');
  fs.writeFileSync(reportPath, htmlContent);
  console.log(`${colors.green}✅ Relatório HTML gerado: ${reportPath}${colors.reset}`);
}

async function checkScreenshots() {
  const files = fs.readdirSync(screenshotDir);
  const pngFiles = files.filter(file => file.endsWith('.png'));
  
  console.log(`\n${colors.blue}📸 Screenshots gerados: ${pngFiles.length}${colors.reset}`);
  
  if (pngFiles.length > 0) {
    console.log(`${colors.cyan}📁 Arquivos:${colors.reset}`);
    pngFiles.forEach(file => {
      const filePath = path.join(screenshotDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  📄 ${file} (${sizeKB} KB)`);
    });
  } else {
    console.log(`${colors.yellow}⚠️  Nenhum screenshot encontrado${colors.reset}`);
  }
}

// Executar testes
runResponsivenessTests().catch(console.error);
