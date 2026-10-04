import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';

const STATUS_THEMES = {
  todo: { dot: 'bg-slate-400', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' },
  in_progress: { dot: 'bg-primary-500', badge: 'bg-primary-50 dark:bg-primary-950/40 text-primary-600' },
  review: { dot: 'bg-amber-500', badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' },
  done: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' }
};

export default function KanbanColumn({
  status,
  label,
  cards = [],
  onMoveCard,
  onDeleteCard,
  onEditCard,
  onAddCard
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const theme = STATUS_THEMES[status] || STATUS_THEMES.todo;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      onMoveCard(cardId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl p-3.5 border transition-all min-h-[500px] ${
        isDragOver
          ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 ring-2 ring-primary-500/20'
          : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </h3>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${theme.badge}`}>
            {cards.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddCard(status)}
          className="p-1 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          title={`Add card to ${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Area */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
        {cards.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-center text-xs text-slate-400 italic">
            Drag tasks here
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onMove={onMoveCard}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
            />
          ))
        )}
      </div>
    </div>
  );
}
