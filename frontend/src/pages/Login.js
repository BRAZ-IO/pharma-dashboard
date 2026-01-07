import React, { useState } from 'react';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { Link } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { goToDashboard } = useAppNavigation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - in real app, this would call an API
    localStorage.setItem('isAuthenticated', 'true');
    goToDashboard();
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🚀</span>
            <h1>Sistema</h1>
          </div>
          <p>Faça login para acessar o sistema</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="form-input"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Sua senha"
              required
            />
          </div>
          
          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>
        
        <div className="login-footer">
          <p>Demo: Use qualquer email e senha para entrar</p>
          <p className="registro-link">
            Não tem uma conta? <Link to="/registro">Registre sua empresa</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
