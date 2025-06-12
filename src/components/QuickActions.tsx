import React from "react";
import {
  Plus,
  Calendar,
  User,
  Scissors,
  DollarSign,
  MessageSquare,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface QuickActionsProps {
  darkMode: boolean;
  onPageChange: (page: string) => void;
  onOpenModal?: (modal: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
  color: string;
  shortcut?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  darkMode,
  onPageChange,
  onOpenModal,
}) => {
  const quickActions: QuickAction[] = [
    {
      id: "new-appointment",
      label: "Novo Agendamento",
      icon: <Calendar className="h-5 w-5" />,
      description: "Agendar novo serviço",
      action: () => onPageChange("appointments"),
      color: "bg-blue-500 hover:bg-blue-600",
      shortcut: "Ctrl+N",
    },
    {
      id: "new-client",
      label: "Novo Cliente",
      icon: <User className="h-5 w-5" />,
      description: "Cadastrar cliente",
      action: () => onOpenModal?.("new-client") || onPageChange("clients"),
      color: "bg-green-500 hover:bg-green-600",
      shortcut: "Ctrl+U",
    },
    {
      id: "new-service",
      label: "Novo Serviço",
      icon: <Scissors className="h-5 w-5" />,
      description: "Criar serviço",
      action: () => onOpenModal?.("new-service") || onPageChange("services"),
      color: "bg-purple-500 hover:bg-purple-600",
      shortcut: "Ctrl+S",
    },
    {
      id: "view-financial",
      label: "Ver Financeiro",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Relatórios financeiros",
      action: () => onPageChange("financial"),
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      id: "send-message",
      label: "Enviar Mensagem",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "WhatsApp ou SMS",
      action: () => onPageChange("marketing"),
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      id: "view-reports",
      label: "Relatórios",
      icon: <FileText className="h-5 w-5" />,
      description: "Analytics do negócio",
      action: () => onPageChange("reports"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "settings",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
      description: "Ajustar preferências",
      action: () => onPageChange("settings"),
      color: "bg-gray-500 hover:bg-gray-600",
    },
    {
      id: "help",
      label: "Central de Ajuda",
      icon: <Plus className="h-5 w-5 rotate-45" />,
      description: "Suporte e tutoriais",
      action: () => onPageChange("help"),
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ];

  return (
    <div
      className={cn(
        "p-6 rounded-lg border",
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Ações Rápidas
        </h3>
        <span
          className={cn(
            "text-sm",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          Use atalhos para agilizar seu trabalho
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={cn(
              "group relative p-4 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-lg",
              action.color,
            )}
            title={`${action.description}${action.shortcut ? ` (${action.shortcut})` : ""}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-sm font-medium leading-tight">
                {action.label}
              </span>
              {action.shortcut && (
                <span className="text-xs opacity-75 mt-1">
                  {action.shortcut}
                </span>
              )}
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-4 pt-4 border-t text-center",
          darkMode ? "border-gray-700" : "border-gray-200",
        )}
      >
        <p
          className={cn(
            "text-xs",
            darkMode ? "text-gray-400" : "text-gray-600",
          )}
        >
          💡 Dica: Use os atalhos de teclado para navegar mais rapidamente
        </p>
      </div>
    </div>
  );
};
