import React from "react";
import {
  BarChart3,
  Users,
  Calendar,
  Package,
  FileText,
  Settings,
  HelpCircle,
  DollarSign,
  Scissors,
  UserCheck,
  CreditCard,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { PageType } from "@/lib/types";
import { UnclicLogo } from "@/components/UnclicLogo";

interface ModernSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
  userSession?: any;
  isMobile?: boolean;
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  pageId: PageType;
  hasNotification?: boolean;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  collapsed: boolean;
  darkMode: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  pageId,
  hasNotification,
  currentPage,
  onPageChange,
  collapsed,
  darkMode,
}) => {
  const isActive = currentPage === pageId;

  return (
    <button
      onClick={() => onPageChange(pageId)}
      className={cn(
        "w-full flex items-center px-3 py-2 rounded-md text-left transition-all duration-200 group relative",
        isActive
          ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600 font-medium dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-400"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
        collapsed ? "justify-center px-2" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8",
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400",
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      {!collapsed && <span className="ml-2 text-sm font-medium">{label}</span>}
      {hasNotification && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );
};

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse,
  darkMode,
  userSession,
  isMobile = false,
}) => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", pageId: "dashboard" as PageType },
    {
      icon: Calendar,
      label: "Agendamentos",
      pageId: "appointments" as PageType,
      hasNotification: true,
    },
    { icon: Users, label: "Clientes", pageId: "clients" as PageType },
    { icon: Scissors, label: "Serviços", pageId: "services" as PageType },
    {
      icon: UserCheck,
      label: "Profissionais",
      pageId: "professionals" as PageType,
    },
    { icon: Package, label: "Estoque", pageId: "stock" as PageType },
    { icon: DollarSign, label: "Financeiro", pageId: "financial" as PageType },
    { icon: CreditCard, label: "Pagamentos", pageId: "payments" as PageType },
    { icon: TrendingUp, label: "Relatórios", pageId: "reports" as PageType },
    { icon: Megaphone, label: "Marketing", pageId: "marketing" as PageType },
    { icon: FileText, label: "Documentos", pageId: "documents" as PageType },
    { icon: Settings, label: "Configurações", pageId: "settings" as PageType },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm dark:bg-gray-800 dark:border-gray-700 z-50",
        // Width based on collapsed state
        collapsed ? "w-16" : "w-60",
        // Mobile positioning
        isMobile && collapsed && "-translate-x-full",
        isMobile && !collapsed && "translate-x-0",
      )}
    >
      {/* Logo */}
      <div className="-mt-0.5 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div
          className={cn(
            "transition-all duration-300",
            collapsed ? "text-center" : "",
          )}
        >
          <UnclicLogo collapsed={collapsed} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-hide">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <MenuItem
                icon={item.icon}
                label={item.label}
                pageId={item.pageId}
                hasNotification={item.hasNotification}
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            collapsed ? "justify-center" : "",
          )}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-600">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userSession?.user?.name || "Rodrigo Almeida"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userSession?.user?.role || "Administrador"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
