import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onToggleMobileSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const notifications = [
    { id: 1, type: 'warning', message: 'Estoque baixo: Dipirona 500mg', time: '5 min atrás', unread: true },
    { id: 2, type: 'info', message: 'Nova venda registrada', time: '10 min atrás', unread: true },
    { id: 3, type: 'success', message: 'Backup realizado com sucesso', time: '1 hora atrás', unread: false },
    { id: 4, type: 'error', message: 'Falha na sincronização', time: '2 horas atrás', unread: true }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getBreadcrumb = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/pdv': 'PDV',
      '/produtos': 'Produtos',
      '/estoque': 'Estoque',
      '/usuarios': 'Usuários',
      '/configuracoes': 'Configurações'
    };
    return pathMap[location.pathname] || 'Página';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Buscar por:', searchTerm);
      // Implementar lógica de busca
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => onToggleMobileSidebar && onToggleMobileSidebar()}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        {/* Breadcrumb */}
        <div className="navbar-left">
          <div className="breadcrumb">
            <span className="breadcrumb-home">🏠</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-center">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar produtos, clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Actions */}
        <div className="navbar-right">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action-btn" title="Nova Venda">
              💰
            </button>
            <button className="quick-action-btn" title="Adicionar Produto">
              ➕
            </button>
          </div>

          {/* Notifications */}
          <div className="navbar-item">
            <button 
              className="notification-btn"
              onClick={toggleNotifications}
              title="Notificações"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <h3>Notificações</h3>
                  <span className="notification-count">{unreadCount} não lidas</span>
                </div>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <div className={`notification-icon ${notification.type}`}>
                        {notification.type === 'warning' && '⚠️'}
                        {notification.type === 'info' && 'ℹ️'}
                        {notification.type === 'success' && '✅'}
                        {notification.type === 'error' && '❌'}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-btn">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="navbar-item">
            <button 
              className="user-menu-btn"
              onClick={toggleUserMenu}
              title="Menu do Usuário"
            >
              <div className="user-avatar">
                <span>👤</span>
              </div>
              <div className="user-info">
                <span className="user-name">João Silva</span>
                <span className="user-role">Administrador</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-profile">
                    <div className="user-avatar-large">
                      <span>👤</span>
                    </div>
                    <div className="user-details">
                      <h3>João Silva</h3>
                      <p>joao.silva@farmacia.com</p>
                      <span className="user-badge">Administrador</span>
                    </div>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <button className="menu-item">
                    <span className="menu-icon">👤</span>
                    Meu Perfil
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">⚙️</span>
                    Configurações
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">🌙</span>
                    Modo Escuro
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">❓</span>
                    Ajuda
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <span className="menu-icon">🚪</span>
                    Sair
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

export default Navbar;
