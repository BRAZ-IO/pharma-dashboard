const express = require('express');
const router = express.Router();
const { FluxoCaixa, Venda, Usuario } = require('../models');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

// Endpoint de diagnóstico
router.get('/diagnostico', async (req, res) => {
  try {
    console.log('🔍 Iniciando diagnóstico do sistema...');
    
    // 1. Verificar se modelos estão carregados
    const modelosCarregados = {
      FluxoCaixa: !!FluxoCaixa,
      Venda: !!Venda,
      Usuario: !!Usuario
    };
    
    // 2. Verificar tabela FluxoCaixa
    const totalRegistros = await FluxoCaixa.count();
    const registrosEmpresa = await FluxoCaixa.count({
      where: { empresa_id: req.empresaId }
    });
    
    // 3. Verificar vendas
    const totalVendas = await Venda.count({
      where: { empresa_id: req.empresaId }
    });
    
    // 4. Tentar criar um registro de teste
    const teste = await FluxoCaixa.create({
      descricao: 'REGISTRO DE TESTE - DIAGNÓSTICO',
      tipo: 'entrada',
      valor: 0.01,
      categoria: 'Teste',
      data: new Date(),
      responsavel: 'Sistema',
      observacoes: 'Registro automático de diagnóstico',
      empresa_id: req.empresaId
    });
    
    // 5. Buscar o registro criado
    const registroBuscado = await FluxoCaixa.findByPk(teste.id);
    
    // 6. Remover registro de teste
    await registroBuscado.destroy();
    
    res.json({
      status: '✅ Fluxo de caixa está funcional',
      modelos: modelosCarregados,
      banco_dados: {
        total_registros_fluxo: totalRegistros,
        registros_empresa: registrosEmpresa,
        total_vendas: totalVendas
      },
      teste_criacao: {
        sucesso: !!registroBuscado,
        id_criado: teste.id,
        id_removido: registroBuscado?.id
      },
      recomendacoes: registrosEmpresa === 0 ? 
        'Nenhum registro encontrado. Execute o seed ou crie registros manualmente.' :
        'Sistema funcionando normalmente.'
    });
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    res.status(500).json({
      status: '❌ Fluxo de caixa com problemas',
      erro: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
