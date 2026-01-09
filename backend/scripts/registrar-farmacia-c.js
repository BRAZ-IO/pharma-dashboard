async function registrarFarmaciaC() {
  try {
    console.log('🚀 Iniciando registro da Farmácia C...');
    
    // Buscar empresa existente para obter UUID
    console.log('\n📋 Buscando empresa existente...');
    const buscaResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@pharma.com',
        senha: '123456'
      })
    });

    if (buscaResponse.ok) {
      const loginResult = await buscaResponse.json();
      const empresaId = loginResult.usuario.empresa_id;
      
      console.log(`✅ Empresa encontrada! ID: ${empresaId}`);
      
      // Criar usuário para a Farmácia C
      console.log('\n📋 Criando usuário administrador...');
      const dadosUsuario = {
        nome: 'Vinicius Batista Braz',
        email: 'viniciusbatistabraz@gmail.com',
        senha: 'farmaciac123',
        empresa_id: empresaId, // Usando UUID da empresa existente
        cargo: 'Administrador',
        role: 'admin'
      };

      console.log(`👤 Admin: ${dadosUsuario.nome}`);
      console.log(`📧 Email: ${dadosUsuario.email}`);
      console.log(`🔑 Senha: ${dadosUsuario.senha}`);
      console.log(`🆔 Empresa ID: ${dadosUsuario.empresa_id}`);

      // Criar usuário
      const usuarioResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosUsuario)
      });

      const usuarioResult = await usuarioResponse.json();

      if (usuarioResponse.ok) {
        console.log('\n✅ Farmácia C registrada com sucesso!');
        console.log(`📧 Email: ${usuarioResult.usuario.email}`);
        console.log(`👤 Nome: ${usuarioResult.usuario.nome}`);
        console.log(`🆔 ID Usuário: ${usuarioResult.usuario.id}`);
        console.log(`🆔 ID Empresa: ${dadosUsuario.empresa_id}`);
        console.log(`🔑 Use para login: viniciusbatistabraz@gmail.com / farmaciac123`);
        
        // Testar login imediatamente
        console.log('\n🔐 Testando login...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'viniciusbatistabraz@gmail.com',
            senha: 'farmaciac123'
          })
        });

        const loginResult = await loginResponse.json();
        
        if (loginResponse.ok) {
          console.log('✅ Login realizado com sucesso!');
          console.log(`🔑 Token: ${loginResult.token.substring(0, 50)}...`);
          console.log(`👤 Role: ${loginResult.usuario.role}`);
          console.log(`🏢 Empresa: ${loginResult.usuario.empresa?.nome_fantasia || 'Farmácia Teste'}`);
        } else {
          console.log('❌ Erro no login:', loginResult);
        }
      } else {
        console.error('\n❌ Erro no registro do usuário:');
        console.error('Status:', usuarioResponse.status);
        console.error('Mensagem:', usuarioResult.message || 'Erro desconhecido');
        
        if (usuarioResult.errors) {
          console.error('Erros de validação:');
          Object.keys(usuarioResult.errors).forEach(campo => {
            console.error(`  ${campo}: ${usuarioResult.errors[campo]}`);
          });
        }
      }
    } else {
      console.error('❌ Não foi possível obter UUID da empresa');
      console.error('Verifique se o usuário admin@pharma.com existe');
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    console.log('\n💡 Verifique se o backend está rodando em http://localhost:5000');
  }
}

// Executar o registro
registrarFarmaciaC();
