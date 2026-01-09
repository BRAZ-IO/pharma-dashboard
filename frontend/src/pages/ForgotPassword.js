import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error' | 'info'
  const [step, setStep] = useState(1); // 1: email, 2: enviado, 3: erro

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validar email
      if (!email || !email.includes('@')) {
        setMessage('Por favor, insira um email válido');
        setMessageType('error');
        setStep(3);
        return;
      }

      // Simular verificação se email existe
      const mockUsers = ['admin@farmacia.com', 'gerente@farmacia.com', 'funcionario@farmacia.com'];
      
      if (!mockUsers.includes(email.toLowerCase())) {
        setMessage('Este email não está cadastrado no sistema');
        setMessageType('error');
        setStep(3);
        return;
      }

      // Simular envio do email de recuperação
      setMessage(`Email de recuperação enviado para ${email}`);
      setMessageType('success');
      setStep(2);
      
      // Limpar formulário
      setEmail('');
    } catch (error) {
      setMessage('Erro ao enviar email de recuperação. Tente novamente.');
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
    setEmail('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">💊</div>
            <h1>Pharma Dashboard</h1>
          </div>
          <p>Recuperar Senha</p>
        </div>

        {step === 1 && (
          <>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    required
                    className="form-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
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
                <h4>📧 Como funciona?</h4>
                <ol>
                  <li>Digite seu email cadastrado</li>
                  <li>Receba um link de recuperação</li>
                  <li>Clique no link para criar nova senha</li>
                  <li>Acesse o sistema com sua nova senha</li>
                </ol>
              </div>

              <div className="test-accounts">
                <h4>🔐 Emails de Teste:</h4>
                <div className="account-list">
                  <div className="account">
                    <strong>Admin:</strong> admin@farmacia.com
                  </div>
                  <div className="account">
                    <strong>Gerente:</strong> gerente@farmacia.com
                  </div>
                  <div className="account">
                    <strong>Funcionário:</strong> funcionario@farmacia.com
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="success-message">
            <div className="success-icon">✉️</div>
            <h3>Email Enviado!</h3>
            <p>{message}</p>
            <p className="success-info">
              Verifique sua caixa de entrada e spam. O link de recuperação é válido por 24 horas.
            </p>
            <div className="success-actions">
              <button 
                className="btn-secondary"
                onClick={handleBackToLogin}
              >
                Voltar para Login
              </button>
              <button 
                className="btn-primary"
                onClick={() => window.location.href = 'https://gmail.com'}
              >
                Abrir Email
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

export default ForgotPassword;
