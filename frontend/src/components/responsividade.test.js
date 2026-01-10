import { render, screen } from '@testing-library/react';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

// Mock do window.matchMedia para testes de responsividade
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Testes de Responsividade - Componentes', () => {
  
  beforeEach(() => {
    // Reset do mock antes de cada teste
    window.matchMedia.mockClear();
  });

  afterEach(() => {
    // Limpar mocks após cada teste
    jest.restoreAllMocks();
  });

  describe('1. Detecção de Viewport', () => {
    test('Deve detectar viewport mobile corretamente', () => {
      // Mock para mobile
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      expect(isMobile).toBe(true);
    });

    test('Deve detectar viewport desktop corretamente', () => {
      // Mock para desktop
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 769px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const isDesktop = window.matchMedia('(min-width: 769px)').matches;
      expect(isDesktop).toBe(true);
    });

    test('Deve detectar viewport tablet corretamente', () => {
      // Mock para tablet
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 769px) and (max-width: 1024px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
      expect(isTablet).toBe(true);
    });
  });

  describe('2. Breakpoints do Sistema', () => {
    const breakpoints = {
      mobile: '(max-width: 768px)',
      tablet: '(min-width: 769px) and (max-width: 1024px)',
      desktop: '(min-width: 1025px)',
      desktopLarge: '(min-width: 1440px)'
    };

    test('Deve ter todos os breakpoints definidos', () => {
      expect(breakpoints.mobile).toBe('(max-width: 768px)');
      expect(breakpoints.tablet).toBe('(min-width: 769px) and (max-width: 1024px)');
      expect(breakpoints.desktop).toBe('(min-width: 1025px)');
      expect(breakpoints.desktopLarge).toBe('(min-width: 1440px)');
    });

    test('Deve identificar breakpoint atual', () => {
      // Testar mobile
      window.matchMedia.mockImplementation(query => ({
        matches: query === breakpoints.mobile,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const currentBreakpoint = Object.keys(breakpoints).find(bp => 
        window.matchMedia(breakpoints[bp]).matches
      );
      expect(currentBreakpoint).toBe('mobile');
    });
  });

  describe('3. Classes CSS Responsivas', () => {
    test('Deve aplicar classes CSS corretas para mobile', () => {
      // Simular ambiente mobile
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      // Função para determinar classes responsivas
      const getResponsiveClasses = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        let classes = 'base-class';
        
        if (isMobile) classes += ' mobile-only';
        if (isTablet) classes += ' tablet-only';
        if (isDesktop) classes += ' desktop-only';
        
        return classes;
      };

      const classes = getResponsiveClasses();
      expect(classes).toContain('base-class');
      expect(classes).toContain('mobile-only');
      expect(classes).not.toContain('tablet-only');
      expect(classes).not.toContain('desktop-only');
    });

    test('Deve aplicar classes CSS corretas para desktop', () => {
      // Simular ambiente desktop
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 1025px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getResponsiveClasses = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        let classes = 'base-class';
        
        if (isMobile) classes += ' mobile-only';
        if (isTablet) classes += ' tablet-only';
        if (isDesktop) classes += ' desktop-only';
        
        return classes;
      };

      const classes = getResponsiveClasses();
      expect(classes).toContain('base-class');
      expect(classes).toContain('desktop-only');
      expect(classes).not.toContain('mobile-only');
      expect(classes).not.toContain('tablet-only');
    });
  });

  describe('4. Layout Grid Responsivo', () => {
    test('Deve configurar grid para mobile', () => {
      // Mock mobile
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getGridConfig = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        if (isMobile) {
          return { columns: 1, gap: '1rem' };
        } else if (isTablet) {
          return { columns: 2, gap: '1.5rem' };
        } else if (isDesktop) {
          return { columns: 3, gap: '2rem' };
        }
        
        return { columns: 1, gap: '1rem' };
      };

      const config = getGridConfig();
      expect(config.columns).toBe(1);
      expect(config.gap).toBe('1rem');
    });

    test('Deve configurar grid para desktop', () => {
      // Mock desktop
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 1025px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getGridConfig = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        if (isMobile) {
          return { columns: 1, gap: '1rem' };
        } else if (isTablet) {
          return { columns: 2, gap: '1.5rem' };
        } else if (isDesktop) {
          return { columns: 3, gap: '2rem' };
        }
        
        return { columns: 1, gap: '1rem' };
      };

      const config = getGridConfig();
      expect(config.columns).toBe(3);
      expect(config.gap).toBe('2rem');
    });
  });

  describe('5. Tipografia Responsiva', () => {
    test('Deve ajustar tamanhos de fonte para mobile', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getFontSizes = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        if (isMobile) {
          return {
            h1: '1.5rem',
            h2: '1.25rem',
            h3: '1.125rem',
            body: '0.875rem'
          };
        } else if (isTablet) {
          return {
            h1: '1.75rem',
            h2: '1.5rem',
            h3: '1.25rem',
            body: '1rem'
          };
        } else if (isDesktop) {
          return {
            h1: '2rem',
            h2: '1.75rem',
            h3: '1.5rem',
            body: '1rem'
          };
        }
        
        return { h1: '1.5rem', h2: '1.25rem', h3: '1.125rem', body: '0.875rem' };
      };

      const sizes = getFontSizes();
      expect(sizes.h1).toBe('1.5rem');
      expect(sizes.h2).toBe('1.25rem');
      expect(sizes.body).toBe('0.875rem');
    });

    test('Deve ajustar tamanhos de fonte para desktop', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 1025px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getFontSizes = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        if (isMobile) {
          return {
            h1: '1.5rem',
            h2: '1.25rem',
            h3: '1.125rem',
            body: '0.875rem'
          };
        } else if (isTablet) {
          return {
            h1: '1.75rem',
            h2: '1.5rem',
            h3: '1.25rem',
            body: '1rem'
          };
        } else if (isDesktop) {
          return {
            h1: '2rem',
            h2: '1.75rem',
            h3: '1.5rem',
            body: '1rem'
          };
        }
        
        return { h1: '1.5rem', h2: '1.25rem', h3: '1.125rem', body: '0.875rem' };
      };

      const sizes = getFontSizes();
      expect(sizes.h1).toBe('2rem');
      expect(sizes.h2).toBe('1.75rem');
      expect(sizes.body).toBe('1rem');
    });
  });

  describe('6. Navegação Responsiva', () => {
    test('Deve mostrar menu hambúrguer em mobile', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getNavigationType = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        return isMobile ? 'hamburger' : 'horizontal';
      };

      const navType = getNavigationType();
      expect(navType).toBe('hamburger');
    });

    test('Deve mostrar menu horizontal em desktop', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 769px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getNavigationType = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        return isMobile ? 'hamburger' : 'horizontal';
      };

      const navType = getNavigationType();
      expect(navType).toBe('horizontal');
    });
  });

  describe('7. Imagens Responsivas', () => {
    test('Deve selecionar tamanho de imagem correto para mobile', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getImageSize = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        if (isMobile) return 'small';
        if (isTablet) return 'medium';
        if (isDesktop) return 'large';
        return 'small';
      };

      const size = getImageSize();
      expect(size).toBe('small');
    });

    test('Deve selecionar tamanho de imagem correto para desktop', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(min-width: 1025px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getImageSize = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
        const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
        
        if (isMobile) return 'small';
        if (isTablet) return 'medium';
        if (isDesktop) return 'large';
        return 'small';
      };

      const size = getImageSize();
      expect(size).toBe('large');
    });
  });

  describe('8. Performance Responsiva', () => {
    test('Deve otimizar carregamento para mobile', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getPerformanceConfig = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
          return {
            lazyLoad: true,
            compressImages: true,
            reduceAnimations: true,
            minifyCSS: true
          };
        }
        
        return {
          lazyLoad: false,
          compressImages: false,
          reduceAnimations: false,
          minifyCSS: false
        };
      };

      const config = getPerformanceConfig();
      expect(config.lazyLoad).toBe(true);
      expect(config.compressImages).toBe(true);
      expect(config.reduceAnimations).toBe(true);
    });
  });

  describe('9. Acessibilidade Responsiva', () => {
    test('Deve ajustar tamanho de toque para mobile', () => {
      window.matchMedia.mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const getTouchConfig = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        return {
          minTouchSize: isMobile ? '44px' : '32px',
          buttonPadding: isMobile ? '12px 16px' : '8px 12px',
          fontSize: isMobile ? '16px' : '14px'
        };
      };

      const config = getTouchConfig();
      expect(config.minTouchSize).toBe('44px');
      expect(config.buttonPadding).toBe('12px 16px');
      expect(config.fontSize).toBe('16px');
    });
  });

  describe('10. Utilitários de Responsividade', () => {
    test('Deve calcular colunas do grid baseado no viewport', () => {
      const calculateColumns = (viewportWidth) => {
        if (viewportWidth <= 768) return 1;
        if (viewportWidth <= 1024) return 2;
        if (viewportWidth <= 1440) return 3;
        return 4;
      };

      expect(calculateColumns(375)).toBe(1);  // Mobile
      expect(calculateColumns(768)).toBe(1);  // Mobile max
      expect(calculateColumns(769)).toBe(2);  // Tablet min
      expect(calculateColumns(1024)).toBe(2); // Tablet max
      expect(calculateColumns(1025)).toBe(3); // Desktop min
      expect(calculateColumns(1440)).toBe(3); // Desktop max
      expect(calculateColumns(1441)).toBe(4); // Desktop Large
    });

    test('Deve calcular espaçamento baseado no viewport', () => {
      const calculateSpacing = (viewportWidth) => {
        if (viewportWidth <= 768) return '0.5rem';
        if (viewportWidth <= 1024) return '1rem';
        if (viewportWidth <= 1440) return '1.5rem';
        return '2rem';
      };

      expect(calculateSpacing(375)).toBe('0.5rem');   // Mobile
      expect(calculateSpacing(768)).toBe('0.5rem');   // Mobile max
      expect(calculateSpacing(769)).toBe('1rem');     // Tablet min
      expect(calculateSpacing(1024)).toBe('1rem');     // Tablet max
      expect(calculateSpacing(1025)).toBe('1.5rem');  // Desktop min
      expect(calculateSpacing(1440)).toBe('1.5rem');  // Desktop max
      expect(calculateSpacing(1441)).toBe('2rem');    // Desktop Large
    });
  });
});