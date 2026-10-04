import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { useUIStore } from '../../stores/uiStore';
import { Toaster } from 'react-hot-toast';

export const AppLayout = () => {
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification Provider */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700 font-display text-xs rounded-xl shadow-level-3',
          duration: 3500
        }}
      />

      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="w-full pt-16 lg:pl-72 pb-20 lg:pb-8 flex-1 flex flex-col">
        <div className="max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default AppLayout;
