require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { Empresa, Usuario, Produto, Estoque, Fornecedor, Cliente, FluxoCaixa } = require('../src/models');

async function limparBanco() {
  try {
    console.log('🧹 Limpando banco de dados...');
    
    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    // 1. Deletar todos os usuários exceto o viniciusbatistabraz@gmail.com
    console.log('\n🗑️ Removendo outros usuários...');
    const usuariosParaManter = ['viniciusbatistabraz@gmail.com'];
    await Usuario.destroy({
      where: {
        email: {
          [sequelize.Sequelize.Op.notIn]: usuariosParaManter
        }
      }
    });
    console.log('✅ Outros usuários removidos');

    // 2. Deletar todas as empresas exceto a Farmácia Teste (onde seu usuário está)
    console.log('\n🗑️ Removendo outras empresas...');
    const empresaDoUsuario = await Usuario.findOne({
      where: { email: 'viniciusbatistabraz@gmail.com' },
      attributes: ['empresa_id']
    });

    if (empresaDoUsuario) {
      await Empresa.destroy({
        where: {
          id: {
            [sequelize.Sequelize.Op.ne]: empresaDoUsuario.empresa_id
          }
        }
      });
      console.log(`✅ Outras empresas removidas. Mantendo empresa ID: ${empresaDoUsuario.empresa_id}`);
    }

    // 3. Limpar dados relacionados (produtos, estoque, fornecedores, clientes, fluxo de caixa)
    console.log('\n🗑️ Limpando dados relacionados...');
    
    await Produto.destroy({ where: {} });
    console.log('✅ Produtos removidos');
    
    await Estoque.destroy({ where: {} });
    console.log('✅ Estoque removido');
    
    await Fornecedor.destroy({ where: {} });
    console.log('✅ Fornecedores removidos');
    
    await Cliente.destroy({ where: {} });
    console.log('✅ Clientes removidos');
    
    await FluxoCaixa.destroy({ where: {} });
    console.log('✅ Fluxo de caixa removido');

    // 4. Atualizar nome da empresa para "Farmácia C"
    if (empresaDoUsuario) {
      console.log('\n📝 Atualizando nome da empresa...');
      await Empresa.update(
        {
          nome_fantasia: 'Farmácia C',
          razao_social: 'Farmácia C Soluções Farmacêuticas Ltda',
          cnpj: '55.666.777/0001-33',
          telefone: '(11) 98765-4321',
          email: 'viniciusbatistabraz@gmail.com',
          endereco: 'Rua das Farmácias, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        { where: { id: empresaDoUsuario.empresa_id } }
      );
      console.log('✅ Empresa atualizada para Farmácia C');
    }

    // 5. Promover usuário para Admin
    console.log('\n👑 Promovendo usuário para Admin...');
    await Usuario.update(
      { 
        role: 'admin',
        cargo: 'Administrador',
        nome: 'Vinicius Batista Braz'
      },
      { where: { email: 'viniciusbatistabraz@gmail.com' } }
    );
    console.log('✅ Usuário promovido para Admin');

    // 6. Verificar resultado final
    console.log('\n📊 Verificando resultado final...');
    
    const empresasRestantes = await Empresa.findAll();
    const usuariosRestantes = await Usuario.findAll();
    
    console.log(`\n🎉 Limpeza concluída!`);
    console.log(`📦 Empresas restantes: ${empresasRestantes.length}`);
    console.log(`👥 Usuários restantes: ${usuariosRestantes.length}`);
    
    empresasRestantes.forEach(empresa => {
      console.log(`  🏢 ${empresa.nome_fantasia} (${empresa.id})`);
    });
    
    usuariosRestantes.forEach(usuario => {
      console.log(`  👤 ${usuario.nome} (${usuario.email}) - ${usuario.role}`);
    });

    console.log('\n🔑 Credenciais de acesso:');
    console.log('📧 Email: viniciusbatistabraz@gmail.com');
    console.log('🔑 Senha: farmaciac123');
    console.log('👑 Role: Admin (acesso total)');

  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar limpeza
limparBanco();
