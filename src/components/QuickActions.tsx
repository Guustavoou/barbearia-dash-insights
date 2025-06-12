
import React from "react";
import { Plus, Calendar, Users, Package } from "lucide-react";
import { cn } from "@/lib/unclicUtils";

interface QuickActionsProps {
  darkMode: boolean;
  onPageChange: (page: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  darkMode,
  onPageChange,
}) => {
  const actions = [
    {
      icon: Plus,
      label: "Novo Agendamento",
      onClick: () => onPageChange("appointments"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Users,
      label: "Novo Cliente",
      onClick: () => onPageChange("clients"),
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Calendar,
      label: "Agenda",
      onClick: () => onPageChange("calendar"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: Package,
      label: "Estoque",
      onClick: () => onPageChange("stock"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-lg transition-colors",
            action.color,
            "text-white"
          )}
        >
          <action.icon className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};
