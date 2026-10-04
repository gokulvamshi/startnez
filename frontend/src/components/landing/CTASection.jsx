import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../shared/Button';
import { ROUTES } from '../../config/routes';

export default function CTASection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white shadow-2xl space-y-6">
        {/* Glow */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xs -z-0" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for your next hackathon?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Stop Solo-Hacking. Assemble Your Dream Team Today.
          </h2>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mx-auto">
            Join thousands of student developers, designers, and startup founders building the future of software.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ROUTES.SIGNUP}>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-8 bg-white text-primary-700 hover:bg-slate-100 font-bold shadow-lg"
              >
                <span>Create Free Profile</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
