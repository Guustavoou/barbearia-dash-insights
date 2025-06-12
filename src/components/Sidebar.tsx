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
      "w-full flex items-center gap-2 px-3 py-1 rounded-lg text-left transition-all duration-200",
      currentPage === pageId
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
        : darkMode
          ? "text-gray-300 hover:bg-gray-700/50 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      collapsed && "justify-center px-2",
    )}
    style={{ height: "32px", minHeight: "32px", maxHeight: "32px" }}
  >
    <div className="relative flex-shrink-0">
      <Icon className="h-4 w-4" />
      {hasNotification && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </div>
    {!collapsed && (
      <span className="font-medium text-sm truncate">{label}</span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse,
  darkMode,
}) => {
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
        minHeight: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header - Altura fixa: 50px */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700"
        style={{
          height: "50px",
          minHeight: "50px",
          maxHeight: "50px",
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">U</span>
            </div>
            <span
              className={cn(
                "font-bold text-base",
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
            "p-1 rounded-lg transition-colors",
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

      {/* Navigation Area - Altura calculada: calc(100vh - 50px - 65px) = calc(100vh - 115px) */}
      <div
        className="px-3 py-2"
        style={{
          height: "calc(100vh - 115px)",
          minHeight: "calc(100vh - 115px)",
          maxHeight: "calc(100vh - 115px)",
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Principal Section */}
        <div>
          {!collapsed && (
            <h3
              className={cn(
                "text-xs font-semibold uppercase tracking-wider px-1 mb-1",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
              style={{ height: "16px", lineHeight: "16px" }}
            >
              PRINCIPAL
            </h3>
          )}
          <div className="space-y-0.5">
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
                "text-xs font-semibold uppercase tracking-wider px-1 mb-1",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
              style={{ height: "16px", lineHeight: "16px" }}
            >
              GESTÃO
            </h3>
          )}
          <div className="space-y-0.5">
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
                "text-xs font-semibold uppercase tracking-wider px-1 mb-1",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
              style={{ height: "16px", lineHeight: "16px" }}
            >
              FINANCEIRO
            </h3>
          )}
          <div className="space-y-0.5">
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
                "text-xs font-semibold uppercase tracking-wider px-1 mb-1",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
              style={{ height: "16px", lineHeight: "16px" }}
            >
              SISTEMA
            </h3>
          )}
          <div className="space-y-0.5">
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

      {/* User Profile - Altura fixa: 65px */}
      <div
        className="px-3 py-2"
        style={{
          height: "65px",
          minHeight: "65px",
          maxHeight: "65px",
          flexShrink: 0,
        }}
      >
        <div
          className={cn(
            "flex items-center gap-2 p-2 rounded-xl transition-colors h-full",
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200",
            "border",
            !collapsed &&
              "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
          )}
          style={{ height: "49px", maxHeight: "49px" }}
        >
          {!collapsed ? (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm truncate",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                  style={{ lineHeight: "1.2" }}
                >
                  Maria Silva
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    darkMode ? "text-gray-400" : "text-gray-500",
                  )}
                  style={{ lineHeight: "1.2" }}
                >
                  Studio Bella
                </p>
              </div>
            </>
          ) : (
            <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-semibold text-xs">M</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
