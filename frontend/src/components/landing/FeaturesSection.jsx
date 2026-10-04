import React from 'react';
import { Users, FolderGit2, Rocket, FileText, Sparkles, ShieldCheck } from 'lucide-react';
import Card from '../shared/Card';

const FEATURES = [
  {
    icon: Sparkles,
    color: 'text-primary-500 bg-primary-50 dark:bg-primary-950/40',
    title: 'Complementary Matchmaking',
    desc: 'If you build frontends, HackConnect recommends expert backend engineers, ML hackers, and UI designers. No more homogeneous teams.'
  },
  {
    icon: Users,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
    title: 'Tinder-Style Discovery Cards',
    desc: 'Browse rich student profile cards showcasing verified skills, proficiency meters, hackathon histories, and mutual campus connections.'
  },
  {
    icon: FolderGit2,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    title: 'Real-Time Project Workspaces',
    desc: 'Once your team connects, launch an instant collaboration workspace complete with Kanban boards, file sharing, and live group chat.'
  },
  {
    icon: Rocket,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
    title: 'Venture Proposals & Co-Founders',
    desc: 'Looking beyond 36-hour hackathons? Post serious startup proposals, recruit technical co-founders, and review candidate applications.'
  },
  {
    icon: FileText,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
    title: 'Showcase Feed & Retrospectives',
    desc: 'Share wins, architecture diagrams, and learnings with an active student developer feed supporting code snippets and image attachments.'
  },
  {
    icon: ShieldCheck,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    title: 'Zero Recruiter Noise',
    desc: 'Strictly built for and by students. No corporate recruiters, spam outreach, or promotional fluff. Just ambitious engineers building software.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Student Builders
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Everything you need from assembling a hackathon team at 2 AM to launching a VC-backed collegiate startup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl hover:shadow-lg transition-all space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
