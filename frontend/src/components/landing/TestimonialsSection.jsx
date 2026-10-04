import React from 'react';
import { Star } from 'lucide-react';
import Avatar from '../shared/Avatar';
import Card from '../shared/Card';

const TESTIMONIALS = [
  {
    name: 'Maya Chen',
    role: 'CS Junior @ Stanford',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    quote: 'I needed a Rust backend engineer and a pitch presenter for TreeHacks. Found both on HackConnect in 20 minutes — and we ended up winning 1st place in the AI track!'
  },
  {
    name: 'Liam Patel',
    role: 'EECS Sophomore @ UC Berkeley',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    quote: 'LinkedIn is flooded with recruiters and generic corporate fluff. HackConnect is the first platform that actually understands how student builders collaborate and build real software.'
  },
  {
    name: 'Elena Rostova',
    role: 'Design & AI @ MIT',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    quote: 'As a UI/UX designer, it was always hard to find serious developers to turn my prototypes into real products. HackConnect connected me with my current startup co-founder.'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Student Proof
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built by Students, Loved by Builders
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hear from collegiate developers who formed hackathon teams and founded startups on HackConnect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Avatar src={t.avatar} name={t.name} size="md" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
