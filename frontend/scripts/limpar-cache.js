// Script para limpar cache e localStorage do frontend
console.log('🧹 Limpando cache do frontend...');

// Limpar localStorage
if (typeof window !== 'undefined') {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('refreshToken');
  console.log('✅ LocalStorage limpo');
  
  // Limpar sessionStorage
  sessionStorage.clear();
  console.log('✅ SessionStorage limpo');
  
  // Recarregar página
  console.log('🔄 Recarregando página...');
  window.location.reload();
} else {
  console.log('⚠️ Execute este script no console do navegador');
}

// Instruções para limpar cache manualmente:
console.log(`
📋 Instruções para limpar cache manualmente:
1. Abra o DevTools (F12)
2. Vá para Application/Storage
3. Clique com botão direito em Local Storage
4. Selecione "Clear"
5. Recarregue a página (F5)

🔑 Depois faça login novamente:
Email: viniciusbatistabraz@gmail.com
Senha: farmaciac123
`);
