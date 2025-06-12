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
import { Services } from "@/pages/Services";
import { Professionals } from "@/pages/Professionals";
import { Financial } from "@/pages/Financial";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { Calendar } from "@/pages/Calendar";
import { Help } from "@/pages/Help";
import { Payments } from "@/pages/Payments";
import { Marketing } from "@/pages/Marketing";
import { Documents } from "@/pages/Documents";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { PageType } from "@/lib/types";

const queryClient = new QueryClient();

const UnclicApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      case "services":
        return <Services darkMode={darkMode} />;
      case "professionals":
        return <Professionals darkMode={darkMode} />;
      case "financial":
        return <Financial darkMode={darkMode} />;
      case "reports":
        return <Reports darkMode={darkMode} />;
      case "settings":
        return <Settings darkMode={darkMode} />;
      case "calendar":
        return <Calendar darkMode={darkMode} />;
      case "help":
        return <Help darkMode={darkMode} />;
      case "payments":
        return <Payments darkMode={darkMode} />;
      case "marketing":
        return <Marketing darkMode={darkMode} />;
      case "documents":
        return <Documents darkMode={darkMode} />;
      default:
        return <Dashboard darkMode={darkMode} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div
      className="h-screen w-screen flex overflow-hidden layout-container"
      style={{
        height: "100vh",
        width: "100vw",
        maxHeight: "100vh",
        maxWidth: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          darkMode={darkMode}
        />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col h-screen transition-all duration-300 overflow-hidden",
          darkMode ? "dark bg-gray-900" : "bg-gray-50",
        )}
        style={{
          marginLeft: sidebarCollapsed ? "64px" : "256px",
          width: `calc(100vw - ${sidebarCollapsed ? "64px" : "256px"})`,
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0"
          style={{
            height: "72px",
            minHeight: "72px",
            maxHeight: "72px",
          }}
        >
          <Header
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            currentTime={currentTime}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Page Content */}
        <main
          className="flex-1 p-6 content-scroll"
          style={{
            height: "calc(100vh - 72px)",
            maxHeight: "calc(100vh - 72px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
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
