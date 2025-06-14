import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Phone,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "default" | "destructive" | "outline";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "urgent" | "warning" | "info" | "success";
  category: "appointment" | "payment" | "system" | "client";
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

interface SmartNotificationsProps {
  darkMode: boolean;
  onPageChange: (page: string) => void;
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications - in real app, this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Cliente Atrasado",
        message: "João Silva está 15 min atrasado para o agendamento das 14:00",
        type: "urgent",
        category: "appointment",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        actions: [
          {
            label: "Ligar",
            action: () => console.log("Calling client"),
            variant: "default",
          },
          {
            label: "Remarcar",
            action: () => onPageChange("appointments"),
            variant: "outline",
          },
        ],
      },
      {
        id: "2",
        title: "Pagamento Pendente",
        message: "R$ 450,00 em pagamentos pendentes de hoje",
        type: "warning",
        category: "payment",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actions: [
          {
            label: "Ver Pendências",
            action: () => onPageChange("payments"),
            variant: "default",
          },
        ],
      },
      {
        id: "3",
        title: "Novo Agendamento",
        message: "Maria Costa agendou corte para amanhã às 16:00",
        type: "info",
        category: "appointment",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true,
      },
      {
        id: "4",
        title: "Meta Mensal Atingida",
        message: "Parabéns! Você atingiu 85% da meta mensal",
        type: "success",
        category: "system",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
      },
      {
        id: "5",
        title: "Aniversário do Cliente",
        message: "3 clientes fazem aniversário hoje",
        type: "info",
        category: "client",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actions: [
          {
            label: "Enviar Mensagem",
            action: () => console.log("Send birthday message"),
            variant: "default",
          },
        ],
      },
    ];

    setNotifications(mockNotifications);
  }, [onPageChange]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter(
    (n) => !n.read && n.type === "urgent",
  ).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "urgent":
        return AlertTriangle;
      case "warning":
        return Clock;
      case "info":
        return Info;
      case "success":
        return CheckCircle;
    }
  };

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "appointment":
        return Calendar;
      case "payment":
        return DollarSign;
      case "client":
        return Phone;
      case "system":
        return Bell;
    }
  };

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "urgent":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: "text-yellow-600 dark:text-yellow-400",
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: "text-blue-600 dark:text-blue-400",
        };
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
        };
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return timestamp.toLocaleDateString("pt-BR");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative w-10 h-10 rounded-full"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center text-xs",
                urgentCount > 0
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600",
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 max-h-[600px]"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notificações
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount > 0
                ? `${unreadCount} não lidas`
                : "Todas as notificações lidas"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[500px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const CategoryIcon = getCategoryIcon(notification.category);
                const styles = getTypeStyles(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative",
                      !notification.read && "bg-blue-50/30 dark:bg-blue-900/10",
                    )}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute left-2 top-6 w-2 h-2 bg-blue-500 rounded-full" />
                    )}

                    <div className="flex items-start space-x-3 ml-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          styles.bg,
                          styles.border,
                          "border",
                        )}
                      >
                        <Icon className={cn("w-4 h-4", styles.icon)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-3 h-3 text-gray-400" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                dismissNotification(notification.id)
                              }
                              className="w-6 h-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>

                        {/* Actions */}
                        {notification.actions && (
                          <div className="flex items-center space-x-2 mt-3">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={action.variant || "default"}
                                size="sm"
                                onClick={() => {
                                  action.action();
                                  markAsRead(notification.id);
                                  setIsOpen(false);
                                }}
                                className="text-xs h-7"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
