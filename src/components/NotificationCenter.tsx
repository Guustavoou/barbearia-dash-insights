import React, { useState } from "react";
import {
  Bell,
  X,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface NotificationCenterProps {
  darkMode: boolean;
}

interface Notification {
  id: string;
  type: "appointment" | "payment" | "client" | "alert" | "success";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Novo Agendamento",
    message: "Maria Silva agendou Corte + Escova para amanhã às 14:30",
    time: "5 min atrás",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "payment",
    title: "Pagamento Recebido",
    message: "PIX de R$ 85,00 recebido de João Santos",
    time: "15 min atrás",
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "client",
    title: "Aniversário Hoje",
    message: "Ana Costa faz aniversário hoje! Envie uma mensagem especial",
    time: "1 hora atrás",
    isRead: true,
    priority: "low",
  },
  {
    id: "4",
    type: "alert",
    title: "Estoque Baixo",
    message: "Shampoo Hidratante está acabando (apenas 2 unidades)",
    time: "2 horas atrás",
    isRead: false,
    priority: "high",
  },
  {
    id: "5",
    type: "success",
    title: "Meta Atingida",
    message: "Parabéns! Você atingiu a meta de vendas do mês",
    time: "3 horas atrás",
    isRead: true,
    priority: "medium",
  },
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  darkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "client":
        return <Users className="h-5 w-5 text-purple-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          darkMode
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-100 text-gray-500",
        )}
        title="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-xl z-50",
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between p-4 border-b",
                darkMode ? "border-gray-700" : "border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "font-semibold",
                  darkMode ? "text-white" : "text-gray-900",
                )}
              >
                Notificações
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p
                    className={cn(
                      "font-medium mb-1",
                      darkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Nenhuma notificação
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    Você está em dia com tudo!
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "border-l-4 p-4 transition-colors cursor-pointer",
                        !notification.isRead
                          ? darkMode
                            ? "bg-gray-750"
                            : "bg-blue-50"
                          : darkMode
                            ? "hover:bg-gray-750"
                            : "hover:bg-gray-50",
                        getPriorityColor(notification.priority),
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4
                              className={cn(
                                "font-medium text-sm",
                                darkMode ? "text-white" : "text-gray-900",
                              )}
                            >
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className={cn(
                                "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ml-2",
                                darkMode ? "text-gray-400" : "text-gray-500",
                              )}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p
                            className={cn(
                              "text-sm mt-1",
                              darkMode ? "text-gray-300" : "text-gray-700",
                            )}
                          >
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={cn(
                                "text-xs flex items-center gap-1",
                                darkMode ? "text-gray-400" : "text-gray-500",
                              )}
                            >
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div
                className={cn(
                  "p-3 border-t text-center",
                  darkMode ? "border-gray-700" : "border-gray-200",
                )}
              >
                <button
                  className={cn(
                    "text-sm text-blue-500 hover:text-blue-600 font-medium",
                  )}
                >
                  Ver todas as notificações
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
