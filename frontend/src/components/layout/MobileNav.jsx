import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useAuthStore } from '../../stores/authStore';
import { Compass, Radio, Rocket, FolderGit2, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileNav = () => {
  const { profile } = useAuthStore();

  const navItems = [
    { label: 'Discovery', to: ROUTES.HOME, icon: <Compass className="w-5 h-5" /> },
    { label: 'Feed', to: ROUTES.FEED, icon: <Radio className="w-5 h-5" /> },
    { label: 'Startups', to: ROUTES.STARTUPS, icon: <Rocket className="w-5 h-5" /> },
    { label: 'Projects', to: ROUTES.PROJECTS, icon: <FolderGit2 className="w-5 h-5" /> },
    { label: 'Profile', to: profile ? ROUTES.PROFILE(profile.id) : ROUTES.LOGIN, icon: <User className="w-5 h-5" /> }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 glass-header border-t border-slate-200/80 dark:border-slate-800 z-40 px-2 flex items-center justify-around shadow-level-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            'flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-colors',
            isActive
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          {item.icon}
          <span className="text-[10px] font-display uppercase tracking-tight">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
