import React, { useState } from "react";
import { Bell, Sun, Moon, Clock, Search } from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { GlobalSearch } from "./GlobalSearch";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: number;
  currentTime: Date;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  notifications,
  currentTime,
  onPageChange,
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
        {/* Left side - Time and Search */}
        <div className="flex items-center gap-4">
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
          <button
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-500",
            )}
            title="Notificações"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notifications}
              </div>
            )}
          </button>

          {/* User Avatar */}
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105",
              "bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold",
            )}
            title="Perfil do usuário"
          >
            M
          </div>
        </div>
      </div>
    </header>
  );
};
