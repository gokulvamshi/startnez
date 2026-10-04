import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Avatar } from '../shared/Avatar';
import { ROUTES } from '../../config/routes';
import {
  Users,
  Compass,
  Radio,
  Rocket,
  FolderGit2,
  Settings,
  Sparkles,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = ({ className = '', onCloseMobile = null }) => {
  const { profile, user, logout } = useAuthStore();

  const navItems = [
    { label: 'DISCOVERY', to: ROUTES.HOME, icon: <Compass className="w-5 h-5" /> },
    { label: 'Campus Feed', to: ROUTES.FEED, icon: <Radio className="w-5 h-5" /> },
    { label: 'Startups & Ventures', to: ROUTES.STARTUPS, icon: <Rocket className="w-5 h-5" /> },
    { label: 'Workspaces', to: ROUTES.PROJECTS, icon: <FolderGit2 className="w-5 h-5" /> },
    { label: 'My Connections', to: ROUTES.CONNECTIONS, icon: <Users className="w-5 h-5" /> },
    { label: 'Settings', to: ROUTES.SETTINGS, icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside className={cn(
      'w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen shadow-level-1 select-none',
      className
    )}>
      {/* Top Header */}
      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <img src="/logo.svg" alt="HackConnect" className="w-8 h-8 rounded-xl object-contain shadow-xs" />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              HackConnect
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              STUDENT
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-4 flex flex-col gap-1">
          <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Platform Navigation
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Profile Widget */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name || user?.email || 'Student'}
              size="md"
              isOnline={true}
              showPulse={true}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {profile?.full_name || 'Student Builder'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {profile?.year_of_study || 'Student'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
              {profile?.college || 'University'}
            </span>

            <button
              type="button"
              onClick={logout}
              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
