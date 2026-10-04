import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Identity' },
  { id: 2, label: 'Skills' },
  { id: 3, label: 'Goals' },
  { id: 4, label: 'Proficiency' },
  { id: 5, label: 'Links & Bio' }
];

export default function OnboardingProgress({ currentStep = 1 }) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between max-w-xl mx-auto relative">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-slate-800 -z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-primary-600 transition-all duration-500 ease-out -z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                    : isCurrent
                    ? 'bg-white dark:bg-slate-900 border-2 border-primary-600 text-primary-600 ring-4 ring-primary-100 dark:ring-primary-950/50'
                    : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>
              <span
                className={`text-[11px] font-medium mt-2 whitespace-nowrap hidden sm:block ${
                  isCurrent
                    ? 'text-primary-600 dark:text-primary-400 font-bold'
                    : isDone
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
