import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X, Check, ChevronDown } from 'lucide-react';

export const MultiSelect = ({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = 'Select items...',
  max = null,
  error = null,
  required = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(item => item !== val));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, val]);
    }
  };

  const removeOption = (val, e) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== val));
  };

  const filteredOptions = options.filter(opt => {
    const labelStr = typeof opt === 'object' ? opt.label : opt;
    return labelStr.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>{label} {required && <span className="text-rose-500">*</span>}</span>
          {max && (
            <span className="text-xs text-slate-400">
              {selected.length}/{max}
            </span>
          )}
        </label>
      )}

      {/* Selected Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'min-h-[42px] p-2 bg-white dark:bg-slate-900 border rounded-xl flex flex-wrap items-center gap-1.5 cursor-pointer transition-all duration-150',
          'border-slate-200 dark:border-slate-700 hover:border-slate-300',
          isOpen && 'ring-2 ring-blue-500 border-transparent',
          error && 'border-rose-400 bg-rose-50/20'
        )}
      >
        {selected.length === 0 ? (
          <span className="text-sm text-slate-400 pl-1.5 select-none">{placeholder}</span>
        ) : (
          selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 animate-fadeIn"
            >
              {item}
              <button
                type="button"
                onClick={(e) => removeOption(item, e)}
                className="hover:text-blue-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}

        <div className="ml-auto pr-1 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="relative w-full z-50">
          <div className="absolute top-1 left-0 right-0 max-h-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-level-3 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="overflow-y-auto max-h-48 p-1 flex flex-col">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-xs text-center text-slate-400">No matching options</div>
              ) : (
                filteredOptions.map((opt) => {
                  const val = typeof opt === 'object' ? opt.value : opt;
                  const lbl = typeof opt === 'object' ? opt.label : opt;
                  const isChecked = selected.includes(val);

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => toggleOption(val)}
                      className={cn(
                        'w-full px-3 py-2 text-xs text-left rounded-lg flex items-center justify-between transition-colors',
                        isChecked
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <span>{lbl}</span>
                      {isChecked && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs font-medium text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
};
