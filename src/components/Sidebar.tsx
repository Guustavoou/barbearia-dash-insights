import React from "react";
import {
  BarChart3,
  Users,
  Calendar,
  Package,
  FileText,
  Settings,
  Menu,
  ChevronLeft,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { PageType } from "@/lib/types";

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  darkMode: boolean;
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
}) => (
  <button
    onClick={() => onPageChange(pageId)}
    className={cn(
      "w-full flex items-center gap-2.5 px-3 rounded-lg text-left transition-all duration-200",
      currentPage === pageId
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
        : darkMode
          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      collapsed && "justify-center px-2",
    )}
    style={{ height: "36px", minHeight: "36px", maxHeight: "36px" }}
  >
    <div className="relative flex-shrink-0">
      <Icon className="h-5 w-5" />
      {hasNotification && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </div>
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse,
  darkMode,
}) => {
  // Total height: 100vh
  // Header: 64px
  // Footer: 88px
  // Available for content: calc(100vh - 152px)
  // 4 sections with 13 items + 4 headers = needs to fit exactly

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 sidebar-container",
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
        "border-r shadow-lg transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden !important",
      }}
    >
      {/* Header - Exactly 64px */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        style={{
          height: "64px",
          minHeight: "64px",
          maxHeight: "64px",
          overflow: "hidden",
        }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span
              className={cn(
                "font-bold text-lg",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              Unclic
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "p-2 rounded-lg transition-colors",
            darkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600",
          )}
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation - Exactly calc(100vh - 152px) */}
      <div
        className="px-4"
        style={{
          height: "calc(100vh - 152px)",
          minHeight: "calc(100vh - 152px)",
          maxHeight: "calc(100vh - 152px)",
          overflow: "hidden !important",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <div className="space-y-4" style={{ height: "100%" }}>
          {/* Principal Section */}
          <div>
            {!collapsed && (
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-2",
                  darkMode ? "text-gray-400" : "text-gray-500",
                )}
                style={{ height: "16px", lineHeight: "16px" }}
              >
                PRINCIPAL
              </h3>
            )}
            <div className="space-y-1">
              <MenuItem
                icon={BarChart3}
                label="Dashboard"
                pageId="dashboard"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={Calendar}
                label="Agendamentos"
                pageId="appointments"
                hasNotification={true}
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Gestão Section */}
          <div>
            {!collapsed && (
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-2",
                  darkMode ? "text-gray-400" : "text-gray-500",
                )}
                style={{ height: "16px", lineHeight: "16px" }}
              >
                GESTÃO
              </h3>
            )}
            <div className="space-y-1">
              <MenuItem
                icon={Users}
                label="Clientes"
                pageId="clients"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={Package}
                label="Serviços"
                pageId="services"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={Users}
                label="Profissionais"
                pageId="professionals"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={Package}
                label="Estoque"
                pageId="stock"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Financeiro Section */}
          <div>
            {!collapsed && (
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-2",
                  darkMode ? "text-gray-400" : "text-gray-500",
                )}
                style={{ height: "16px", lineHeight: "16px" }}
              >
                FINANCEIRO
              </h3>
            )}
            <div className="space-y-1">
              <MenuItem
                icon={DollarSign}
                label="Financeiro"
                pageId="financial"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={FileText}
                label="Pagamentos"
                pageId="payments"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={BarChart3}
                label="Relatórios"
                pageId="reports"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Sistema Section */}
          <div>
            {!collapsed && (
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-2",
                  darkMode ? "text-gray-400" : "text-gray-500",
                )}
                style={{ height: "16px", lineHeight: "16px" }}
              >
                SISTEMA
              </h3>
            )}
            <div className="space-y-1">
              <MenuItem
                icon={FileText}
                label="Marketing"
                pageId="marketing"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={FileText}
                label="Documentos"
                pageId="documents"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
              <MenuItem
                icon={Settings}
                label="Configurações"
                pageId="settings"
                currentPage={currentPage}
                onPageChange={onPageChange}
                collapsed={collapsed}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Profile - Exactly 88px */}
      <div
        className="p-4"
        style={{
          height: "88px",
          minHeight: "88px",
          maxHeight: "88px",
          overflow: "hidden",
        }}
      >
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-colors",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200",
            "border",
            !collapsed &&
              "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          )}
          style={{ height: "56px", maxHeight: "56px" }}
        >
          {!collapsed ? (
            <>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm truncate",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Maria Silva
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Studio Bella
                </p>
              </div>
            </>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-semibold text-xs">M</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
