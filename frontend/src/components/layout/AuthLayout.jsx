import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { ThemeToggle } from './ThemeToggle';
import { Sparkles, Terminal, Award, Users } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Top Bar */}
      <header className="w-full h-16 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="HackConnect" className="w-8 h-8 rounded-xl object-contain shadow-xs" />
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            HackConnect
          </span>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            STUDENT ED.
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Pitch Column */}
          <div className="hidden lg:flex lg:col-span-6 flex-col gap-6 pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Verified College Builders Only
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Reverse LinkedIn. Built for hackathons & startups.
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Never get stuck without a backend engineer, UI architect, or stage presenter again. Connect based on complementary skills, not corporate resumes.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-level-1 flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-display">1.2k+</span>
                <span className="text-xs text-slate-500 font-medium">Students matched</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-level-1 flex flex-col gap-1">
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">140+</span>
                <span className="text-xs text-slate-500 font-medium">Hackathon trophies</span>
              </div>
            </div>
          </div>

          {/* Right Form Card Column */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-level-2 dark:shadow-dark-2 flex flex-col gap-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="w-full py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} HackConnect. Student Networking Protocol.
      </footer>
    </div>
  );
};

export default AuthLayout;
