import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Avatar } from '../shared/Avatar';
import { NotificationBell } from '../notifications/NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { ROUTES } from '../../config/routes';
import { Search, Menu, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const { profile, user } = useAuthStore();
  const { setMobileSidebarOpen } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 glass-header z-30 border-b border-slate-200/80 dark:border-slate-800 transition-all duration-150">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Trigger + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search Hub Trigger */}
          <div
            onClick={() => navigate(ROUTES.SEARCH)}
            className="relative flex items-center w-full max-w-md h-10 px-3.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <span className="text-xs text-slate-400 select-none truncate">
              Search by skill (PyTorch, Next.js), university, or role...
            </span>
            <kbd className="hidden sm:inline-flex items-center ml-auto px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 uppercase">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section: Actions, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Post button */}
          <Link
            to={ROUTES.FEED_CREATE}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-xs font-semibold font-display border border-blue-200 dark:border-blue-800 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post</span>
          </Link>

          <NotificationBell />
          <ThemeToggle />

          {/* User Profile Mini Badge */}
          {profile && (
            <Link
              to={ROUTES.PROFILE(profile.id)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
            >
              <Avatar
                src={profile.avatar_url}
                name={profile.full_name || user?.email}
                size="sm"
              />
              <span className="hidden md:inline font-display text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                {profile.full_name?.split(' ')[0] || 'Profile'}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
