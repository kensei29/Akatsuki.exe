'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { state, dispatch } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/auth');
    }
  }, [state.isAuthenticated, router]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  if (!state.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle}
        className="hidden lg:flex"
      />
      
      {/* Mobile sidebar overlay */}
      {!sidebarCollapsed && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={handleSidebarToggle}>
          <Sidebar 
            collapsed={false} 
            onToggle={handleSidebarToggle}
            className="absolute left-0 top-0 h-full z-50"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation onMenuToggle={handleSidebarToggle} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}