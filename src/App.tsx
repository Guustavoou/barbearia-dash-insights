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
import { SimpleDashboard } from "@/pages/SimpleDashboard";
import { EnhancedInteractiveDashboard } from "@/pages/EnhancedInteractiveDashboard";
// 🚀 PRODUCTION COMPONENTS - 100% SUPABASE INTEGRATION
import BeautifulDashboardProduction from "@/pages/BeautifulDashboardProduction";
import BeautifulClientsProduction from "@/pages/BeautifulClientsProduction";
import BeautifulServicesProduction from "@/pages/BeautifulServicesProduction";
import BeautifulAppointmentsFixed from "@/pages/BeautifulAppointmentsFixed";
import { QuickActionsHub } from "@/components/QuickActionsHub";
import { SmartNotifications } from "@/components/SmartNotifications";
// LEGACY COMPONENTS (for backup)
import { BeautifulDashboard } from "@/pages/BeautifulDashboard";
import { BeautifulClients } from "@/pages/BeautifulClients";
import { BeautifulFinancial } from "@/pages/BeautifulFinancial";
import { BeautifulServices } from "@/pages/BeautifulServices";
import { BeautifulProfessionals } from "@/pages/BeautifulProfessionals";
import { BeautifulStock } from "@/pages/BeautifulStock";
import { BeautifulPayments } from "@/pages/BeautifulPayments";
import { BeautifulSettings } from "@/pages/BeautifulSettings";
import { BeautifulSettingsImproved } from "@/pages/BeautifulSettingsImproved";
import { BeautifulReports } from "@/pages/BeautifulReports";
import { BeautifulMarketing } from "@/pages/BeautifulMarketing";
import { BeautifulDocuments } from "@/pages/BeautifulDocuments";
import { BeautifulTesting } from "@/pages/BeautifulTesting";
import { DatabaseEmergencyFix } from "@/pages/DatabaseEmergencyFix";
import { AutoDatabaseErrorHandler } from "@/components/AutoDatabaseErrorHandler";
import { EmergencyDatabaseButton } from "@/components/EmergencyDatabaseButton";
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
import { UnclicWebsite } from "@/pages/UnclicWebsite";
import { PageType } from "@/lib/types";
import { useResponsive } from "@/hooks/useResponsive";
import { useRightSidebar } from "@/hooks/useRightSidebar";

// Multi-tenant providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MultiTenantOnboardingProvider } from "@/contexts/MultiTenantOnboardingContext";

// Supabase provider
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SupabaseStatus } from "@/components/SupabaseStatus";
import { RLSUrgentNotification } from "@/components/RLSUrgentNotification";
import { ApiStatusDebug } from "@/components/ApiStatusDebug";

const queryClient = new QueryClient();

type AppState = "login" | "onboarding" | "main" | "success";

const UnclicAppContent: React.FC = () => {
  const { session, isLoading, logout } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [appState, setAppState] = useState<AppState>("login");
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    // Check URL for emergency database fix
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get("page");
      const hashPage = window.location.hash.substring(1); // Remove #

      if (
        pageParam === "database-emergency" ||
        hashPage === "database-emergency"
      ) {
        return "database-emergency";
      }
    }
    return "dashboard";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const rightSidebar = useRightSidebar({
    defaultOpen: !isMobile, // Aberta por padrão apenas em desktop
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
      // On desktop, only open if user hasn't explicitly closed it
      // This runs only when screen size changes, not when rightSidebar state changes
    }
  }, [isMobile, isTablet, isDesktop]); // Removed rightSidebar from dependencies

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
      case "landing":
        return <UnclicWebsite />;
      case "dashboard":
        return (
          <BeautifulDashboardProduction
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "clients":
        return (
          <BeautifulClientsProduction
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "appointments":
        return (
          <BeautifulAppointmentsFixed
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "stock":
        return (
          <BeautifulStock darkMode={darkMode} onPageChange={setCurrentPage} />
        );
      case "services":
        return (
          <BeautifulServicesProduction
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "professionals":
        return (
          <BeautifulProfessionals
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "financial":
        return (
          <BeautifulFinancial
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "reports":
        return (
          <BeautifulReports darkMode={darkMode} onPageChange={setCurrentPage} />
        );
      case "settings":
        return (
          <BeautifulSettingsImproved
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "calendar":
        return <Calendar darkMode={darkMode} />;
      case "help":
        return <Help darkMode={darkMode} />;
      case "payments":
        return (
          <BeautifulPayments
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "marketing":
        return (
          <BeautifulMarketing
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "documents":
        return (
          <BeautifulDocuments
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
      case "testing":
        return (
          <BeautifulTesting darkMode={darkMode} onPageChange={setCurrentPage} />
        );
      case "database-emergency":
        return (
          <DatabaseEmergencyFix
            onComplete={() => setCurrentPage("dashboard")}
          />
        );
      default:
        return (
          <BeautifulDashboard
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />
        );
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
              rightSidebar.isOpen && !isMobile && "mr-80",
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
              onToggleRightSidebar={rightSidebar.toggle}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              isMobile={isMobile}
              rightSidebarOpen={rightSidebar.isOpen}
            />

            {/* Scrollable Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">{renderCurrentPage()}</div>
            </main>
          </div>

          {/* Fixed Right Sidebar */}
          <RightSidebar
            isOpen={rightSidebar.isOpen}
            onToggle={rightSidebar.toggle}
            darkMode={darkMode}
            onPageChange={setCurrentPage}
          />

          {/* RLS Urgent Notification */}
          <RLSUrgentNotification />

          {/* Quick Actions Hub */}
          <QuickActionsHub onPageChange={setCurrentPage} />

          {/* Supabase Status */}
          <SupabaseStatus />

          {/* API Status Debug */}
          <ApiStatusDebug />

          {/* Auto Database Error Handler */}
          <AutoDatabaseErrorHandler onPageChange={setCurrentPage} />

          {/* Emergency Database Button - Temporarily disabled until database is fixed */}
          {/* <EmergencyDatabaseButton onPageChange={setCurrentPage} /> */}
        </div>
      );

    default:
      return <LoginPage />;
  }
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupabaseAuthProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <UnclicAppContent />
        </AuthProvider>
      </SupabaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
