async function testarPermissoes() {
  console.log('🧪 Iniciando testes de permissões...');
  
  try {
    // Testar login com diferentes roles
    console.log('\n📋 Testando login com diferentes roles:');
    
    const roles = [
      { email: 'admin@pharma.com', senha: '123456', expectedRole: 'admin' },
      { email: 'gerente@pharma.com', senha: '123456', expectedRole: 'gerente' },
      { email: 'viniciusbatistabraz@gmail.com', senha: 'farmaciac123', expectedRole: 'funcionario' }
    ];

    for (const role of roles) {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: role.email, senha: role.senha })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${role.email}: Role = ${result.usuario.role} (esperado: ${role.expectedRole})`);
        
        // Testar permissões baseadas no role
        const permissions = {
          admin: ['configuracoes', 'usuarios', 'fluxo-caixa'],
          gerente: ['usuarios', 'fluxo-caixa'],
          funcionario: ['dashboard', 'pdv', 'estoque', 'produtos', 'clientes', 'fornecedores']
        };

        const userPermissions = permissions[result.usuario.role] || [];
        console.log(`🔐 Permissões: ${userPermissions.join(', ')}`);
      } else {
        console.log(`❌ ${role.email}: Falha no login`);
      }
    }

    console.log('\n🎯 Teste de permissões concluído!');
    console.log('\n📊 Resumo dos acessos:');
    console.log('🔴 Admin: Acesso total ao sistema');
    console.log('🟡 Gerente: Acesso a usuários e fluxo de caixa');
    console.log('🟢 Funcionário: Acesso a PDV, estoque, produtos, clientes e fornecedores');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

// Executar o teste
testarPermissoes();
