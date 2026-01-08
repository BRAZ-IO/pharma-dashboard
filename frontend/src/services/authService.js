import api from './api';

const authService = {
  /**
   * Login do usuário
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{token: string, usuario: object, requires2FA?: boolean}>}
   */
  async login(email, senha) {
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
    return !!localStorage.getItem('token');
  },

  /**
   * Obter usuário do localStorage
   * @returns {object|null}
   */
  getUser() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verificar se usuário tem permissão
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
