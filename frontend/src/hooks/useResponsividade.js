import { useState, useEffect } from 'react';

// Hook personalizado para gerenciar responsividade
export const useResponsividade = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [breakpoint, setBreakpoint] = useState('desktop');

  // Breakpoints do sistema
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1440
  };

  // Detectar breakpoint atual
  const detectBreakpoint = (width) => {
    if (width <= breakpoints.mobile) return 'mobile';
    if (width <= breakpoints.tablet) return 'tablet';
    if (width <= breakpoints.desktop) return 'desktop';
    return 'desktopLarge';
  };

  // Verificar se é mobile
  const isMobile = () => {
    return viewport.width <= breakpoints.mobile;
  };

  // Verificar se é tablet
  const isTablet = () => {
    return viewport.width > breakpoints.mobile && viewport.width <= breakpoints.tablet;
  };

  // Verificar se é desktop
  const isDesktop = () => {
    return viewport.width > breakpoints.tablet;
  };

  // Verificar se é desktop large
  const isDesktopLarge = () => {
    return viewport.width > breakpoints.desktop;
  };

  // Obter configuração de grid
  const getGridConfig = () => {
    switch (breakpoint) {
      case 'mobile':
        return { columns: 1, gap: '1rem' };
      case 'tablet':
        return { columns: 2, gap: '1.5rem' };
      case 'desktop':
        return { columns: 3, gap: '2rem' };
      case 'desktopLarge':
        return { columns: 4, gap: '2rem' };
      default:
        return { columns: 1, gap: '1rem' };
    }
  };

  // Obter configuração de tipografia
  const getFontSizes = () => {
    switch (breakpoint) {
      case 'mobile':
        return {
          h1: '1.5rem',
          h2: '1.25rem',
          h3: '1.125rem',
          h4: '1rem',
          body: '0.875rem',
          small: '0.75rem'
        };
      case 'tablet':
        return {
          h1: '1.75rem',
          h2: '1.5rem',
          h3: '1.25rem',
          h4: '1.125rem',
          body: '1rem',
          small: '0.875rem'
        };
      case 'desktop':
        return {
          h1: '2rem',
          h2: '1.75rem',
          h3: '1.5rem',
          h4: '1.25rem',
          body: '1rem',
          small: '0.875rem'
        };
      case 'desktopLarge':
        return {
          h1: '2.25rem',
          h2: '2rem',
          h3: '1.75rem',
          h4: '1.5rem',
          body: '1.125rem',
          small: '1rem'
        };
      default:
        return {
          h1: '1.5rem',
          h2: '1.25rem',
          h3: '1.125rem',
          h4: '1rem',
          body: '0.875rem',
          small: '0.75rem'
        };
    }
  };

  // Obter configuração de navegação
  const getNavigationConfig = () => {
    return {
      type: isMobile() ? 'hamburger' : 'horizontal',
      position: isMobile() ? 'fixed' : 'relative',
      showIcons: !isMobile(),
      showLabels: !isMobile()
    };
  };

  // Obter configuração de performance
  const getPerformanceConfig = () => {
    return {
      lazyLoad: isMobile(),
      compressImages: isMobile(),
      reduceAnimations: isMobile(),
      minifyCSS: isMobile(),
      enableServiceWorker: !isMobile()
    };
  };

  // Obter configuração de acessibilidade
  const getAccessibilityConfig = () => {
    return {
      minTouchSize: isMobile() ? '44px' : '32px',
      buttonPadding: isMobile() ? '12px 16px' : '8px 12px',
      fontSize: isMobile() ? '16px' : '14px',
      focusVisible: true,
      highContrast: false
    };
  };

  // Obter classes CSS responsivas
  const getResponsiveClasses = (baseClass = '') => {
    let classes = baseClass;
    
    if (isMobile()) classes += ' mobile-only';
    if (isTablet()) classes += ' tablet-only';
    if (isDesktop()) classes += ' desktop-only';
    if (isDesktopLarge()) classes += ' desktop-large-only';
    
    return classes.trim();
  };

  // Obter tamanho de imagem
  const getImageSize = () => {
    if (isMobile()) return 'small';
    if (isTablet()) return 'medium';
    return 'large';
  };

  // Obter configuração de layout
  const getLayoutConfig = () => {
    return {
      sidebarWidth: isMobile() ? '100%' : '250px',
      sidebarCollapsed: isMobile(),
      headerHeight: isMobile() ? '60px' : '70px',
      contentPadding: isMobile() ? '1rem' : '2rem',
      containerMaxWidth: isDesktopLarge() ? '1400px' : '1200px'
    };
  };

  // Obter configuração de formulários
  const getFormConfig = () => {
    return {
      layout: isMobile() ? 'vertical' : 'horizontal',
      inputSize: isMobile() ? 'large' : 'medium',
      buttonSize: isMobile() ? 'large' : 'medium',
      showLabels: !isMobile(),
      showPlaceholders: true
    };
  };

  // Obter configuração de tabelas
  const getTableConfig = () => {
    return {
      responsive: isMobile(),
      scrollable: isMobile(),
      striped: !isMobile(),
      hover: !isMobile(),
      compact: isMobile(),
      pagination: !isMobile()
    };
  };

  // Obter configuração de cards
  const getCardConfig = () => {
    return {
      columns: getGridConfig().columns,
      elevation: isMobile() ? 2 : 4,
      padding: isMobile() ? '1rem' : '1.5rem',
      borderRadius: isMobile() ? '8px' : '12px'
    };
  };

  // Efeito para detectar mudança de viewport
  useEffect(() => {
    const handleResize = () => {
      const newViewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      setViewport(newViewport);
      setBreakpoint(detectBreakpoint(newViewport.width));
    };

    // Adicionar event listener
    window.addEventListener('resize', handleResize);
    
    // Detectar orientação
    const handleOrientationChange = () => {
      setTimeout(handleResize, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    // Estado atual
    viewport,
    breakpoint,
    
    // Verificações
    isMobile,
    isTablet,
    isDesktop,
    isDesktopLarge,
    
    // Configurações
    getGridConfig,
    getFontSizes,
    getNavigationConfig,
    getPerformanceConfig,
    getAccessibilityConfig,
    getResponsiveClasses,
    getImageSize,
    getLayoutConfig,
    getFormConfig,
    getTableConfig,
    getCardConfig,
    
    // Breakpoints
    breakpoints
  };
};

export default useResponsividade;
