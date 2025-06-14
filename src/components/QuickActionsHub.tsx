import React, { useState } from "react";
import {
  Plus,
  Calendar,
  UserPlus,
  DollarSign,
  Phone,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  shortcut?: string;
  action: () => void;
}

interface QuickActionsHubProps {
  onPageChange: (page: string) => void;
}

export const QuickActionsHub: React.FC<QuickActionsHubProps> = ({
  onPageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const quickActions: QuickActionItem[] = [
    {
      id: "new-appointment",
      label: "Novo Agendamento",
      icon: Calendar,
      color: "bg-blue-600 hover:bg-blue-700",
      shortcut: "Ctrl+N",
      action: () => {
        onPageChange("appointments");
        setShowActions(false);
      },
    },
    {
      id: "walk-in",
      label: "Cliente Chegou",
      icon: UserPlus,
      color: "bg-green-600 hover:bg-green-700",
      shortcut: "Ctrl+W",
      action: () => {
        // Handle walk-in customer
        setIsOpen(true);
        setShowActions(false);
      },
    },
    {
      id: "checkout",
      label: "Finalizar Atendimento",
      icon: DollarSign,
      color: "bg-purple-600 hover:bg-purple-700",
      shortcut: "Ctrl+F",
      action: () => {
        onPageChange("payments");
        setShowActions(false);
      },
    },
    {
      id: "emergency",
      label: "Cancelamento",
      icon: AlertTriangle,
      color: "bg-red-600 hover:bg-red-700",
      action: () => {
        // Handle emergency cancellation
        setIsOpen(true);
        setShowActions(false);
      },
    },
    {
      id: "break",
      label: "Pausa/Intervalo",
      icon: Clock,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => {
        // Handle break time
        setIsOpen(true);
        setShowActions(false);
      },
    },
    {
      id: "call",
      label: "Ligar para Cliente",
      icon: Phone,
      color: "bg-indigo-600 hover:bg-indigo-700",
      action: () => {
        onPageChange("clients");
        setShowActions(false);
      },
    },
  ];

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowActions(!showActions);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showActions]);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Action Items */}
          <div
            className={cn(
              "absolute bottom-16 right-0 space-y-3 transition-all duration-300 transform",
              showActions
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none",
            )}
          >
            {quickActions.map((action, index) => (
              <div
                key={action.id}
                className={cn(
                  "transform transition-all duration-300",
                  showActions
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0",
                )}
                style={{
                  transitionDelay: showActions
                    ? `${index * 50}ms`
                    : `${(quickActions.length - index) * 50}ms`,
                }}
              >
                <Button
                  onClick={action.action}
                  className={cn(
                    "flex items-center space-x-3 min-w-0 h-12 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-white group",
                    action.color,
                  )}
                >
                  <action.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                  {action.shortcut && (
                    <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded">
                      {action.shortcut}
                    </span>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Main FAB */}
          <Button
            onClick={() => setShowActions(!showActions)}
            className={cn(
              "rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 transform",
              showActions
                ? "rotate-45 bg-red-600 hover:bg-red-700"
                : "rotate-0 bg-blue-600 hover:bg-blue-700",
            )}
          >
            {showActions ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Plus className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>

        {/* Keyboard shortcut hint */}
        {!showActions && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Press Ctrl+K for quick actions
          </div>
        )}
      </div>

      {/* Backdrop */}
      {showActions && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowActions(false)}
        />
      )}

      {/* Action Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ação Rápida</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
