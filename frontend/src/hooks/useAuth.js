import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const register = useCallback((userData) => {
    // Simulate registration
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    // Auto-login after registration
    login(newUser);
    return newUser;
  }, [login]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    register
  };
};

export default useAuth;
