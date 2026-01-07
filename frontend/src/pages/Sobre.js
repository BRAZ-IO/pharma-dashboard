import React from 'react';
import './Sobre.css';

const Sobre = () => {
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
            <a href="#features" className="nav-link">Recursos</a>
            <a href="#pricing" className="nav-link">Preços</a>
            <a href="#testimonials" className="nav-link">Depoimentos</a>
            <a href="#contact" className="nav-link">Contato</a>
            <button className="btn btn-primary">Começar Gratuitamente</button>
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
                <button className="btn btn-primary btn-large">Começar Gratuitamente</button>
                <button className="btn btn-secondary btn-large">Ver Demonstração</button>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Farmácias Ativas</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfação</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Suporte</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="dashboard-mockup">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="mockup-title">Pharma Dashboard</div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-sidebar">
                    <div className="mockup-logo">💊</div>
                    <div className="mockup-menu">
                      <div className="menu-item active"></div>
                      <div className="menu-item"></div>
                      <div className="menu-item"></div>
                      <div className="menu-item"></div>
                    </div>
                  </div>
                  <div className="mockup-main">
                    <div className="mockup-cards">
                      <div className="mockup-card"></div>
                      <div className="mockup-card"></div>
                      <div className="mockup-card"></div>
                      <div className="mockup-card"></div>
                    </div>
                    <div className="mockup-chart">📊 Gráfico de Vendas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Recursos Que Transformam Sua Farmácia</h2>
            <p>Tudo que você precisa para gerenciar seu negócio de forma eficiente e moderna</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Dashboard Analítico</h3>
              <p>Visualize em tempo real vendas, estoque e métricas importantes para tomada de decisão estratégica</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧾</div>
              <h3>PDV Ultra Rápido</h3>
              <p>Sistema de ponto de venda intuitivo com busca por código de barras e emissão de cupom fiscal</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Controle de Estoque Inteligente</h3>
              <p>Gerenciamento completo com alertas de baixo estoque, controle de validade e previsão de demanda</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Gestão de Clientes</h3>
              <p>Cadastro completo, histórico de compras, programa de fidelidade e comunicação direta</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>App Mobile Próprio</h3>
              <p>Acompanhe sua farmácia de qualquer lugar com nosso aplicativo exclusivo para smartphones</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Segurança de Nível Empresarial</h3>
              <p>Dados criptografados, backup automático na nuvem e controle de acesso por níveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Plano Único e Completo</h2>
            <p>Tudo que você precisa para gerenciar sua farmácia em um único plano acessível</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card featured">
              <div className="featured-badge">Melhor Valor</div>
              <div className="pricing-header">
                <h3>Pharma Dashboard Completo</h3>
                <div className="price">
                  <span className="currency">R$</span>
                  <span className="amount">100</span>
                  <span className="period">/mês</span>
                </div>
                <p className="pricing-description">Tudo incluído para sua farmácia crescer</p>
              </div>
              <ul className="pricing-features">
                <li>Usuários ilimitados</li>
                <li>Produtos ilimitados</li>
                <li>PDV completo com cupom fiscal</li>
                <li>Controle de estoque inteligente</li>
                <li>Dashboard analítico em tempo real</li>
                <li>App mobile para Android e iOS</li>
                <li>Gestão completa de clientes</li>
                <li>Relatórios avançados</li>
                <li>Integração com sistemas contábeis</li>
                <li>Suporte 24/7 prioritário</li>
                <li>Backup automático na nuvem</li>
                <li>API para integrações personalizadas</li>
                <li>Treinamento para sua equipe</li>
                <li>Atualizações automáticas</li>
              </ul>
              <button className="btn btn-primary">Começar Agora</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Expectativas dos Farmacêuticos</h2>
            <p>Veja o que os profissionais esperam do Pharma Dashboard</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Estou ansioso pelo lançamento! Um sistema moderno para gestão de farmácias é exatamente o que precisamos."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <h4>Maria Santos</h4>
                  <p>Farmacêutica - São Paulo/SP</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"A demonstração que vi foi impressionante. Vai revolucionar como gerenciamos nosso estoque e vendas."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨</div>
                <div className="author-info">
                  <h4>João Costa</h4>
                  <p>Proprietário - Rio de Janeiro/RJ</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Já aguardei o acesso beta. As promessas de dashboard intuitivo e PDV rápido são exatamente o que o mercado precisa."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <h4>Ana Oliveira</h4>
                  <p>Gerente - Belo Horizonte/MG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Particiipe do Desenvolvimento</h2>
            <p>Junte-se aos farmacêuticos que estão aguardando o lançamento e ganhe acesso antecipado</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-large">Entrar na Lista de Espera</button>
              <button className="btn btn-secondary btn-large">Agendar Demonstração</button>
            </div>
            <p className="cta-note">✓ Acesso beta prioritário ✓ Desconto de lançamento ✓ Suporte dedicado ✓ Funcionalidades exclusivas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="footer-logo-icon">💊</div>
                <span>Pharma Dashboard</span>
              </div>
              <p>O sistema de gestão completo e moderno para farmácias. Atualmente em fase de desenvolvimento com lançamento previsto para 2024.</p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">📷</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Produto</h4>
              <ul>
                <li><a href="#features">Recursos</a></li>
                <li><a href="#pricing">Preços</a></li>
                <li><a href="#">Integrações</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Atualizações</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#sobre">Sobre Nós</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carreiras</a></li>
                <li><a href="#">Parceiros</a></li>
                <li><a href="#contact">Contato</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Suporte</h4>
              <ul>
                <li><a href="#">Central de Ajuda</a></li>
                <li><a href="#">Documentação</a></li>
                <li><a href="#">Status do Sistema</a></li>
                <li><a href="#">Treinamento</a></li>
                <li><a href="#contact">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Pharma Dashboard - Em Desenvolvimento. Todos os direitos reservados.</p>
            <div className="footer-legal">
              <a href="#">Privacidade</a>
              <a href="#">Termos de Uso</a>
              <a href="#">Cookies</a>
              <a href="#">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;
