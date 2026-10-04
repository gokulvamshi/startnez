import React, { useState } from 'react';
import { Search, Plus, Check, Star, X } from 'lucide-react';
import { PREDEFINED_SKILLS, SKILL_CATEGORIES } from '../../config/skills';
import Badge from '../shared/Badge';

export default function SkillSelector({
  selectedSkills = [],
  onChange,
  maxSkills = 10,
  minSkills = 1,
  error
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const allSkills = Object.entries(PREDEFINED_SKILLS).flatMap(([category, skills]) =>
    skills.map((skill) => ({ name: skill, category }))
  );

  const filteredSkills = allSkills.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const isSelected = (skillName) =>
    selectedSkills.some((s) => (typeof s === 'string' ? s === skillName : s.name === skillName));

  const toggleSkill = (skillName) => {
    if (isSelected(skillName)) {
      onChange(selectedSkills.filter((s) => (typeof s === 'string' ? s !== skillName : s.name !== skillName)));
    } else {
      if (selectedSkills.length >= maxSkills) return;
      onChange([
        ...selectedSkills,
        {
          name: skillName,
          proficiency: 'Intermediate',
          is_primary: selectedSkills.length < 3,
          display_order: selectedSkills.length
        }
      ]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (!clean) return;

    if (!isSelected(clean) && selectedSkills.length < maxSkills) {
      onChange([
        ...selectedSkills,
        {
          name: clean,
          proficiency: 'Intermediate',
          is_primary: selectedSkills.length < 3,
          display_order: selectedSkills.length
        }
      ]);
      setCustomInput('');
    }
  };

  const setPrimary = (index) => {
    const updated = [...selectedSkills];
    updated[index].is_primary = !updated[index].is_primary;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Selected Skill Badges */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Selected Skills ({selectedSkills.length}/{maxSkills})
          </span>
          <span className="text-xs text-slate-400">
            Click star to toggle primary (top 3)
          </span>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[46px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {selectedSkills.length === 0 ? (
            <span className="text-xs text-slate-400 italic py-1">
              Select at least {minSkills} skill to proceed...
            </span>
          ) : (
            selectedSkills.map((skill, idx) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              const isPrimary = typeof skill === 'object' && skill.is_primary;

              return (
                <div
                  key={skillName}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isPrimary
                      ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPrimary(idx)}
                    title={isPrimary ? 'Primary skill (featured)' : 'Make primary'}
                    className={`transition-colors ${
                      isPrimary ? 'text-amber-500 fill-amber-500' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isPrimary ? 'fill-current' : ''}`} />
                  </button>
                  <span>{skillName}</span>
                  <button
                    type="button"
                    onClick={() => toggleSkill(skillName)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'All'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All Domains
        </button>
        {Object.keys(PREDEFINED_SKILLS).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Custom Skill Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCustom(e)}
            className="w-36 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Skill Suggestions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
        {filteredSkills.map(({ name }) => {
          const selected = isSelected(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleSkill(name)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                selected
                  ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="truncate">{name}</span>
              {selected ? (
                <Check className="w-3.5 h-3.5 text-primary-600 shrink-0 ml-1.5" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
