// Mock service para autenticação - usado quando o backend não está disponível
const mockAuthService = {
  // Usuários mock para teste
  users: [
    {
      id: 1,
      nome: 'João Silva',
      email: 'admin@farmacia.com',
      senha: 'admin123',
      role: 'admin',
      empresa: {
        id: 1,
        nome_fantasia: 'Farmácia Central',
        razao_social: 'Farmácia Central Ltda',
        cnpj: '12.345.678/0001-90'
      },
      avatar: '👨‍⚕️',
      ativo: true,
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'gerente@farmacia.com',
      senha: 'gerente123',
      role: 'gerente',
      empresa: {
        id: 1,
        nome_fantasia: 'Farmácia Central',
        razao_social: 'Farmácia Central Ltda',
        cnpj: '12.345.678/0001-90'
      },
      avatar: '👩‍⚕️',
      ativo: true,
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 3,
      nome: 'Pedro Oliveira',
      email: 'funcionario@farmacia.com',
      senha: 'func123',
      role: 'funcionario',
      empresa: {
        id: 1,
        nome_fantasia: 'Farmácia Central',
        razao_social: 'Farmácia Central Ltda',
        cnpj: '12.345.678/0001-90'
      },
      avatar: '👨‍⚕️',
      ativo: true,
      createdAt: '2025-01-01T00:00:00Z'
    },
    // Farmácia B
    {
      id: 4,
      nome: 'Ana Costa',
      email: 'admin@farmaciab.com',
      senha: 'admin123',
      role: 'admin',
      empresa: {
        id: 2,
        nome_fantasia: 'Farmácia Bem-Estar',
        razao_social: 'Farmácia Bem-Estar Ltda',
        cnpj: '98.765.432/0001-10'
      },
      avatar: '👩‍⚕️',
      ativo: true,
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: 5,
      nome: 'Carlos Ferreira',
      email: 'gerente@farmaciab.com',
      senha: 'gerente123',
      role: 'gerente',
      empresa: {
        id: 2,
        nome_fantasia: 'Farmácia Bem-Estar',
        razao_social: 'Farmácia Bem-Estar Ltda',
        cnpj: '98.765.432/0001-10'
      },
      avatar: '👨‍⚕️',
      ativo: true,
      createdAt: '2025-01-15T00:00:00Z'
    },
    // Farmácia C
    {
      id: 6,
      nome: 'Vinicius Batista',
      email: 'viniciusbatistabraz@gmail.com',
      senha: 'farmaciac123',
      role: 'admin',
      empresa: {
        id: 3,
        nome_fantasia: 'Farmácia C',
        razao_social: 'Farmácia C Soluções Farmacêuticas Ltda',
        cnpj: '55.666.777/0001-33'
      },
      avatar: '👨‍⚕️',
      ativo: true,
      createdAt: '2025-01-20T00:00:00Z'
    },
    {
      id: 7,
      nome: 'Juliana Mendes',
      email: 'gerente@farmaciac.com',
      senha: 'gerente123',
      role: 'gerente',
      empresa: {
        id: 3,
        nome_fantasia: 'Farmácia C',
        razao_social: 'Farmácia C Soluções Farmacêuticas Ltda',
        cnpj: '55.666.777/0001-33'
      },
      avatar: '👩‍⚕️',
      ativo: true,
      createdAt: '2025-01-20T00:00:00Z'
    },
    {
      id: 8,
      nome: 'Roberto Almeida',
      email: 'funcionario@farmaciac.com',
      senha: 'func123',
      role: 'funcionario',
      empresa: {
        id: 3,
        nome_fantasia: 'Farmácia C',
        razao_social: 'Farmácia C Soluções Farmacêuticas Ltda',
        cnpj: '55.666.777/0001-33'
      },
      avatar: '👨‍⚕️',
      ativo: true,
      createdAt: '2025-01-20T00:00:00Z'
    },
    // Farmácia D
    {
      id: 9,
      nome: 'Luciana Pereira',
      email: 'admin@farmaciad.com',
      senha: 'admin123',
      role: 'admin',
      empresa: {
        id: 4,
        nome_fantasia: 'Farmácia Popular',
        razao_social: 'Farmácia Popular do Povo Ltda',
        cnpj: '88.999.777/0001-44'
      },
      avatar: '👩‍⚕️',
      ativo: true,
      createdAt: '2025-02-01T00:00:00Z'
    },
    {
      id: 10,
      nome: 'Felipe Santos',
      email: 'gerente@farmaciad.com',
      senha: 'gerente123',
      role: 'gerente',
      empresa: {
        id: 4,
        nome_fantasia: 'Farmácia Popular',
        razao_social: 'Farmácia Popular do Povo Ltda',
        cnpj: '88.999.777/0001-44'
      },
      avatar: '👨‍⚕️',
      ativo: true,
      createdAt: '2025-02-01T00:00:00Z'
    }
  ],

  /**
   * Simula login do usuário
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{token: string, usuario: object, requires2FA?: boolean}>}
   */
  async login(email, senha) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.users.find(u => u.email === email && u.senha === senha);

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    if (!user.ativo) {
      throw new Error('Usuário inativo. Entre em contato com o administrador.');
    }

    // Gerar token mock
    const token = this.generateToken(user);
    
    // Simular 2FA para admin (opcional)
    if (user.role === 'admin' && Math.random() > 0.5) {
      return {
        requires2FA: true,
        userId: user.id.toString(),
        message: 'Digite o código enviado para seu email'
      };
    }

    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(user));

    return {
      token,
      usuario: user
    };
  },

  /**
   * Simula validação de código 2FA
   * @param {string} userId 
   * @param {string} token 
   * @param {boolean} isBackupCode 
   * @returns {Promise<{token: string, usuario: object}>}
   */
  async validate2FA(userId, token, isBackupCode = false) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = this.users.find(u => u.id.toString() === userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Simular validação (aceita qualquer código de 6 dígitos)
    if (!token || token.length !== 6) {
      throw new Error('Código inválido');
    }

    const newToken = this.generateToken(user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(user));

    return {
      token: newToken,
      usuario: user
    };
  },

  /**
   * Simula registro de novo usuário
   * @param {object} userData 
   * @returns {Promise<{token: string, usuario: object}>}
   */
  async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Verificar se email já existe
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Criar novo usuário
    const newUser = {
      id: this.users.length + 1,
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      role: 'funcionario', // Novos usuários começam como funcionário
      empresa: {
        id: 1,
        nome_fantasia: 'Farmácia Teste',
        razao_social: 'Farmácia Teste Ltda',
        cnpj: '12.345.678/0001-90'
      },
      avatar: '👤',
      ativo: true,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);

    // Auto-login após registro
    const token = this.generateToken(newUser);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(newUser));

    return {
      token,
      usuario: newUser
    };
  },

  /**
   * Simula obtenção de dados do usuário logado
   * @returns {Promise<object>}
   */
  async me() {
    await new Promise(resolve => setTimeout(resolve, 200));

    const user = this.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    return user;
  },

  /**
   * Logout do usuário
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtém usuário do localStorage
   * @returns {object|null}
   */
  getUser() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verifica se usuário tem permissão
   * @param {string|string[]} roles 
   * @returns {boolean}
   */
  hasRole(roles) {
    const user = this.getUser();
    if (!user) return false;
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  },

  /**
   * Gera token JWT mock
   * @param {object} user 
   * @returns {string}
   */
  generateToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  },

  /**
   * Simula verificação de token
   * @param {string} token 
   * @returns {object|null}
   */
  verifyToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      
      if (payload.exp < Date.now()) {
        return null; // Token expirado
      }
      
      return payload;
    } catch (error) {
      return null;
    }
  },

  /**
   * Simula solicitação de recuperação de senha
   * @param {string} email 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async forgotPassword(email) {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Verificar se email existe
    const mockUsers = [
      'admin@farmacia.com',
      'gerente@farmacia.com', 
      'funcionario@farmacia.com',
      'admin@farmaciab.com',
      'gerente@farmaciab.com',
      'viniciusbatistabraz@gmail.com',
      'gerente@farmaciac.com',
      'funcionario@farmaciac.com',
      'admin@farmaciad.com',
      'gerente@farmaciad.com'
    ];
    const user = this.users.find(u => u.email === email);
    if (!user && !mockUsers.includes(email)) {
      return {
        success: false,
        message: 'Este email não está cadastrado no sistema'
      };
    }
    

    // Gerar token de recuperação (32 caracteres alfanuméricos)
    const resetToken = this.generateResetToken();
    
    // Simular envio de email
    console.log(`📧 Token de recuperação para ${email}: ${resetToken}`);
    console.log(`🔗 Link de redefinição: http://localhost:3000/reset-password?token=${resetToken}`);

    return {
      success: true,
      message: `Email de recuperação enviado para ${email}`
    };
  },

  /**
   * Simula redefinição de senha
   * @param {string} token 
   * @param {string} novaSenha 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async resetPassword(token, novaSenha) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validar formato do token
    const tokenPattern = /^[A-Za-z0-9]{32,}$/;
    if (!tokenPattern.test(token)) {
      return {
        success: false,
        message: 'Token de recuperação inválido'
      };
    }

    // Simular validação do token (em produção, verificar no banco)
    // Para mock, vamos aceitar qualquer token com formato válido
    
    // Validar senha
    if (!novaSenha || novaSenha.length < 6) {
      return {
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      };
    }

    // Simular atualização da senha
    console.log(`🔐 Senha redefinida com sucesso para o token: ${token}`);

    return {
      success: true,
      message: 'Senha redefinida com sucesso'
    };
  },

  /**
   * Simula verificação de token de recuperação
   * @param {string} token 
   * @returns {Promise<{valid: boolean, message: string}>}
   */
  async verifyResetToken(token) {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Validar formato do token
    const tokenPattern = /^[A-Za-z0-9]{32,}$/;
    if (!tokenPattern.test(token)) {
      return {
        valid: false,
        message: 'Token de recuperação inválido ou expirado'
      };
    }

    // Simular verificação (em produção, verificar no banco)
    return {
      valid: true,
      message: 'Token válido'
    };
  },

  /**
   * Gera token de recuperação de senha
   * @returns {string}
   */
  generateResetToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
};

export default mockAuthService;
