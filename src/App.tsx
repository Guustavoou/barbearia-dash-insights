import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@/lib/unclicUtils";
import { ModernSidebar } from "@/components/ModernSidebar";
import { ModernHeader } from "@/components/ModernHeader";
import { RightSidebar } from "@/components/RightSidebar";
import { ModernDashboard } from "@/pages/ModernDashboard";
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
import { LoginPage } from "@/pages/Login";
import { OnboardingPage } from "@/pages/Onboarding";
import { SuccessStep } from "@/components/onboarding/SuccessStep";
import { PageType } from "@/lib/types";

// Multi-tenant providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MultiTenantOnboardingProvider } from "@/contexts/MultiTenantOnboardingContext";

const queryClient = new QueryClient();

type AppState = "login" | "onboarding" | "main" | "success";

const UnclicAppContent: React.FC = () => {
  const { session, isLoading, logout } = useAuth();
  const [appState, setAppState] = useState<AppState>("login");
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
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

  // Handle auth state changes
  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      setAppState("login");
      return;
    }

    // Check if establishment needs onboarding
    const needsOnboarding = checkIfNeedsOnboarding(session.establishment);

    if (needsOnboarding) {
      setAppState("onboarding");
    } else {
      setAppState("main");
    }
  }, [session, isLoading]);

  const checkIfNeedsOnboarding = (establishment: any): boolean => {
    // Check if establishment has basic required data
    // This could be based on missing services, professionals, etc.
    return false; // For now, assume all establishments are complete
  };

  const handleOnboardingComplete = () => {
    setAppState("success");
  };

  const handleGoToDashboard = () => {
    setAppState("main");
    setCurrentPage("dashboard");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <ModernDashboard darkMode={darkMode} />;
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
        return <ModernDashboard darkMode={darkMode} />;
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Unclic Manager
          </h2>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Render based on app state
  switch (appState) {
    case "login":
      return <LoginPage />;

    case "onboarding":
      return (
        <MultiTenantOnboardingProvider>
          <OnboardingPage onComplete={handleOnboardingComplete} />
        </MultiTenantOnboardingProvider>
      );

    case "success":
      return <SuccessStep onGoToDashboard={handleGoToDashboard} />;

    case "main":
      if (!session) return <LoginPage />;

      return (
        <div
          className={cn(
            "min-h-screen flex transition-colors duration-300",
            darkMode ? "dark bg-gray-900" : "bg-gray-50",
          )}
        >
          {/* Left Sidebar */}
          <ModernSidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            darkMode={darkMode}
            userSession={session}
          />

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
            {/* Header */}
            <ModernHeader
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              currentTime={currentTime}
              onPageChange={setCurrentPage}
              onLogout={logout}
              userSession={session}
              onToggleRightSidebar={() =>
                setRightSidebarOpen(!rightSidebarOpen)
              }
            />

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div
                className={cn(
                  "transition-all duration-300",
                  rightSidebarOpen ? "pr-6" : "",
                )}
              >
                {renderCurrentPage()}
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <RightSidebar
            isOpen={rightSidebarOpen}
            onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
            darkMode={darkMode}
          />
        </div>
      );

    default:
      return <LoginPage />;
  }
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <UnclicAppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
