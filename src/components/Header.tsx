import React, { useState } from "react";
import {
  Bell,
  Sun,
  Moon,
  Clock,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationCenter } from "./NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentTime: Date;
  onPageChange: (page: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  currentTime,
  onPageChange,
  onLogout,
  userSession,
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-sm bg-opacity-80",
        darkMode
          ? "bg-gray-900/80 border-gray-700"
          : "bg-white/80 border-gray-200",
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Establishment, Time and Search */}
        <div className="flex items-center gap-4">
          {/* Establishment Info */}
          {userSession && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-blue-50 text-blue-700 border border-blue-200",
              )}
            >
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium max-w-32 truncate">
                {userSession.establishment.name}
              </span>
            </div>
          )}

          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg",
              darkMode
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-600",
            )}
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {currentTime.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Global Search */}
          <div className="hidden md:block">
            <GlobalSearch
              darkMode={darkMode}
              onNavigate={(page) => onPageChange(page)}
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-500",
            )}
            title={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <NotificationCenter darkMode={darkMode} />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 p-1 rounded-lg transition-colors",
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold text-sm",
                  )}
                >
                  M
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4",
                    darkMode ? "text-gray-300" : "text-gray-500",
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userSession?.user.name || "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userSession?.user.email || ""}
                  </p>
                  <div className="flex items-center mt-2 pt-2 border-t">
                    <Building2 className="h-3 w-3 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {userSession?.establishment.name || "Estabelecimento"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onPageChange("settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPageChange("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
