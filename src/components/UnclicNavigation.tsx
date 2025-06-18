import React, { useState } from "react";
import {
  Home,
  Users,
  Mail,
  Phone,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Eye,
  Target,
  Award,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/unclicUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UnclicNavigationProps {
  currentPage: "landing" | "about" | "contact";
  onPageChange: (page: "landing" | "about" | "contact") => void;
  scrollY?: number;
  onNavigateToLogin?: () => void;
}

export const UnclicNavigation: React.FC<UnclicNavigationProps> = ({
  currentPage,
  onPageChange,
  scrollY = 0,
  onNavigateToLogin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: "landing" as const, label: "Início", icon: Home },
    { id: "about" as const, label: "Sobre", icon: Users },
    // { id: "contact" as const, label: "Contato", icon: Mail },
  ];

  const handleNavigation = (page: "landing" | "about" | "contact") => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrollY > 50
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("landing")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                UNCLIC
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Beauty Tech</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600 px-3 py-2 rounded-lg",
                    currentPage === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => alert("Login em desenvolvimento")}
              >
                Entrar
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                onClick={() => alert("Teste grátis em desenvolvimento")}
              >
                Teste Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={cn(
                    "flex items-center space-x-3 w-full text-left py-3 px-4 rounded-lg transition-colors",
                    currentPage === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 space-y-3 border-t border-gray-100">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => alert("Login em desenvolvimento")}
              >
                Entrar
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => alert("Teste grátis em desenvolvimento")}
              >
                Teste Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Page Indicator */}
      {currentPage !== "landing" && (
        <div className="absolute top-full left-0 right-0 bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {currentPage === "about" && (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Sobre a UNCLIC - Nossa História
                    </span>
                  </>
                )}
                {currentPage === "contact" && (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Entre em Contato
                    </span>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("landing")}
                className="text-white hover:bg-white/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
