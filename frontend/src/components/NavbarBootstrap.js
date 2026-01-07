import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavbarBootstrap.css';

const NavbarBootstrap = ({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  onMobileMenuToggle,
  userName = 'Usuário',
  userRole = 'Administrador',
  notificationCount = 3
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const notifications = [
    { id: 1, type: 'warning', message: 'Estoque baixo: Paracetamol 750mg', time: '5 min atrás' },
    { id: 2, type: 'success', message: 'Novo pedido #1234 confirmado', time: '15 min atrás' },
    { id: 3, type: 'info', message: 'Sistema atualizado com sucesso', time: '1 hora atrás' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const routeMap = {
      '/app/dashboard': 'Dashboard',
      '/app/pdv': 'PDV - Ponto de Venda',
      '/app/produtos': 'Produtos',
      '/app/estoque': 'Estoque',
      '/app/usuarios': 'Usuários',
      '/app/configuracoes': 'Configurações'
    };
    return routeMap[path] || 'Pharma Dashboard';
  };

  const handleLogout = () => {
    // Implementar lógica de logout
    navigate('/login');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <nav className="navbar-bootstrap">
      <div className="navbar-left-bootstrap">
        <button 
          className="navbar-toggle-btn d-none d-md-block"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div className="navbar-page-title">
          <h1>{getPageTitle()}</h1>
        </div>
      </div>

      {/* Search Centralizado */}
      <div className="navbar-search-bootstrap">
        <div className="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Buscar medicamentos, produtos..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right-bootstrap">
        <div className="navbar-actions-bootstrap">
          {/* Notifications */}
          <div className="navbar-notifications-bootstrap" ref={notificationsRef}>
            <button 
              className="notification-btn"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              aria-label="Notificações"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notificações</h3>
                  <button className="mark-all-read">Marcar todas como lidas</button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.type}`}>
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notifications-footer">
                  <button className="view-all-notifications">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="navbar-profile-bootstrap" ref={profileRef}>
            <button 
              className="profile-btn"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              aria-label="Perfil do usuário"
            >
              <div className="profile-avatar">
                <span>{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="profile-info d-none d-lg-block">
                <span className="profile-name">{userName}</span>
                <span className="profile-role">{userRole}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-avatar-large">
                    <span>{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="profile-details">
                    <h4>{userName}</h4>
                    <p>{userRole}</p>
                    <div className="profile-status">
                      <div className="status-dot online"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                <div className="profile-dropdown-menu">
                  <button className="dropdown-item">
                    <div className="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="item-content">
                      <span className="item-title">Meu Perfil</span>
                      <span className="item-description">Ver e editar informações</span>
                    </div>
                  </button>
                  <button className="dropdown-item">
                    <div className="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M21 12h-6m-6 0H3m13.22 4.22l4.24 4.24M1.54 20.46l4.24-4.24"></path>
                      </svg>
                    </div>
                    <div className="item-content">
                      <span className="item-title">Configurações</span>
                      <span className="item-description">Preferências do sistema</span>
                    </div>
                  </button>
                  <button className="dropdown-item">
                    <div className="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <div className="item-content">
                      <span className="item-title">Ajuda</span>
                      <span className="item-description">Central de ajuda e suporte</span>
                    </div>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <div className="item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </div>
                    <div className="item-content">
                      <span className="item-title">Sair</span>
                      <span className="item-description">Encerrar sessão</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarBootstrap;
