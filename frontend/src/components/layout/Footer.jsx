import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="HackConnect" className="w-6 h-6 rounded-lg" />
            <span className="font-display font-bold text-slate-900 dark:text-white">HackConnect</span>
            <span className="font-mono text-[10px] text-slate-400">v2.4 Production</span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm text-center md:text-left">
            The student-exclusive networking & hackathon team-building platform. Designed for first-year through fourth-year innovators.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <Link to={ROUTES.HOME} className="hover:text-blue-600">Discovery</Link>
          <Link to={ROUTES.FEED} className="hover:text-blue-600">Campus Feed</Link>
          <Link to={ROUTES.STARTUPS} className="hover:text-blue-600">Startups</Link>
          <Link to={ROUTES.PROJECTS} className="hover:text-blue-600">Workspaces</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 flex items-center gap-1">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" /> for collegiate builders worldwide
        </div>
      </div>
    </footer>
  );
};

export default Footer;
