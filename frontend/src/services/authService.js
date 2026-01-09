import api from './api';
import mockAuthService from './mockAuthService';

// Detectar se estamos em modo de desenvolvimento sem backend
const USE_MOCK_SERVICE = false; // Desativado para usar backend real

const authService = {
  /**
   * Login do usuário
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{token: string, usuario: object, requires2FA?: boolean}>}
   */
  async login(email, senha) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.login(email, senha);
    }

    try {
      const { data } = await api.post('/auth/login', { email, senha });
      
      // Se 2FA está ativado
      if (data.requires2FA) {
        return {
          requires2FA: true,
          userId: data.userId,
          message: data.message
        };
      }
      
      // Login normal
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Validar código 2FA
   * @param {string} userId 
   * @param {string} token 
   * @param {boolean} isBackupCode 
   * @returns {Promise<{token: string, usuario: object}>}
   */
  async validate2FA(userId, token, isBackupCode = false) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.validate2FA(userId, token, isBackupCode);
    }

    try {
      const { data } = await api.post('/2fa/validate', {
        userId,
        token,
        isBackupCode
      });
      
      if (data.valid) {
        // Fazer login novamente para obter token
        const loginData = await this.loginAfter2FA(userId);
        return loginData;
      }
      
      throw new Error('Código inválido');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Registrar novo usuário
   * @param {object} userData 
   * @returns {Promise<{token: string, usuario: object}>}
   */
  async register(userData) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.register(userData);
    }

    try {
      const { data } = await api.post('/auth/register', userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Obter dados do usuário logado
   * @returns {Promise<object>}
   */
  async me() {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.me();
    }

    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      return data.usuario;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Logout
   */
  logout() {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return mockAuthService.logout();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  /**
   * Verificar se usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return mockAuthService.isAuthenticated();
    }

    return !!localStorage.getItem('token');
  },

  /**
   * Obter usuário do localStorage
   * @returns {object|null}
   */
  getUser() {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return mockAuthService.getUser();
    }

    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verificar se usuário tem permissão
   * @param {string|string[]} roles 
   * @returns {boolean}
   */
  hasRole(roles) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return mockAuthService.hasRole(roles);
    }

    const user = this.getUser();
    if (!user) return false;
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  },

  /**
   * Solicitar recuperação de senha
   * @param {string} email 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async forgotPassword(email) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.forgotPassword(email);
    }

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Redefinir senha com token
   * @param {string} token 
   * @param {string} novaSenha 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async resetPassword(token, novaSenha) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.resetPassword(token, novaSenha);
    }

    try {
      const { data } = await api.post('/auth/reset-password', { token, novaSenha });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Verificar token de recuperação
   * @param {string} token 
   * @returns {Promise<{valid: boolean, message: string}>}
   */
  async verifyResetToken(token) {
    // Usar mock service se estiver em modo desenvolvimento
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.verifyResetToken(token);
    }

    try {
      const { data } = await api.post('/auth/verify-reset-token', { token });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Tratar erros da API
   * @param {Error} error 
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Erro na requisição';
      return new Error(message);
    }
    
    if (error.request) {
      return new Error('Servidor não respondeu. Verifique sua conexão.');
    }
    
    return error;
  }
};

export default authService;
