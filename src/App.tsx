import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@/lib/unclicUtils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/pages/Dashboard";
import { Clients } from "@/pages/Clients";
import { Appointments } from "@/pages/Appointments";
import { Stock } from "@/pages/Stock";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { PageType } from "@/lib/types";

const queryClient = new QueryClient();

const UnclicApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard darkMode={darkMode} onPageChange={setCurrentPage} />;
      case "clients":
        return <Clients darkMode={darkMode} />;
      case "appointments":
        return <Appointments darkMode={darkMode} />;
      case "stock":
        return <Stock darkMode={darkMode} />;
      case "calendar":
      case "services":
      case "reports":
      case "settings":
      case "help":
      case "professionals":
      case "financial":
      case "payments":
      case "marketing":
      case "documents":
        return <PlaceholderPage pageType={currentPage} darkMode={darkMode} />;
      default:
        return <Dashboard darkMode={darkMode} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode ? "dark bg-gray-900" : "bg-gray-50",
      )}
    >
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        {/* Header */}
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          notifications={notifications}
          currentTime={currentTime}
        />

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UnclicApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
