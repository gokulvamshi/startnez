import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from './NotificationItem';
import { ROUTES } from '../../config/routes';
import { CheckCheck, ExternalLink } from 'lucide-react';

export const NotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  onClose
}) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notif) => {
    onClose();
    if (notif.type.includes('connection')) {
      navigate(ROUTES.CONNECTIONS);
    } else if (notif.type.includes('post') && notif.reference_id) {
      navigate(ROUTES.POST_DETAIL(notif.reference_id));
    } else if (notif.type.includes('startup') && notif.reference_id) {
      navigate(ROUTES.STARTUP_DETAIL(notif.reference_id));
    } else if (notif.type.includes('project') && notif.reference_id) {
      navigate(ROUTES.PROJECT_WORKSPACE(notif.reference_id));
    } else {
      navigate(ROUTES.NOTIFICATIONS);
    }
  };

  return (
    <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-level-3 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-80 p-2 flex flex-col gap-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={onMarkRead}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(ROUTES.NOTIFICATIONS);
          }}
          className="w-full py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors"
        >
          View all notifications
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
