import React from 'react';
import { UserCheck, Sparkles, FolderGit2, Trophy } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Calibrate Your Skills',
    desc: 'Complete the 5-step onboarding wizard. Select your core skill domains, experience levels, and campus identity.'
  },
  {
    step: '02',
    title: 'Discover Complementary Peers',
    desc: 'Browse Discovery Cards ranked by smart complementary scoring. Filter by college, year, or specific hackathon goals.'
  },
  {
    step: '03',
    title: 'Connect & Launch Workspace',
    desc: 'Send a connection request. Once accepted, launch a full project workspace with Kanban boards, files, and real-time chat.'
  },
  {
    step: '04',
    title: 'Win Hackathons & Build Startups',
    desc: 'Collaborate with full team synergy. Publish project showcases to the campus feed or recruit co-founders for serious ventures.'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          User Journey
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How HackConnect Works
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          From zero to full hackathon squad in under four simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {STEPS.map((s, idx) => (
          <div
            key={s.step}
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative space-y-3"
          >
            <span className="font-mono text-3xl font-black text-primary-600/30 dark:text-primary-400/20 block">
              {s.step}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {s.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
