import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/shared/Button';
import SEOHead from '../components/shared/SEOHead';
import { ROUTES } from '../config/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <SEOHead title="404 — Page Not Found — HackConnect" />
      <div className="w-16 h-16 rounded-3xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 flex items-center justify-center mx-auto shadow-md">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-sm mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">404: Lost on Campus</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page or project workspace you are looking for has been moved, renamed, or does not exist.
        </p>
      </div>

      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="md">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Return to Discovery</span>
        </Button>
      </Link>
    </div>
  );
}
