# Como Executar os Testes do PDV

## 📋 Testes Disponíveis

### 1. Testes Unitários (Jest)
- **PDV.test.js** - Testes unitários completos do componente PDV
- **20 casos de teste** cobrindo todas as funcionalidades

### 2. Testes E2E (Playwright)
- **pdv-completo.spec.js** - Teste completo com 20 cenários
- **pdv-operacoes-caixa.spec.js** - Testes específicos de caixa e estorno
- **pdv-scanner.spec.js** - Testes do scanner de código de barras
- **pdv-venda-completa.spec.js** - Testes do fluxo completo de venda

## 🚀 Como Executar

### Pré-requisitos
```bash
# Instalar dependências
npm install

# Instalar Playwright (se ainda não tiver)
npx playwright install
```

### Testes Unitários
```bash
# Executar todos os testes do PDV
npm test -- --testPathPattern=PDV

# Executar em modo watch
npm test -- --testPathPattern=PDV --watch

# Executar com coverage
npm test -- --testPathPattern=PDV --coverage
```

### Testes E2E
```bash
# Executar todos os testes E2E do PDV (headless)
npx playwright test e2e/pdv-*.spec.js

# Executar com navegador visível
npx playwright test e2e/pdv-*.spec.js --headed

# Executar teste completo específico
npx playwright test e2e/pdv-completo.spec.js

# Executar testes de operações de caixa
npx playwright test e2e/pdv-operacoes-caixa.spec.js

# Executar testes do scanner
npx playwright test e2e/pdv-scanner.spec.js

# Executar testes de venda completa
npx playwright test e2e/pdv-venda-completa.spec.js
```

## 📊 Relatórios

### Gerar Relatório HTML
```bash
npx playwright show-report
```

### Ver Coverage
```bash
# Abrir coverage em navegador
open coverage/lcov-report/index.html
```

## 🔧 Testes Específicos

### Funcionalidades Testadas

#### 1. **Layout e Interface**
- ✅ Carregamento do PDV
- ✅ Menu de ações
- ✅ Modo escuro
- ✅ Layout responsivo
- ✅ Performance

#### 2. **Scanner de Código de Barras**
- ✅ Scanner visível
- ✅ Leitura de código
- ✅ Feedback visual
- ✅ Adição ao carrinho

#### 3. **Busca e Filtros**
- ✅ Busca por nome
- ✅ Filtros de categoria
- ✅ Limpeza de busca
- ✅ Resultados corretos

#### 4. **Carrinho de Compras**
- ✅ Adicionar produtos
- ✅ Ajustar quantidade
- ✅ Remover produtos
- ✅ Cálculo de total
- ✅ Formatação de moeda

#### 5. **Operações de Venda**
- ✅ Finalizar venda
- ✅ Cancelar venda
- ✅ Seleção de cliente
- ✅ Cadastro de cliente
- ✅ Validação de estoque

#### 6. **Operações de Caixa**
- ✅ Abrir caixa
- ✅ Fechar caixa
- ✅ Sangria
- ✅ Suprimento
- ✅ Validação de valores

#### 7. **Estorno**
- ✅ Modal de estorno
- ✅ Validação de ID
- ✅ Confirmação
- ✅ Cancelamento

#### 8. **Navegação**
- ✅ Links internos
- ✅ Histórico
- ✅ Relatórios
- ✅ Persistência

#### 9. **Tratamento de Erros**
- ✅ Estoque insuficiente
- ✅ Conexão perdida
- ✅ Valores inválidos
- ✅ Validação de formulários

#### 10. **Acessibilidade**
- ✅ Navegação por teclado
- ✅ Foco em elementos
- ✅ Contraste de cores
- ✅ Leitores de tela

## 🎯 Cenários de Teste

### Fluxo Completo de Venda
1. Login no sistema
2. Navegação para PDV
3. Busca de produtos
4. Adição ao carrinho
5. Seleção de cliente
6. Finalização da venda
7. Limpeza do carrinho

### Operações de Caixa
1. Abrir caixa com valor inicial
2. Realizar sangria
3. Realizar suprimento
4. Fechar caixa com relatório

### Estorno de Venda
1. Selecionar venda para estorno
2. Confirmar operação
3. Verificar devolução ao estoque
4. Cancelar estorno

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Testes falhando por timeout
```bash
# Aumentar timeout
npx playwright test --timeout=10000
```

#### 2. Elementos não encontrados
- Verificar se os seletores estão corretos
- Aguardar carregamento completo da página
- Usar `waitForTimeout()` quando necessário

#### 3. Dialogs não aparecendo
```javascript
// Mock de dialogs
page.on('dialog', dialog => {
  dialog.accept();
});
```

#### 4. Problemas com modo escuro
- Verificar se as cores estão corretas
- Usar `getComputedStyle()` para validar
- Testar em diferentes navegadores

### Debug de Testes

#### 1. Modo desenvolvedor
```bash
npx playwright test --debug
```

#### 2. Screenshots em falhas
```bash
npx playwright test --screenshot=on
```

#### 3. Vídeo dos testes
```bash
npx playwright test --video=on
```

## 📈 Métricas

### Coverage Esperado
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Performance
- **Carregamento**: < 3 segundos
- **Busca**: < 1 segundo
- **Adição ao carrinho**: < 500ms

## 🔄 Execução Automática

### CI/CD
```yaml
# Exemplo de GitHub Actions
- name: Run PDV Tests
  run: |
    npm run test:pdv
    npx playwright test e2e/pdv-*.spec.js
```

### Pre-commit
```json
{
  "hooks": {
    "pre-commit": "npm run test:pdv"
  }
}
```

## 📝 Notas

### Dados de Teste
- **Usuário**: gerente@pharma.com
- **Senha**: 123456
- **Produtos**: Paracetamol, Dipirona, Amoxicilina
- **Clientes**: João Silva, Maria Santos

### Ambiente
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3333
- **Banco**: PostgreSQL

### Navegadores Suportados
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit
- ✅ Edge

## 🎉 Resultados Esperados

Ao executar todos os testes, você deve ter:

1. **20 testes unitários** passando
2. **20 testes E2E** passando
3. **Coverage > 90%**
4. **Relatório HTML** detalhado
5. **Screenshots** dos testes
6. **Vídeos** das execuções

Isso garante que o PDV está 100% funcional e pronto para produção! 🚀
