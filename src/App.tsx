
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernSidebar } from '@/components/ModernSidebar';
import { Index } from '@/pages/Index';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Appointments } from '@/pages/Appointments';
import { Clients } from '@/pages/Clients';
import { Professionals } from '@/pages/Professionals';
import { Services } from '@/pages/Services';
import { Stock } from '@/pages/Stock';
import { Financial } from '@/pages/Financial';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { Calendar } from '@/pages/Calendar';
import { Marketing } from '@/pages/Marketing';
import { Payments } from '@/pages/Payments';
import { Documents } from '@/pages/Documents';
import { Help } from '@/pages/Help';
import { PageType } from '@/lib/types';

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType);
  };

  // Mock user session for header props with all required properties
  const mockUserSession = {
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      role: 'admin' as const,
      establishment_id: '1',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    establishment: {
      id: '1',
      name: 'Salão da Maria',
      slug: 'salao-da-maria'
    },
    token: 'mock-token',
    permissions: ['read', 'write']
  };

  const mockCurrentTime = new Date();

  const handleLogout = () => {
    console.log('Logout clicked');
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Index darkMode={darkMode} onPageChange={handlePageChange} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Dashboard darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Appointments darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Clients darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Professionals darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Services darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Stock darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Financial darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Reports darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Settings darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Calendar darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Marketing darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Payments darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Documents darkMode={darkMode} />
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
                            collapsed={!sidebarExpanded}
                            onToggleCollapse={() => setSidebarExpanded(!sidebarExpanded)}
                            darkMode={darkMode}
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <ModernHeader 
                              darkMode={darkMode}
                              onToggleDarkMode={() => setDarkMode(!darkMode)}
                              onPageChange={handlePageChange}
                              currentTime={mockCurrentTime}
                              onLogout={handleLogout}
                              userSession={mockUserSession}
                            />
                            <main className="flex-1 overflow-y-auto p-6">
                              <Help darkMode={darkMode} />
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
