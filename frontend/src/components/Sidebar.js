import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ROUTE_METADATA, ROUTES } from '../routes/routeConfig';
import './Sidebar.css';

const Sidebar = ({ mobileOpen = false, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();

  // Group routes by section
  const menuSections = ROUTE_METADATA.reduce((sections, route) => {
    const section = sections.find(s => s.title === route.section);
    if (section) {
      section.items.push({
        path: route.path,
        name: route.name,
        icon: route.icon,
        badge: route.badge,
        badgeType: route.badgeType,
        description: route.description
      });
    } else {
      sections.push({
        title: route.section,
        items: [{
          path: route.path,
          name: route.name,
          icon: route.icon,
          badge: route.badge,
          badgeType: route.badgeType,
          description: route.description
        }]
      });
    }
    return sections;
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      if (onCloseMobile) onCloseMobile();
    }
  };

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  useEffect(() => {
    // Auto-expand section containing current route
    const currentSection = menuSections.find(section => 
      section.items.some(item => location.pathname.startsWith(item.path))
    );
    if (currentSection) {
      setExpandedSections(prev => ({
        ...prev,
        [currentSection.title]: true
      }));
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => onCloseMobile && onCloseMobile()}
      />
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="pharmacy-profile">
          <div className="pharmacy-avatar">
            <span>💊</span>
          </div>
          {!isCollapsed && (
            <div className="pharmacy-details">
              <div className="pharmacy-name">Farmácia Central</div>
              <div className="pharmacy-location">Centro - SP</div>
            </div>
          )}
        </div>
        <div className="header-actions">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="sidebar-search">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
      
      <nav className="sidebar-nav">
        {filteredSections.map((section) => (
          <div key={section.title} className="nav-section">
            {!isCollapsed && (
              <div 
                className="section-header"
                onClick={() => toggleSection(section.title)}
              >
                <span className="section-title">{section.title}</span>
                <span className={`section-arrow ${expandedSections[section.title] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
            )}
            
            <ul className={`nav-list ${!isCollapsed && !expandedSections[section.title] ? 'collapsed' : ''}`}>
              {section.items.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    title={isCollapsed ? `${item.name} - ${item.description}` : ''}
                    onClick={handleNavClick}
                  >
                    <div className="nav-link-content">
                      <span className="nav-icon">{item.icon}</span>
                      {!isCollapsed && (
                        <div className="nav-info">
                          <span className="nav-text">{item.name}</span>
                          <span className="nav-description">{item.description}</span>
                        </div>
                      )}
                      {item.badge && (
                        <span className={`nav-badge ${item.badgeType || 'default'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </NavLink>
                  
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              <span>👤</span>
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <div className="user-name">João Silva</div>
                <div className="user-role">Administrador</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.href = ROUTES.LOGIN;
            }}>
              🚪
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
