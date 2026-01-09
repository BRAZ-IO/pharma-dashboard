import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error' | 'info'
  const [step, setStep] = useState(1); // 1: formulário, 2: sucesso, 3: erro
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Validar token
    if (!token) {
      setMessage('Link de recuperação inválido ou expirado');
      setMessageType('error');
      setStep(3);
      return;
    }

    // Simular validação do token
    const validateToken = () => {
      // Em produção, isso seria validado no backend
      // Para mock, vamos aceitar tokens com formato específico
      const tokenPattern = /^[A-Za-z0-9]{32,}$/;
      const isValid = tokenPattern.test(token);
      
      if (!isValid) {
        setMessage('Link de recuperação inválido ou expirado');
        setMessageType('error');
        setStep(3);
      } else {
        setTokenValid(true);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar mensagem quando usuário começa a digitar
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const validateForm = () => {
    if (!formData.senha || formData.senha.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres');
      setMessageType('error');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setMessage('As senhas não coincidem');
      setMessageType('error');
      return false;
    }

    // Validar força da senha
    const hasUpperCase = /[A-Z]/.test(formData.senha);
    const hasLowerCase = /[a-z]/.test(formData.senha);
    const hasNumber = /\d/.test(formData.senha);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setMessage('A senha deve conter letras maiúsculas, minúsculas e números');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Simular redefinição de senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em produção, isso seria enviado para o backend
      console.log('Senha redefinida com sucesso para o token:', token);
      
      setMessage('Senha redefinida com sucesso!');
      setMessageType('success');
      setStep(2);
      
      // Limpar formulário
      setFormData({ senha: '', confirmarSenha: '' });
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setMessage('Erro ao redefinir senha. Tente novamente.');
      setMessageType('error');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleTryAgain = () => {
    setStep(1);
    setMessage('');
    setMessageType('');
    setFormData({ senha: '', confirmarSenha: '' });
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Comprimento mínimo
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexidade
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return 'Fraca';
    if (strength <= 3) return 'Média';
    if (strength <= 4) return 'Forte';
    return 'Muito Forte';
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return '#e74c3c';
    if (strength <= 3) return '#ffa502';
    if (strength <= 4) return '#f39c12';
    return '#27ae60';
  };

  if (!tokenValid) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <h3>Link Inválido!</h3>
            <p>{message}</p>
            <div className="error-actions">
              <button 
                className="btn-primary"
                onClick={handleBackToLogin}
              >
                Voltar para Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">🔐</div>
            <h1>Pharma Dashboard</h1>
          </div>
          <p>Redefinir Senha</p>
        </div>

        {step === 1 && (
          <>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="senha">NOVA SENHA</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite sua nova senha"
                    required
                    className="form-input"
                  />
                  {formData.senha && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill"
                          style={{ 
                            width: `${(getPasswordStrength(formData.senha) / 5) * 100}%`,
                            backgroundColor: getPasswordStrengthColor(getPasswordStrength(formData.senha))
                          }}
                        ></div>
                      </div>
                      <span className="strength-text">
                        Força: {getPasswordStrengthText(getPasswordStrength(formData.senha))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarSenha">CONFIRMAR SENHA</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Confirme sua nova senha"
                    required
                    className="form-input"
                  />
                </div>

                {message && (
                  <div className={`message ${messageType}`}>
                    {message}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
              </form>

              <div className="login-links">
                <Link to="/login" className="link">
                  ← Voltar para o Login
                </Link>
              </div>
            </div>

            <div className="login-footer">
              <div className="info-box">
                <h4>🔐 Requisitos da Senha:</h4>
                <ul>
                  <li>Mínimo 6 caracteres</li>
                  <li>Pelo menos 1 letra maiúscula</li>
                  <li>Pelo menos 1 letra minúscula</li>
                  <li>Pelo menos 1 número</li>
                  <li>Caracteres especiais (recomendado)</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Senha Redefinida!</h3>
            <p>{message}</p>
            <p className="success-info">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
            <div className="success-actions">
              <button 
                className="btn-primary"
                onClick={handleBackToLogin}
              >
                Ir para o Login Agora
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <h3>Erro!</h3>
            <p>{message}</p>
            <div className="error-actions">
              <button 
                className="btn-secondary"
                onClick={handleBackToLogin}
              >
                Voltar para Login
              </button>
              <button 
                className="btn-primary"
                onClick={handleTryAgain}
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
