import React from 'react';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import SEOHead from '../components/shared/SEOHead';
import { Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <SEOHead title="Profile Onboarding — HackConnect" />
      
      {/* Top Simple Brand Bar */}
      <div className="w-full py-4 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
            HC
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            HackConnect
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          <span>Builder Onboarding</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <OnboardingWizard />
      </main>
    </div>
  );
}
