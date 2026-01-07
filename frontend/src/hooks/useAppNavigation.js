import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeConfig';

/**
 * Custom hook for navigation with centralized route management
 * @returns {Object} Navigation functions and route constants
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigation = {
    // Public routes
    goToLogin: () => navigate(ROUTES.LOGIN),
    goToSobre: () => navigate(ROUTES.SOBRE),
    goToHome: () => navigate(ROUTES.HOME),
    
    // Protected routes
    goToDashboard: () => navigate(ROUTES.DASHBOARD),
    goToPDV: () => navigate(ROUTES.PDV),
    goToProdutos: () => navigate(ROUTES.PRODUTOS),
    goToEstoque: () => navigate(ROUTES.ESTOQUE),
    goToUsuarios: () => navigate(ROUTES.USUARIOS),
    goToConfiguracoes: () => navigate(ROUTES.CONFIGURACOES),
    
    // Generic navigation
    goTo: (path) => navigate(path),
    goBack: () => navigate(-1),
  };

  return {
    ...navigation,
    routes: ROUTES
  };
};

export default useAppNavigation;
