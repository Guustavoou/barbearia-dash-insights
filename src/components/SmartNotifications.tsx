
import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export interface SmartNotificationsProps {
  darkMode: boolean;
  onPageChange: (page: string) => void;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({ darkMode, onPageChange }) => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'info',
      title: 'Novo agendamento',
      message: 'Cliente João marcou um corte para amanhã às 14h',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Estoque baixo',
      message: 'Shampoo profissional está acabando',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'Pagamento recebido',
      message: 'R$ 150,00 creditados na conta',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button className={`relative p-2 rounded-lg transition-colors ${
        darkMode 
          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default SmartNotifications;
