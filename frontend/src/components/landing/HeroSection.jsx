import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal, Code2, Users2, Trophy, Rocket } from 'lucide-react';
import Button from '../shared/Button';
import Avatar from '../shared/Avatar';
import { ROUTES } from '../../config/routes';

export default function HeroSection() {
  return (
    <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-primary-600/20 via-indigo-500/20 to-pink-500/10 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-semibold shadow-sm">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span>The Reverse-LinkedIn for Student Builders</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Find Your Hackathon Team &{' '}
          <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Startup Co-Founders
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Connect with top-tier student developers, designers, AI researchers, and pitch specialists based on complementary skill complementarity — not superficial resumes.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to={ROUTES.SIGNUP}>
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 shadow-lg shadow-primary-500/25">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              <span>Sign In to Campus</span>
            </Button>
          </Link>
        </div>

        {/* Social Proof Avatars */}
        <div className="pt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100'].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Student builder"
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Joined by <strong>2,400+</strong> builders from Stanford, MIT, Berkeley, CMU & UT Austin
          </p>
        </div>
      </div>
    </div>
  );
}
