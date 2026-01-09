import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [codigo2FA, setCodigo2FA] = useState('');
  const [userId, setUserId] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Evitar múltiplas requisições simultâneas
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.requires2FA) {
        setRequires2FA(true);
        setUserId(result.userId);
        setError('');
      } else {
        // Login bem sucedido sem 2FA
        navigate('/app/dashboard');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      
      // Tratar diferentes tipos de erro
      if (err.response?.status === 401) {
        setError('Email ou senha incorretos.');
      } else if (err.response?.status === 403) {
        setError('Acesso negado. Verifique suas permissões.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidate2FA = async (e) => {
    e.preventDefault();
    
    // Evitar múltiplas requisições simultâneas
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      // Implementar validação 2FA
      // await authService.validate2FA(userId, codigo2FA);
      navigate('/app/perfil');
    } catch (err) {
      console.error('Erro na validação 2FA:', err);
      
      // Tratar diferentes tipos de erro
      if (err.response?.status === 401) {
        setError('Código inválido.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else {
        setError(err.message || 'Código inválido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Se requer 2FA, mostrar formulário de validação
  if (requires2FA) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🔐</span>
              <h1>Autenticação 2FA</h1>
            </div>
            <p>Digite o código do seu aplicativo autenticador</p>
          </div>
          
          <form onSubmit={handleValidate2FA} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="codigo2FA">Código 2FA</label>
              <input
                type="text"
                id="codigo2FA"
                name="codigo2FA"
                value={codigo2FA}
                onChange={(e) => setCodigo2FA(e.target.value)}
                className="form-input"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Validando...' : 'Validar'}
            </button>
            
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setRequires2FA(false)}
            >
              Voltar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">💊</span>
            <h1>Pharma Dashboard</h1>
          </div>
          <p>Faça login para acessar o sistema</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="form-input"
              placeholder="usuario@demo.com"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <div className="login-links">
            <Link to="/forgot-password" className="link">
              Esqueci minha senha
            </Link>
          </div>
        </form>
        
        <div className="login-footer">
          <p><strong>Conta de Demonstração:</strong></p>
          <p>Usuario Demo: usuario@demo.com / 123456</p>
          <p className="registro-link">
            Não tem uma conta? <Link to="/registro">Registre sua empresa</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
