import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import SkillSelector from './SkillSelector';
import Button from '../shared/Button';
import { ArrowLeft } from 'lucide-react';

export default function OnboardingStep2({ onNext, onPrev }) {
  const { data, updateData } = useOnboardingStore();
  const [skills, setSkills] = useState(data.skills || []);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skills || skills.length === 0) {
      setError('Please select at least 1 skill to showcase on your profile.');
      return;
    }
    updateData({ skills });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Technical Superpowers</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pick up to 10 skills. Star your top 3 to showcase them on your Discovery Card.
        </p>
      </div>

      <SkillSelector
        selectedSkills={skills}
        onChange={(newSkills) => {
          setSkills(newSkills);
          if (newSkills.length > 0) setError(null);
        }}
        error={error}
      />

      <div className="pt-4 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back</span>
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Next: Goals & Interests
        </Button>
      </div>
    </form>
  );
}
