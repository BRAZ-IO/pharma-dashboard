import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarBootstrap from '../components/SidebarBootstrap';
import NavbarBootstrap from '../components/NavbarBootstrap';
import './Layout.css';

const LayoutBootstrap = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`layout-bootstrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <NavbarBootstrap
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        userName="João Silva"
        userRole="Farmacêutico"
        notificationCount={3}
      />
      <SidebarBootstrap
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        userName="João Silva"
        userRole="Farmacêutico"
      />
      <main className="main-content-bootstrap">
        <div className="content-wrapper-bootstrap">
          <button 
            className="mobile-menu-toggle d-md-none"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default LayoutBootstrap;
