import React from 'react';
import { Avatar } from '../shared/Avatar';
import { DateDisplay } from '../shared/DateDisplay';
import { cn } from '../../lib/utils';
import { UserPlus, Heart, MessageSquare, Briefcase, Rocket, Bell } from 'lucide-react';

export const NotificationItem = ({ notification, onMarkRead, onClick }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="w-3.5 h-3.5 text-blue-600" />;
      case 'post_like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'post_comment':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'project_invite':
      case 'project_message':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-500" />;
      case 'startup_application':
      case 'startup_application_accepted':
      case 'startup_application_rejected':
        return <Rocket className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      onClick={() => {
        if (!notification.is_read) onMarkRead?.(notification.id);
        onClick?.(notification);
      }}
      className={cn(
        'p-3.5 flex items-start gap-3 rounded-xl cursor-pointer transition-colors duration-150',
        notification.is_read
          ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80'
          : 'bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-medium'
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar
          src={notification.sender?.avatar_url}
          name={notification.sender?.full_name || 'System'}
          size="sm"
        />
        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-900 shadow-xs">
          {getIcon(notification.type)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
          <span className="font-semibold text-slate-900 dark:text-white mr-1">
            {notification.title}
          </span>
          {notification.message}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <DateDisplay
            date={notification.created_at}
            className="text-[11px] font-mono text-slate-400"
          />
          {!notification.is_read && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
