import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Button } from '../shared/Button';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../../stores/authStore';
import { Sparkles, ArrowRight } from 'lucide-react';

export const LandingNavbar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-header z-50 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="HackConnect" className="w-8 h-8 rounded-xl object-contain shadow-xs" />
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            HackConnect
          </span>
          <span className="hidden sm:inline font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            STUDENT ED.
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link to={ROUTES.HOME}>
              <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Workspace
              </Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button size="sm" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Join as Student
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
