import React from 'react';
import './Sobre.css';

const Sobre = () => {
  const handleViewDemo = () => {
    // Acesso direto ao sistema dashboard com usuário demo
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      id: 'demo',
      name: 'Usuário Demo',
      email: 'demo@pharmadashboard.com',
      isDemo: true
    }));
    
    // Redirecionar para o dashboard
    window.location.href = '/app/dashboard';
  };

  return (
    <div className="sobre-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <div className="nav-logo-icon">💊</div>
            <span>Pharma Dashboard</span>
          </div>
          <div className="nav-links">
            <button className="btn btn-primary" onClick={handleViewDemo}>Ver Demonstração</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">🚀 Em Desenvolvimento</div>
              <h1>
                Transforme sua <span className="highlight">Farmácia</span> com <br />
                Tecnologia Moderna
              </h1>
              <p className="hero-subtitle">
                Estamos construindo o sistema de gestão completo para farmácias modernas. 
                Controle total do seu negócio com dashboard intuitivo, gestão de estoque inteligente, 
                ponto de venda rápido e muito mais. Em breve disponível!
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-large" onClick={handleViewDemo}>Ver Demonstração</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="footer-logo-icon">💊</div>
                <span>Pharma Dashboard</span>
              </div>
              <p>O sistema de gestão completo e moderno para farmácias. Atualmente em fase de desenvolvimento com lançamento previsto para 2024.</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Pharma Dashboard - Em Desenvolvimento. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;
