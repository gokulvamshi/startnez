import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { PROFICIENCY_LEVELS } from '../../config/skills';
import Button from '../shared/Button';
import { ArrowLeft, Award } from 'lucide-react';

export default function OnboardingStep4({ onNext, onPrev }) {
  const { data, updateData } = useOnboardingStore();
  const [skillsWithProficiency, setSkillsWithProficiency] = useState(
    (data.skills || []).map((s) => ({
      name: typeof s === 'string' ? s : s.name,
      proficiency: typeof s === 'object' && s.proficiency ? s.proficiency : 'Intermediate',
      is_primary: typeof s === 'object' ? !!s.is_primary : false
    }))
  );

  const handleProficiencyChange = (skillName, newLevel) => {
    setSkillsWithProficiency((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, proficiency: newLevel } : s))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData({ skills: skillsWithProficiency });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skill Proficiency Calibration</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Set your self-assessed experience level for each skill to help match you on hackathon teams.
        </p>
      </div>

      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
        {skillsWithProficiency.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.name}
                </span>
                {item.is_primary && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Primary
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                {item.proficiency}
              </span>
            </div>

            {/* Proficiency Radio Selector */}
            <div className="grid grid-cols-4 gap-2">
              {PROFICIENCY_LEVELS.map((level) => {
                const isSelected = item.proficiency === level;
                return (
                  <button
                    type="button"
                    key={level}
                    onClick={() => handleProficiencyChange(item.name, level)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back</span>
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Next: Bio & Socials
        </Button>
      </div>
    </form>
  );
}
