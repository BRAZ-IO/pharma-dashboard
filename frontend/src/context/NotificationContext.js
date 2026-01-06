import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Estoque Baixo',
      message: 'Dipirona 500mg - apenas 5 unidades restantes',
      time: '5 min atrás',
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Nova Receita',
      message: 'Receita médica aguardando processamento',
      time: '15 min atrás',
      unread: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Venda Concluída',
      message: 'Venda #1234 processada com sucesso',
      time: '30 min atrás',
      unread: false,
      priority: 'low'
    },
    {
      id: 4,
      type: 'error',
      title: 'Sistema de Backup',
      message: 'Falha no backup automático - verificar configurações',
      time: '1 hora atrás',
      unread: true,
      priority: 'high'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Medicamento Vencendo',
      message: 'Amoxicilina 500mg vence em 3 dias',
      time: '2 horas atrás',
      unread: true,
      priority: 'medium'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
  };

  const markAllAsRead = () => {
    console.log('Marking all notifications as read');
  };

  const value = {
    notifications,
    unreadCount,
    showNotifications,
    toggleNotifications,
    markAsRead,
    markAllAsRead,
    setShowNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
