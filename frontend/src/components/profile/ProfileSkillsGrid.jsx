import React from 'react';
import SkillBadge from '../discovery/SkillBadge';
import ProficiencyIndicator from '../discovery/ProficiencyIndicator';

export default function ProfileSkillsGrid({ skills = [] }) {
  if (!skills || skills.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic">No technical skills listed yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Skills & Technical Proficiency ({skills.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((item) => {
          const sName = typeof item === 'string' ? item : item.skill_name || item.name;
          const prof = typeof item === 'object' ? item.proficiency : 'Intermediate';
          const isPrimary = typeof item === 'object' ? !!item.is_primary : false;

          return (
            <div
              key={sName}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <SkillBadge skillName={sName} isPrimary={isPrimary} />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-mono text-slate-500">{prof}</span>
                <ProficiencyIndicator level={prof} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
