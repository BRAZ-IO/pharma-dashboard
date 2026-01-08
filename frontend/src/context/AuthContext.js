import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há usuário logado ao carregar
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('usuario');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setEmpresa(userData.empresa || null);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await authService.login(email, senha);
      
      // Se requer 2FA, retornar para o componente tratar
      if (data.requires2FA) {
        return data;
      }
      
      // Login bem-sucedido
      setUser(data.usuario);
      setEmpresa(data.usuario.empresa || null);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setEmpresa(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('usuario', JSON.stringify(userData));
  };

  const value = {
    user,
    empresa,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    // Helpers
    userName: user?.nome || 'Usuário',
    userRole: user?.role === 'admin' ? 'Administrador' : 
              user?.role === 'gerente' ? 'Gerente' : 
              user?.role === 'funcionario' ? 'Funcionário' : 'Usuário',
    empresaNome: empresa?.nome_fantasia || 'Farmácia',
    hasRole: (roles) => {
      if (!user) return false;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      return allowedRoles.includes(user.role);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
