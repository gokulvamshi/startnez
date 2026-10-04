import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { LOOKING_FOR_OPTIONS, INTEREST_OPTIONS } from '../../config/skills';
import Button from '../shared/Button';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function OnboardingStep3({ onNext, onPrev }) {
  const { data, updateData } = useOnboardingStore();
  const [lookingFor, setLookingFor] = useState(data.looking_for || ['Hackathon Teammates']);
  const [interests, setInterests] = useState(data.interests || []);
  const [error, setError] = useState(null);

  const toggleLookingFor = (item) => {
    if (lookingFor.includes(item)) {
      if (lookingFor.length === 1) return; // Keep at least 1
      setLookingFor(lookingFor.filter((i) => i !== item));
    } else {
      setLookingFor([...lookingFor, item]);
    }
  };

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lookingFor.length === 0) {
      setError('Please select at least 1 goal.');
      return;
    }
    updateData({ looking_for: lookingFor, interests });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">What Are You Looking For?</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          HackConnect matches you with students who share complementary collaboration targets.
        </p>
      </div>

      {/* Looking For Grid */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Collaboration Goals (Select at least 1)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOOKING_FOR_OPTIONS.map((item) => {
            const active = lookingFor.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleLookingFor(item)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  active
                    ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${active ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className="text-sm">{item}</span>
                </div>
                {active && <Check className="w-4 h-4 text-primary-600" />}
              </button>
            );
          })}
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Tech / Industry Domains Interests */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Industry & Technology Interests (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = interests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back</span>
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Next: Proficiency
        </Button>
      </div>
    </form>
  );
}
