import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import NotificationItem from '../components/notifications/NotificationItem';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import SEOHead from '../components/shared/SEOHead';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getNotifications();
      const list = res?.data || res || [];
      setNotifications(Array.isArray(list) ? list : (list.notifications || []));
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Supabase Realtime subscription for incoming notifications
    let channel;
    try {
      channel = supabase
        .channel(`notifications:${user?.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user?.id}` },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();
    } catch (e) {
      // Offline fallback
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleDelete = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationService.deleteNotification(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <SEOHead title="Notifications — HackConnect" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-primary-500" />
            <span>Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Connection updates, project invitations, and post interactions.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {/* List */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="All Caught Up!"
              description="You have no notifications at this time. Activity on your posts and connections will appear here."
            />
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="relative group">
              <NotificationItem
                notification={notif}
                onMarkRead={handleMarkRead}
              />
              <button
                type="button"
                onClick={() => handleDelete(notif.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
