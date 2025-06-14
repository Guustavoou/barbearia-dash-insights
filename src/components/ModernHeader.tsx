import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  ChevronDown,
  Building2,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SmartNotifications } from "@/components/SmartNotifications";
import { UserSession } from "@/lib/multiTenantTypes";

interface ModernHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentTime: Date;
  onPageChange: (page: string) => void;
  onLogout?: () => void;
  userSession?: UserSession | null;
  onToggleRightSidebar?: () => void;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  currentTime,
  onPageChange,
  onLogout,
  userSession,
  onToggleRightSidebar,
  onToggleSidebar,
  isMobile = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Toggle */}
        {isMobile && onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(currentTime)} • {formatTime(currentTime)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="search"
            className={cn(
              "border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-80 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            )}
            placeholder="Pesquisar clientes, agendamentos, serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full md:hidden"
          title="Pesquisar"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Right Sidebar Toggle */}
        {!isMobile && onToggleRightSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRightSidebar}
            className="w-10 h-10 rounded-full hidden lg:flex"
            title="Toggle Calendar"
          >
            <Calendar className="w-4 h-4" />
          </Button>
        )}

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="w-10 h-10 rounded-full"
          title={darkMode ? "Modo claro" : "Modo escuro"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* Smart Notifications */}
        <SmartNotifications darkMode={darkMode} onPageChange={onPageChange} />

        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange("help")}
          className="w-10 h-10 rounded-full"
          title="Ajuda"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userSession?.establishment?.name || "Minha Loja"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userSession?.user?.role || "Administrador"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {getUserInitials(
                      userSession?.establishment?.name || "Minha Loja",
                    )}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 p-2 dark:bg-gray-800 dark:border-gray-700"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {getUserInitials(
                      userSession?.user?.name || "Rodrigo Almeida",
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userSession?.user?.name || "Rodrigo Almeida"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userSession?.user?.email || "rodrigo@unclic.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="dark:bg-gray-700" />

            <DropdownMenuItem
              className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => onPageChange("settings")}
            >
              <Building2 className="w-4 h-4" />
              <span>Minha Empresa</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => onPageChange("settings")}
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => onPageChange("settings")}
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="dark:bg-gray-700" />

            <DropdownMenuItem
              className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 dark:hover:bg-gray-700 cursor-pointer"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
