import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ModernHeader from '@/components/ModernHeader';
import ModernSidebar from '@/components/ModernSidebar';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Appointments from '@/pages/Appointments';
import Clients from '@/pages/Clients';
import Professionals from '@/pages/Professionals';
import Services from '@/pages/Services';
import Stock from '@/pages/Stock';
import Financial from '@/pages/Financial';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Calendar from '@/pages/Calendar';
import Marketing from '@/pages/Marketing';
import Payments from '@/pages/Payments';
import Documents from '@/pages/Documents';
import Help from '@/pages/Help';
import { PageType } from '@/lib/types';

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
              <div className="flex h-screen overflow-hidden">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Index />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Dashboard />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/appointments" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Appointments />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/clients" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Clients />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/professionals" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Professionals />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/services" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Services />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/stock" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Stock />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/financial" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Financial />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Reports />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Settings />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/calendar" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Calendar />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/marketing" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Marketing />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payments" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Payments />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/documents" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Documents />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/help" 
                    element={
                      <ProtectedRoute>
                        <>
                          <ModernSidebar 
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            expanded={sidebarExpanded}
                            onToggleExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Help />
                            </main>
                          </div>
                        </>
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </div>
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
