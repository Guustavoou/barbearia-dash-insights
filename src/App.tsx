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
import { LoginPage } from "@/pages/Login";
import { OnboardingPage } from "@/pages/Onboarding";
import { SuccessStep } from "@/components/onboarding/SuccessStep";
import { PageType } from "@/lib/types";

const queryClient = new QueryClient();

type AppState = "login" | "onboarding" | "main" | "success";

const UnclicApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("login");
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
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

  // Check authentication and onboarding status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Check if user is authenticated (mock for now)
      const authToken = localStorage.getItem("unclic-auth-token");
      const onboardingCompleted = localStorage.getItem(
        "unclic-onboarding-completed",
      );

      if (authToken) {
        setIsAuthenticated(true);
        if (onboardingCompleted) {
          setHasCompletedOnboarding(true);
          setAppState("main");
        } else {
          setAppState("onboarding");
        }
      } else {
        setAppState("login");
      }
    };

    checkAuthStatus();
  }, []);

  // Mock authentication functions
  const handleLogin = (email: string, password: string) => {
    // Mock login process
    console.log("Login attempt:", email, password);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("unclic-auth-token", "mock-token-123");
      setIsAuthenticated(true);

      // Check if onboarding was completed
      const onboardingCompleted = localStorage.getItem(
        "unclic-onboarding-completed",
      );

      if (onboardingCompleted) {
        setHasCompletedOnboarding(true);
        setAppState("main");
      } else {
        setAppState("onboarding");
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Mock Google OAuth
    console.log("Google login attempt");

    // Simulate OAuth flow
    setTimeout(() => {
      localStorage.setItem("unclic-auth-token", "google-token-123");
      setIsAuthenticated(true);

      // New users typically need onboarding
      setAppState("onboarding");
    }, 1500);
  };

  const handleCreateAccount = () => {
    // Mock account creation
    console.log("Create account attempt");

    // Simulate account creation
    setTimeout(() => {
      localStorage.setItem("unclic-auth-token", "new-user-token-123");
      setIsAuthenticated(true);
      setAppState("onboarding");
    }, 1000);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("unclic-onboarding-completed", "true");
    setHasCompletedOnboarding(true);
    setAppState("success");
  };

  const handleGoToDashboard = () => {
    setAppState("main");
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("unclic-auth-token");
    localStorage.removeItem("unclic-onboarding-completed");
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setAppState("login");
    setCurrentPage("dashboard");
  };

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

  // Render based on app state
  switch (appState) {
    case "login":
      return (
        <LoginPage
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onCreateAccount={handleCreateAccount}
        />
      );

    case "onboarding":
      return <OnboardingPage onComplete={handleOnboardingComplete} />;

    case "success":
      return <SuccessStep onGoToDashboard={handleGoToDashboard} />;

    case "main":
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
              currentTime={currentTime}
              onPageChange={setCurrentPage}
              onLogout={handleLogout}
            />

            {/* Page Content */}
            <main className="p-6">
              <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
            </main>
          </div>
        </div>
      );

    default:
      return null;
  }
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
