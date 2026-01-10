import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_METADATA } from '../routes/routeConfig';
import './SidebarBootstrap.css';

const SidebarBootstrap = ({ mobileOpen, onCloseMobile, isCollapsed, setIsCollapsed, userName = "João Silva", userRole = "Farmacêutico", empresaNome = "Farmácia Teste" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleLogout = () => {
    // Implementar lógica de logout
    navigate('/login');
  };

  // Itens de navegação do Pharma Dashboard com design moderno
  const pharmaNavItems = [
    { 
      path: '/app/dashboard', 
      name: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      )
    },
    { 
      path: '/app/pdv', 
      name: 'PDV', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 14L3 9V3h6v5l6 5v6h-6v-5z"/>
          <path d="M21 12l-6-6v12l6 6V12z"/>
        </svg>
      )
    },
    { 
      path: '/app/produtos', 
      name: 'Produtos', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 2-3.21 2-5.5A5.5 5.5 0 0 0 15.5 3c-1.76 0-3 .5-4 1.5-.99-1-2.24-1.5-4-1.5A5.5 5.5 0 0 0 2 8.5c0 2.3.51 4.05 2 5.5Z"/>
          <polyline points="12,5 12,19"/>
        </svg>
      )
    },
    { 
      path: '/app/estoque', 
      name: 'Estoque', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      )
    },
    { 
      path: '/app/vendas', 
      name: 'Vendas', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 14L3 9V3h6v5l6 5v6h-6v-5z"/>
          <path d="M21 12l-6-6v12l6 6V12z"/>
        </svg>
      )
    },
    { 
      path: '/app/transferencias', 
      name: 'Transferências', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
          <path d="M7 10h10M7 14h10"/>
        </svg>
      )
    },
    { 
      path: '/app/usuarios', 
      name: 'Usuários', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
    { 
      path: '/app/fornecedores', 
      name: 'Fornecedores', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7h-9" />
          <path d="M14 17H5" />
          <circle cx="7" cy="7" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M10 7v10" />
        </svg>
      )
    },
    { 
      path: '/app/clientes', 
      name: 'Clientes', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { 
      path: '/app/fluxo-caixa', 
      name: 'Fluxo de Caixa', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H17"></path>
          <path d="M17 12H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H17"></path>
        </svg>
      )
    },
    { 
      path: '/app/configuracoes', 
      name: 'Configurações', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M21 12h-6m-6 0H3m13.22 4.22l4.24 4.24M1.54 20.46l4.24-4.24"/>
        </svg>
      )
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && mobileOpen) {
        onCloseMobile();
      }
    };

    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, onCloseMobile]);

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay-bootstrap"
          onClick={onCloseMobile}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <nav 
        className={`sidebar-bootstrap ${mobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        role="navigation"
        aria-label="Menu principal de navegação"
        ref={navRef}
      >
        {/* Header */}
        <div className="sidebar-header-bootstrap">
          <div className="sidebar-brand-bootstrap">
            <div className="brand-icon-bootstrap">
              <span className="brand-logo-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="#64b5f6"/>
                  <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              {!isCollapsed && (
                <div className="brand-text-container">
                  <span className="brand-text-bootstrap">{empresaNome}</span>
                  <span className="brand-subtitle">Sistema de Gestão</span>
                </div>
              )}
            </div>
          </div>
          <div className="sidebar-controls-bootstrap">
            <button 
              className="sidebar-close-bootstrap d-md-none"
              onClick={onCloseMobile}
              aria-label="Fechar menu"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav-bootstrap" role="navigation" aria-label="Menu de navegação">
          <div className="nav-items-list-bootstrap">
            {pharmaNavItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item-bootstrap ${
                  isActiveRoute(item.path) ? 'active' : ''
                }`}
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.name : ''}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                aria-label={item.name}
              >
                <span className="nav-icon-bootstrap">{item.icon}</span>
                <span className="nav-text-bootstrap">{item.name}</span>
                {isCollapsed && (
                  <div className="nav-tooltip-bootstrap">
                    <div className="tooltip-content-bootstrap">
                      <strong>{item.name}</strong>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer-bootstrap">
          {/* User Profile Section */}
          <div className="sidebar-user-profile-bootstrap" onClick={() => handleNavigation('/app/perfil')}>
            <div className="user-avatar-bootstrap">
              <span className="avatar-text">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-info-bootstrap">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
            {!isCollapsed && (
              <div className="user-status-bootstrap">
                <div className="status-indicator online"></div>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button 
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Sair do sistema"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {!isCollapsed && <span>Sair</span>}
          </button>
          
          <div className="footer-info-bootstrap">
            <small className="text-muted">Pharma Dashboard v1.0</small>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SidebarBootstrap;