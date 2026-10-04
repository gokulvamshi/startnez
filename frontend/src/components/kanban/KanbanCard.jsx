import React from 'react';
import { MoreHorizontal, Trash2, ArrowRightLeft, GripVertical } from 'lucide-react';
import Avatar from '../shared/Avatar';
import KanbanPriorityBadge from './KanbanPriorityBadge';
import { KANBAN_STATUSES } from '../../config/skills';

export default function KanbanCard({
  card,
  onMove,
  onDelete,
  onEdit
}) {
  if (!card) return null;

  const { id, title, description, status, priority = 0, assigned_to } = card;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('cardId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group space-y-2.5 cursor-grab active:cursor-grabbing"
    >
      {/* Top row: Priority & Actions */}
      <div className="flex items-center justify-between gap-2">
        <KanbanPriorityBadge priority={priority} />

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Quick Column Shift Selector */}
          <select
            value={status}
            onChange={(e) => onMove(id, e.target.value)}
            className="text-[10px] font-semibold py-0.5 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            {KANBAN_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                Move to {s.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onDelete(id)}
            className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete Card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4
        onClick={() => onEdit?.(card)}
        className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        {title}
      </h4>

      {/* Task Description */}
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Footer: Assignee & Drag Grip */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          {assigned_to ? (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={assigned_to.avatar_url}
                name={assigned_to.full_name || 'Member'}
                size="xs"
              />
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
                {assigned_to.full_name}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
          )}
        </div>

        <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
      </div>
    </div>
  );
}
