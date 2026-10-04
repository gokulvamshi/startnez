import React from 'react';
import { getDomainStyle } from '../../config/skills';

export default function SkillBadge({ skillName, proficiency, isPrimary, className = '' }) {
  const domainStyle = getDomainStyle(skillName);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${domainStyle.bg} ${domainStyle.text} ${domainStyle.border} ${
        isPrimary ? 'ring-1 ring-primary-500/20 font-semibold' : ''
      } ${className}`}
    >
      <span>{skillName}</span>
      {proficiency && (
        <span className="text-[10px] opacity-75 font-mono px-1 py-0.2 rounded bg-black/5 dark:bg-white/10">
          {proficiency[0]}
        </span>
      )}
    </span>
  );
}
