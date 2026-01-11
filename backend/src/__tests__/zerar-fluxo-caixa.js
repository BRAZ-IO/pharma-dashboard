const { FluxoCaixa } = require('../models');
const { sequelize } = require('../config/database');

async function zerarFluxoCaixa() {
  try {
    console.log('🧹 Zerando fluxo de caixa...');
    
    // 1. Contar registros antes
    const totalAntes = await FluxoCaixa.count();
    console.log(`📊 Registros antes: ${totalAntes}`);
    
    if (totalAntes === 0) {
      console.log('✅ Fluxo de caixa já está vazio!');
      return;
    }
    
    // 2. Remover todos os registros
    await FluxoCaixa.destroy({
      where: {},
      truncate: true
    });
    
    // 3. Verificar depois
    const totalDepois = await FluxoCaixa.count();
    console.log(`📊 Registros depois: ${totalDepois}`);
    
    if (totalDepois === 0) {
      console.log('✅ Fluxo de caixa zerado com sucesso!');
    } else {
      console.log('❌ Alguns registros não foram removidos');
    }
    
  } catch (error) {
    console.error('❌ Erro ao zerar fluxo de caixa:', error);
  } finally {
    await sequelize.close();
  }
}

zerarFluxoCaixa();
