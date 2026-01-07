import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sobre.css';

const Sobre = () => {
  const navigate = useNavigate();

  const handleViewDemo = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      id: 'demo',
      name: 'Usuário Demo',
      email: 'demo@pharmadashboard.com',
      isDemo: true
    }));
    window.location.href = '/app/dashboard';
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/registro');
  };

  const features = [
    {
      icon: '🛒',
      title: 'PDV Completo',
      description: 'Sistema de ponto de venda rápido e intuitivo com suporte a múltiplos métodos de pagamento'
    },
    {
      icon: '📦',
      title: 'Gestão de Estoque',
      description: 'Controle inteligente de inventário com alertas de estoque baixo e movimentações'
    },
    {
      icon: '💊',
      title: 'Catálogo de Produtos',
      description: 'Organize seus produtos por categorias com informações completas e códigos de barras'
    },
    {
      icon: '👥',
      title: 'Gestão de Usuários',
      description: 'Controle de acesso com diferentes níveis de permissão para sua equipe'
    },
    {
      icon: '📊',
      title: 'Relatórios',
      description: 'Dashboard com métricas em tempo real e relatórios detalhados de vendas'
    },
    {
      icon: '⚙️',
      title: 'Configurações',
      description: 'Personalize o sistema de acordo com as necessidades da sua farmácia'
    }
  ];

  return (
    <div className="sobre-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="logo-section">
              <div className="logo-icon">💊</div>
              <h2 className="logo-text">Pharma Dashboard</h2>
            </div>

            <div className="hero-badge">
              <span className="badge-icon">🚧</span>
              <span>Em Desenvolvimento Ativo</span>
            </div>

            <h1 className="hero-title">
              Sistema de Gestão<br />
              para <span className="highlight">Farmácias Modernas</span>
            </h1>

            <p className="hero-description">
              Plataforma completa para gerenciar sua farmácia com eficiência.
              PDV integrado, controle de estoque inteligente, gestão de equipe
              e relatórios em tempo real. Tudo em um só lugar.
            </p>

            <div className="hero-actions">
              <button className="btn-demo" onClick={handleViewDemo}>
                <span className="btn-icon">🚀</span>
                Ver Demonstração
              </button>
              <button className="btn-login" onClick={handleLogin}>
                Fazer Login
              </button>
              <button className="btn-register" onClick={handleRegister}>
                Registrar Empresa
              </button>
            </div>

            <div className="hero-info">
              <p>✨ Acesse a demonstração para explorar todas as funcionalidades</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2>Funcionalidades em Desenvolvimento</h2>
            <p>Acompanhe o progresso das principais funcionalidades do sistema</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-status">
                  <div className="status-badge">Em Desenvolvimento</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Pronto para começar?</h2>
            <p>Explore a demonstração ou registre sua farmácia para acompanhar o desenvolvimento</p>
            <div className="cta-actions">
              <button className="btn-cta-primary" onClick={handleViewDemo}>
                Explorar Demonstração
              </button>
              <button className="btn-cta-secondary" onClick={handleRegister}>
                Registrar Minha Farmácia
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">💊</div>
                <span>Pharma Dashboard</span>
              </div>
              <p className="footer-description">
                Sistema de gestão completo para farmácias modernas.
                Projeto em desenvolvimento ativo.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Produto</h4>
                <a href="#" onClick={(e) => { e.preventDefault(); handleViewDemo(); }}>Demonstração</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleRegister(); }}>Registrar</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogin(); }}>Login</a>
              </div>

              <div className="footer-column">
                <h4>Status</h4>
                <p className="status-text">🚧 Em Desenvolvimento</p>
                <p className="status-text">📅 2026</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Pharma Dashboard. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;
