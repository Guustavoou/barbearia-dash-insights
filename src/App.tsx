import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@/lib/unclicUtils";
import { ModernSidebar } from "@/components/ModernSidebar";
import { ModernHeader } from "@/components/ModernHeader";
import { RightSidebar } from "@/components/RightSidebar";
import { OptimizedDashboard } from "@/pages/OptimizedDashboard";
import { QuickActionsHub } from "@/components/QuickActionsHub";
import { SmartNotifications } from "@/components/SmartNotifications";
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
import { useResponsive } from "@/hooks/useResponsive";
import { useRightSidebar } from "@/hooks/useRightSidebar";

// Multi-tenant providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MultiTenantOnboardingProvider } from "@/contexts/MultiTenantOnboardingContext";

const queryClient = new QueryClient();

type AppState = "login" | "onboarding" | "main" | "success";

const UnclicAppContent: React.FC = () => {
  const { session, isLoading, logout } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [appState, setAppState] = useState<AppState>("login");
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const rightSidebar = useRightSidebar({
    defaultOpen: isDesktop,
    persistKey: "unclicRightSidebar",
    isMobile,
  });
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Persist dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode.toString());
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  // Handle responsive changes
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      rightSidebar.close();
    } else if (isTablet) {
      setSidebarCollapsed(false);
      rightSidebar.close();
    } else {
      setSidebarCollapsed(false);
      // On desktop, restore previous state or open by default
      if (!rightSidebar.isOpen) {
        rightSidebar.open();
      }
    }
  }, [isMobile, isTablet, isDesktop, rightSidebar]);

  // Handle authentication state changes
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
        return <OptimizedDashboard darkMode={darkMode} />;
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
        return <OptimizedDashboard darkMode={darkMode} />;
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Unclic Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
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
            "min-h-screen transition-colors duration-300",
            darkMode ? "dark bg-gray-900" : "bg-gray-50",
          )}
        >
          {/* Mobile Backdrop */}
          {isMobile && !sidebarCollapsed && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarCollapsed(true)}
            />
          )}

          {/* Fixed Left Sidebar */}
          <ModernSidebar
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              if (isMobile) setSidebarCollapsed(true);
            }}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            darkMode={darkMode}
            userSession={session}
            isMobile={isMobile}
          />

          {/* Main Content Area */}
          <div
            className={cn(
              "flex flex-col min-h-screen transition-all duration-300",
              // Responsive left margin for sidebar
              !isMobile && !sidebarCollapsed && "ml-60",
              !isMobile && sidebarCollapsed && "ml-16",
              isMobile && "ml-0",
              // Responsive right margin for right sidebar
              rightSidebarOpen && !isMobile && "mr-80",
            )}
          >
            {/* Fixed Header */}
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
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              isMobile={isMobile}
            />

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">{renderCurrentPage()}</div>
            </main>
          </div>

          {/* Fixed Right Sidebar */}
          <RightSidebar
            isOpen={rightSidebarOpen}
            onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
            darkMode={darkMode}
          />

          {/* Quick Actions Hub */}
          <QuickActionsHub onPageChange={setCurrentPage} />
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
