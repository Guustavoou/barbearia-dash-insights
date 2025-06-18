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
  Download,
  FileText,
  Bell,
  X,
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
import { toast } from "@/hooks/use-toast";
import { PageType } from "@/lib/types";

interface ModernHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentTime: Date;
  onPageChange: (page: PageType) => void;
  onLogout: () => void;
  userSession: UserSession | null;
  onToggleRightSidebar?: () => void;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  rightSidebarOpen?: boolean;
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
  rightSidebarOpen = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
    });
  };

  // Button functionality handlers
  const handleExportData = () => {
    toast({
      title: "📊 Exportando Dados",
      description: "Preparando relatório completo do sistema...",
    });

    setTimeout(() => {
      toast({
        title: "✅ Exportação Concluída",
        description: "Seus dados foram exportados com sucesso!",
      });
    }, 2000);
  };

  const handleMyCompany = () => {
    onPageChange("settings");
    toast({
      title: "🏢 Minha Empresa",
      description: "Redirecionando para configurações da empresa...",
    });
  };

  const handleProfile = () => {
    onPageChange("settings");
    toast({
      title: "👤 Perfil",
      description: "Acessando configurações do perfil...",
    });
  };

  const handleSettings = () => {
    onPageChange("settings");
    toast({
      title: "⚙️ Configurações",
      description: "Abrindo painel de configurações...",
    });
  };

  const handleDocuments = () => {
    onPageChange("documents");
    toast({
      title: "📄 Documentos",
      description: "Acessando área de documentos...",
    });
  };

  const handleHelp = () => {
    toast({
      title: "❓ Central de Ajuda",
      description: "Abrindo recursos de ajuda e suporte...",
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "🔍 Busca Realizada",
        description: `Procurando por: "${searchQuery}"`,
      });
      // Implement search logic here
      console.log("Searching for:", searchQuery);
    } else {
      toast({
        title: "❌ Busca Vazia",
        description: "Por favor, digite algo para buscar.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleLogoutWithConfirmation = () => {
    toast({
      title: "👋 Logout Realizado",
      description: "Você foi desconectado com sucesso. Até logo!",
    });
    setTimeout(() => {
      onLogout();
    }, 1000);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Date and Time */}
            <div className="hidden sm:flex flex-col">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                {formatDate(currentTime)}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                {formatTime(currentTime)}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar clientes, agendamentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Button for mobile */}
              <Button
                onClick={handleSearch}
                size="sm"
                className="ml-2 lg:hidden"
                disabled={!searchQuery.trim()}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Export Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportData}
              className="hidden sm:flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exportar</span>
            </Button>

            {/* Documents Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDocuments}
              className="hidden sm:flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Documentos</span>
            </Button>

            {/* Help Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelp}
              className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
              className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </Button>

            {/* Notifications */}
            <SmartNotifications darkMode={darkMode} />

            {/* Right Sidebar Toggle */}
            {onToggleRightSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleRightSidebar}
                className={cn(
                  "relative hover:bg-gray-100 dark:hover:bg-gray-700",
                  rightSidebarOpen && "bg-gray-100 dark:bg-gray-700",
                )}
              >
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
            )}

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
                        {userSession?.establishment?.name || "Salão da Maria"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        owner
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-medium">
                        {getUserInitials(
                          userSession?.user?.name || "Maria Silva",
                        )}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 dark:bg-gray-800 dark:border-gray-700 shadow-xl"
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                      <span className="text-white font-medium text-lg">
                        {getUserInitials(
                          userSession?.user?.name || "Maria Silva",
                        )}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userSession?.user?.name || "Maria Silva"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {userSession?.user?.email || "simplekscred@gmail.com"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="dark:bg-gray-700" />

                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20"
                  onClick={handleMyCompany}
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Minha Empresa</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20"
                  onClick={handleProfile}
                >
                  <User className="w-4 h-4 text-green-600" />
                  <span>Perfil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20"
                  onClick={handleSettings}
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span>Configurações</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4 text-orange-600" />
                  <span>Exportar</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="dark:bg-gray-700" />

                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 dark:hover:bg-gray-700 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20"
                  onClick={handleLogoutWithConfirmation}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
